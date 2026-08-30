<?php
defined( 'ABSPATH' ) || exit;

/**
 * Server-side cart endpoints (persisted in WP user meta).
 *
 * GET    /forge/v1/cart              -- get cart for authenticated user
 * POST   /forge/v1/cart              -- add item { productId, quantity, selectedSize?, bespokeMeasurements? }
 * PUT    /forge/v1/cart/{itemId}     -- update quantity { quantity }
 * DELETE /forge/v1/cart/{itemId}     -- remove item
 * DELETE /forge/v1/cart              -- clear cart
 */
class TFC_Cart {

    const META_KEY = '_forge_cart';

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {
        $base = 'forge/v1/cart';

        register_rest_route( $base, '', [
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'get_cart' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'add_item' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [ __CLASS__, 'clear_cart' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
        ] );

        register_rest_route( $base, '/(?P<itemId>[a-zA-Z0-9_-]+)', [
            [
                'methods'             => 'PUT',
                'callback'            => [ __CLASS__, 'update_item' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
            [
                'methods'             => 'DELETE',
                'callback'            => [ __CLASS__, 'remove_item' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
        ] );
    }

    public static function get_cart( $request ) {
        $user = TFC_Auth::get_user_from_token( $request );
        $cart = self::load_cart( $user->ID );
        return rest_ensure_response( self::cart_response( $cart ) );
    }

    public static function add_item( $request ) {
        $user       = TFC_Auth::get_user_from_token( $request );
        $product_id = intval( $request->get_param( 'productId' ) );
        $quantity   = max( 1, intval( $request->get_param( 'quantity' ) ?: 1 ) );
        $size       = sanitize_text_field( $request->get_param( 'selectedSize' ) ?: 'Bespoke Custom Fit' );
        $bespoke    = $request->get_param( 'bespokeMeasurements' );

        if ( ! $product_id || ! wc_get_product( $product_id ) ) {
            return new WP_Error( 'invalid_product', 'Product not found.', [ 'status' => 404 ] );
        }

        $cart    = self::load_cart( $user->ID );
        $item_id = md5( $product_id . $size . microtime() );

        // If same product+size and not bespoke, increment existing
        if ( ! $bespoke ) {
            foreach ( $cart as $key => $item ) {
                if ( $item['productId'] === $product_id && $item['selectedSize'] === $size ) {
                    $cart[ $key ]['quantity'] += $quantity;
                    self::save_cart( $user->ID, $cart );
                    return rest_ensure_response( self::cart_response( $cart ) );
                }
            }
        }

        $cart[ $item_id ] = [
            'id'                  => $item_id,
            'productId'           => $product_id,
            'quantity'            => $quantity,
            'selectedSize'        => $size,
            'bespokeMeasurements' => $bespoke ? (array) $bespoke : null,
            'addedAt'             => time(),
        ];

        self::save_cart( $user->ID, $cart );
        return new WP_REST_Response( self::cart_response( $cart ), 201 );
    }

    public static function update_item( $request ) {
        $user     = TFC_Auth::get_user_from_token( $request );
        $item_id  = $request['itemId'];
        $quantity = max( 0, intval( $request->get_param( 'quantity' ) ) );

        $cart = self::load_cart( $user->ID );

        if ( ! isset( $cart[ $item_id ] ) ) {
            return new WP_Error( 'not_found', 'Cart item not found.', [ 'status' => 404 ] );
        }

        if ( $quantity === 0 ) {
            unset( $cart[ $item_id ] );
        } else {
            $cart[ $item_id ]['quantity'] = $quantity;
        }

        self::save_cart( $user->ID, $cart );
        return rest_ensure_response( self::cart_response( $cart ) );
    }

    public static function remove_item( $request ) {
        $user    = TFC_Auth::get_user_from_token( $request );
        $item_id = $request['itemId'];
        $cart    = self::load_cart( $user->ID );

        unset( $cart[ $item_id ] );
        self::save_cart( $user->ID, $cart );
        return rest_ensure_response( self::cart_response( $cart ) );
    }

    public static function clear_cart( $request ) {
        $user = TFC_Auth::get_user_from_token( $request );
        self::save_cart( $user->ID, [] );
        return rest_ensure_response( self::cart_response( [] ) );
    }

    // ------------------------------------------------------------------ HELPERS

    private static function load_cart( int $user_id ): array {
        $raw = get_user_meta( $user_id, self::META_KEY, true );
        return is_array( $raw ) ? $raw : [];
    }

    private static function save_cart( int $user_id, array $cart ): void {
        update_user_meta( $user_id, self::META_KEY, $cart );
    }

    private static function cart_response( array $cart ): array {
        $items    = array_values( $cart );
        $subtotal = 0;

        // Hydrate product data
        $hydrated = [];
        foreach ( $items as $item ) {
            $wc = wc_get_product( $item['productId'] );
            if ( ! $wc ) continue;
            $price     = (float) $wc->get_price();
            $subtotal += $price * $item['quantity'];
            $item['product'] = TFC_Products::format_product( $wc );
            $hydrated[] = $item;
        }

        return [
            'items'            => $hydrated,
            'count'            => array_sum( array_column( $hydrated, 'quantity' ) ),
            'subtotal'         => $subtotal,
            'formattedSubtotal' => '$' . number_format( $subtotal, 0, '.', ',' ),
        ];
    }
}