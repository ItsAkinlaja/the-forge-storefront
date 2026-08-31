<?php
defined( 'ABSPATH' ) || exit;

/**
 * Cart endpoints -- supports both authenticated users and guests.
 *
 * Auth users:  Authorization: Bearer {jwt}  --> stored in user meta
 * Guests:      X-Guest-Cart: {token}        --> stored in transient
 *
 * GET    /forge/v1/cart
 * POST   /forge/v1/cart
 * PUT    /forge/v1/cart/{itemId}
 * DELETE /forge/v1/cart/{itemId}
 * DELETE /forge/v1/cart
 */
class TFC_Cart {

    const META_KEY        = '_forge_cart';
    const GUEST_TRANSIENT = 'forge_guest_cart_';
    const GUEST_EXPIRY    = 2592000; // 30 days

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {
        $base = 'forge/v1/cart';

        register_rest_route( $base, '', [
            [ 'methods' => 'GET',    'callback' => [ __CLASS__, 'get_cart'   ], 'permission_callback' => '__return_true' ],
            [ 'methods' => 'POST',   'callback' => [ __CLASS__, 'add_item'   ], 'permission_callback' => '__return_true' ],
            [ 'methods' => 'DELETE', 'callback' => [ __CLASS__, 'clear_cart' ], 'permission_callback' => '__return_true' ],
        ] );

        register_rest_route( $base, '/(?P<itemId>[a-zA-Z0-9_-]+)', [
            [ 'methods' => 'PUT',    'callback' => [ __CLASS__, 'update_item' ], 'permission_callback' => '__return_true' ],
            [ 'methods' => 'DELETE', 'callback' => [ __CLASS__, 'remove_item' ], 'permission_callback' => '__return_true' ],
        ] );
    }

    // ── Owner resolution ──────────────────────────────────────────────────────

    /**
     * Returns ['type'=>'user','id'=>int] or ['type'=>'guest','token'=>string]
     */
    private static function resolve_owner( WP_REST_Request $request ): array {
        // Try JWT auth first
        $auth   = $request->get_header( 'authorization' );
        if ( $auth && strpos( $auth, 'Bearer ' ) === 0 ) {
            $token   = trim( substr( $auth, 7 ) );
            $payload = TFC_Auth::decode_token( $token );
            if ( $payload ) {
                return [ 'type' => 'user', 'id' => (int) $payload['sub'] ];
            }
        }

        // Fall back to guest cart token
        $guest_token = $request->get_header( 'x-guest-cart' );
        // Validate token length (max 64 chars) to prevent transient key abuse
        if ( empty( $guest_token ) || strlen( $guest_token ) > 64 || ! preg_match( '/^[a-f0-9]+$/i', $guest_token ) ) {
            $guest_token = wp_generate_uuid4();
        }
        return [ 'type' => 'guest', 'token' => sanitize_text_field( $guest_token ) ];
    }

    private static function load_cart( array $owner ): array {
        if ( $owner['type'] === 'user' ) {
            $raw = get_user_meta( $owner['id'], self::META_KEY, true );
            return is_array( $raw ) ? $raw : [];
        }
        $raw = get_transient( self::GUEST_TRANSIENT . $owner['token'] );
        return is_array( $raw ) ? $raw : [];
    }

    private static function save_cart( array $owner, array $cart ): void {
        if ( $owner['type'] === 'user' ) {
            update_user_meta( $owner['id'], self::META_KEY, $cart );
            return;
        }
        set_transient( self::GUEST_TRANSIENT . $owner['token'], $cart, self::GUEST_EXPIRY );
    }

    // ── Handlers ──────────────────────────────────────────────────────────────

    public static function get_cart( WP_REST_Request $request ) {
        $owner = self::resolve_owner( $request );
        $cart  = self::load_cart( $owner );
        return rest_ensure_response( self::cart_response( $cart, $owner ) );
    }

    public static function add_item( WP_REST_Request $request ) {
        $owner      = self::resolve_owner( $request );
        $product_id = intval( $request->get_param( 'productId' ) );
        $quantity   = max( 1, intval( $request->get_param( 'quantity' ) ?: 1 ) );
        $size       = sanitize_text_field( $request->get_param( 'selectedSize' ) ?: 'Standard' );
        $bespoke    = $request->get_param( 'bespokeMeasurements' );

        if ( ! $product_id || ! wc_get_product( $product_id ) ) {
            return new WP_Error( 'invalid_product', 'Product not found.', [ 'status' => 404 ] );
        }

        $cart    = self::load_cart( $owner );
        $item_id = md5( $product_id . $size . microtime() );

        if ( ! $bespoke ) {
            foreach ( $cart as $key => $item ) {
                if ( $item['productId'] === $product_id && $item['selectedSize'] === $size ) {
                    $cart[ $key ]['quantity'] += $quantity;
                    self::save_cart( $owner, $cart );
                    return rest_ensure_response( self::cart_response( $cart, $owner ) );
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

        self::save_cart( $owner, $cart );
        return new WP_REST_Response( self::cart_response( $cart, $owner ), 201 );
    }

    public static function update_item( WP_REST_Request $request ) {
        $owner    = self::resolve_owner( $request );
        $item_id  = $request['itemId'];
        $quantity = max( 0, intval( $request->get_param( 'quantity' ) ) );
        $cart     = self::load_cart( $owner );

        if ( ! isset( $cart[ $item_id ] ) ) {
            return new WP_Error( 'not_found', 'Cart item not found.', [ 'status' => 404 ] );
        }

        if ( $quantity === 0 ) {
            unset( $cart[ $item_id ] );
        } else {
            $cart[ $item_id ]['quantity'] = $quantity;
        }

        self::save_cart( $owner, $cart );
        return rest_ensure_response( self::cart_response( $cart, $owner ) );
    }

    public static function remove_item( WP_REST_Request $request ) {
        $owner   = self::resolve_owner( $request );
        $item_id = $request['itemId'];
        $cart    = self::load_cart( $owner );
        unset( $cart[ $item_id ] );
        self::save_cart( $owner, $cart );
        return rest_ensure_response( self::cart_response( $cart, $owner ) );
    }

    public static function clear_cart( WP_REST_Request $request ) {
        $owner = self::resolve_owner( $request );
        self::save_cart( $owner, [] );
        return rest_ensure_response( self::cart_response( [], $owner ) );
    }

    // ── Cart merge (called from auth on login/register) ───────────────────────

    public static function merge_guest_into_user( string $guest_token, int $user_id ): void {
        $guest_cart = get_transient( self::GUEST_TRANSIENT . $guest_token );
        if ( empty( $guest_cart ) || ! is_array( $guest_cart ) ) return;

        $user_cart = get_user_meta( $user_id, self::META_KEY, true );
        if ( ! is_array( $user_cart ) ) $user_cart = [];

        foreach ( $guest_cart as $guest_item ) {
            $merged = false;
            foreach ( $user_cart as $key => $user_item ) {
                if (
                    $user_item['productId'] === $guest_item['productId'] &&
                    $user_item['selectedSize'] === $guest_item['selectedSize'] &&
                    empty( $guest_item['bespokeMeasurements'] )
                ) {
                    $user_cart[ $key ]['quantity'] += $guest_item['quantity'];
                    $merged = true;
                    break;
                }
            }
            if ( ! $merged ) {
                $user_cart[ $guest_item['id'] ] = $guest_item;
            }
        }

        update_user_meta( $user_id, self::META_KEY, $user_cart );
        delete_transient( self::GUEST_TRANSIENT . $guest_token );
    }

    // ── Response ──────────────────────────────────────────────────────────────

    private static function cart_response( array $cart, array $owner ): array {
        $items    = array_values( $cart );
        $subtotal = 0;
        $hydrated = [];

        foreach ( $items as $item ) {
            $wc = wc_get_product( $item['productId'] );
            if ( ! $wc ) continue;
            $price     = (float) $wc->get_price();
            $subtotal += $price * $item['quantity'];
            $item['product'] = TFC_Products::format_product( $wc );
            $hydrated[] = $item;
        }

        $response = [
            'items'             => $hydrated,
            'count'             => array_sum( array_column( $hydrated, 'quantity' ) ),
            'subtotal'          => $subtotal,
            'formattedSubtotal' => 'NGN ' . number_format( $subtotal, 0, '.', ',' ),
        ];

        if ( $owner['type'] === 'guest' ) {
            $response['guestToken'] = $owner['token'];
        }

        return $response;
    }
}