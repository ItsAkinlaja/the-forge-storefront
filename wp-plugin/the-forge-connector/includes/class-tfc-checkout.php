<?php
defined( 'ABSPATH' ) || exit;

/**
 * Checkout endpoints.
 *
 * POST /forge/v1/checkout        -- Create WooCommerce order + init Paystack transaction
 * GET  /forge/v1/orders/{id}     -- Retrieve a single order (auth required)
 */
class TFC_Checkout {

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {
        register_rest_route( 'forge/v1', '/checkout', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'create_checkout' ],
            'permission_callback' => '__return_true', // works for guests too
        ] );

        register_rest_route( 'forge/v1', '/orders/(?P<id>\d+)', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'get_order' ],
            'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
        ] );
    }

    // ------------------------------------------------------------------ checkout

    public static function create_checkout( $request ) {
        $items            = $request->get_param( 'items' );
        $shipping_address = $request->get_param( 'shippingAddress' );
        $callback_url     = sanitize_url( $request->get_param( 'callbackUrl' ) );

        if ( empty( $items ) || ! is_array( $items ) ) {
            return new WP_Error( 'no_items', 'Cart items are required.', [ 'status' => 400 ] );
        }

        if ( empty( $shipping_address ) ) {
            return new WP_Error( 'no_address', 'Shipping address is required.', [ 'status' => 400 ] );
        }

        // ---- Create WooCommerce order
        $order = wc_create_order();
        if ( is_wp_error( $order ) ) {
            return new WP_Error( 'order_failed', 'Could not create order.', [ 'status' => 500 ] );
        }

        // ---- Add items
        foreach ( $items as $item_data ) {
            $product_id = isset( $item_data['productId'] ) ? absint( $item_data['productId'] ) : 0;
            $quantity   = isset( $item_data['quantity'] )  ? absint( $item_data['quantity'] )  : 1;

            if ( ! $product_id ) continue;

            $product = wc_get_product( $product_id );
            if ( ! $product ) continue;

            $item_id = $order->add_product( $product, $quantity );

            // Store bespoke measurements as meta
            if ( ! empty( $item_data['bespokeMeasurements'] ) && $item_id ) {
                $meta = $item_data['bespokeMeasurements'];
                foreach ( $meta as $key => $value ) {
                    wc_add_order_item_meta( $item_id, '_forge_bespoke_' . sanitize_key( $key ), sanitize_text_field( $value ) );
                }
            }
            if ( ! empty( $item_data['selectedSize'] ) && $item_id ) {
                wc_add_order_item_meta( $item_id, '_forge_size', sanitize_text_field( $item_data['selectedSize'] ) );
            }
        }

        // ---- Set billing / shipping address
        $addr = $shipping_address;
        $billing = [
            'first_name' => sanitize_text_field( $addr['firstName']  ?? '' ),
            'last_name'  => sanitize_text_field( $addr['lastName']   ?? '' ),
            'email'      => sanitize_email( $addr['email']           ?? '' ),
            'phone'      => sanitize_text_field( $addr['phone']      ?? '' ),
            'address_1'  => sanitize_text_field( $addr['address']    ?? '' ),
            'city'       => sanitize_text_field( $addr['city']       ?? '' ),
            'state'      => sanitize_text_field( $addr['state']      ?? '' ),
            'country'    => sanitize_text_field( $addr['country']    ?? 'NG' ),
            'postcode'   => '',
        ];

        $order->set_address( $billing, 'billing' );
        $order->set_address( $billing, 'shipping' );

        // ---- Assign customer if authenticated
        $user = TFC_Auth::get_user_from_token( $request );
        if ( $user ) {
            $order->set_customer_id( $user->ID );
        }

        // ---- Set payment method and currency
        $order->set_payment_method( 'paystack' );
        $order->set_payment_method_title( 'Paystack' );
        $order->set_currency( 'NGN' );
        $order->set_status( 'pending', 'Awaiting Paystack payment.', true );
        $order->calculate_totals();
        $order->save();

        $order_id     = $order->get_id();
        $order_number = $order->get_order_number();
        $total_ngn    = (float) $order->get_total();

        // ---- Initialize Paystack transaction
        $paystack_result = self::init_paystack_transaction(
            $total_ngn,
            $billing['email'],
            $order_id,
            $order_number,
            $callback_url
        );

        if ( is_wp_error( $paystack_result ) ) {
            // Optionally cancel the order
            $order->update_status( 'cancelled', 'Paystack initialization failed.' );
            return $paystack_result;
        }

        // Store reference on order
        $order->set_transaction_id( $paystack_result['reference'] );
        update_post_meta( $order_id, '_paystack_reference', $paystack_result['reference'] );
        $order->save();

        return new WP_REST_Response( [
            'orderId'          => (string) $order_id,
            'orderNumber'      => (string) $order_number,
            'paystackAuthUrl'  => $paystack_result['authorization_url'],
            'reference'        => $paystack_result['reference'],
        ], 201 );
    }

    // ------------------------------------------------------------------ get order

    public static function get_order( $request ) {
        $user     = TFC_Auth::get_user_from_token( $request );
        $order_id = absint( $request->get_param( 'id' ) );
        $order    = wc_get_order( $order_id );

        if ( ! $order ) {
            return new WP_Error( 'not_found', 'Order not found.', [ 'status' => 404 ] );
        }

        // Only allow access to own orders (or admins)
        if ( $user && ! user_can( $user, 'manage_woocommerce' ) && (int) $order->get_customer_id() !== (int) $user->ID ) {
            return new WP_Error( 'forbidden', 'Access denied.', [ 'status' => 403 ] );
        }

        return new WP_REST_Response( self::format_order( $order ), 200 );
    }

    // ------------------------------------------------------------------ Paystack

    private static function get_paystack_secret_key(): string {
        // Try WooCommerce Paystack gateway settings first
        $options = get_option( 'woocommerce_paystack_settings', [] );

        $testmode   = isset( $options['testmode'] ) && $options['testmode'] === 'yes';
        $secret_key = $testmode
            ? ( $options['test_secret_key'] ?? '' )
            : ( $options['live_secret_key'] ?? '' );

        // Fall back to a WordPress constant
        if ( empty( $secret_key ) && defined( 'PAYSTACK_SECRET_KEY' ) ) {
            $secret_key = PAYSTACK_SECRET_KEY;
        }

        return $secret_key;
    }

    private static function init_paystack_transaction(
        float $amount_ngn,
        string $email,
        int $order_id,
        string $order_number,
        string $callback_url
    ) {
        $secret_key = self::get_paystack_secret_key();

        if ( empty( $secret_key ) ) {
            return new WP_Error( 'no_paystack_key', 'Paystack secret key not configured.', [ 'status' => 500 ] );
        }

        $amount_kobo = (int) round( $amount_ngn * 100 );

        // Append orderId to callback URL
        $full_callback = add_query_arg( 'orderId', $order_id, $callback_url );

        $body = wp_json_encode( [
            'email'        => $email,
            'amount'       => $amount_kobo,
            'currency'     => 'NGN',
            'callback_url' => $full_callback,
            'metadata'     => [
                'orderId'     => $order_id,
                'orderNumber' => $order_number,
                'cancel_action' => home_url( '/cart' ),
            ],
        ] );

        $response = wp_remote_post( 'https://api.paystack.co/transaction/initialize', [
            'headers' => [
                'Authorization' => 'Bearer ' . $secret_key,
                'Content-Type'  => 'application/json',
            ],
            'body'    => $body,
            'timeout' => 30,
        ] );

        if ( is_wp_error( $response ) ) {
            return new WP_Error( 'paystack_error', $response->get_error_message(), [ 'status' => 502 ] );
        }

        $data = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( empty( $data['status'] ) || ! $data['status'] ) {
            $msg = $data['message'] ?? 'Paystack initialization failed.';
            return new WP_Error( 'paystack_failed', $msg, [ 'status' => 502 ] );
        }

        return $data['data']; // contains authorization_url, reference, access_code
    }

    // ------------------------------------------------------------------ format

    private static function format_order( WC_Order $order ): array {
        $items = [];
        foreach ( $order->get_items() as $item ) {
            $product = $item->get_product();
            $items[] = [
                'id'           => (string) $item->get_id(),
                'name'         => $item->get_name(),
                'quantity'     => $item->get_quantity(),
                'price'        => (float) ( $item->get_total() / max( 1, $item->get_quantity() ) ),
                'total'        => (float) $item->get_total(),
                'selectedSize' => wc_get_order_item_meta( $item->get_id(), '_forge_size', true ) ?: '',
                'product'      => $product ? [
                    'id'    => (string) $product->get_id(),
                    'name'  => $product->get_name(),
                    'slug'  => $product->get_slug(),
                    'price' => (float) $product->get_price(),
                    'images' => array_map( function( $img_id ) {
                        return [
                            'id'  => (string) $img_id,
                            'src' => wp_get_attachment_url( $img_id ) ?: '',
                            'alt' => get_post_meta( $img_id, '_wp_attachment_image_alt', true ) ?: '',
                        ];
                    }, $product->get_gallery_image_ids() ?: [ $product->get_image_id() ] ),
                ] : null,
            ];
        }

        $shipping = $order->get_address( 'billing' );
        $total    = (float) $order->get_total();

        $wc_status_map = [
            'pending'    => 'pending',
            'processing' => 'processing',
            'completed'  => 'completed',
            'cancelled'  => 'cancelled',
            'on-hold'    => 'pending',
            'refunded'   => 'cancelled',
            'failed'     => 'cancelled',
        ];
        $status = $wc_status_map[ $order->get_status() ] ?? 'pending';

        return [
            'id'              => (string) $order->get_id(),
            'orderNumber'     => $order->get_order_number(),
            'status'          => $status,
            'items'           => $items,
            'shippingAddress' => [
                'firstName' => $shipping['first_name'] ?? '',
                'lastName'  => $shipping['last_name']  ?? '',
                'email'     => $shipping['email']      ?? '',
                'phone'     => $shipping['phone']      ?? '',
                'address'   => $shipping['address_1']  ?? '',
                'city'      => $shipping['city']       ?? '',
                'state'     => $shipping['state']      ?? '',
                'country'   => $shipping['country']    ?? '',
            ],
            'subtotal'        => (float) $order->get_subtotal(),
            'shippingFee'     => (float) $order->get_shipping_total(),
            'total'           => $total,
            'formattedTotal'  => '₦' . number_format( $total, 0, '.', ',' ),
            'paystackReference' => get_post_meta( $order->get_id(), '_paystack_reference', true ) ?: null,
            'createdAt'       => $order->get_date_created()?->date( 'c' ) ?? '',
        ];
    }
}
