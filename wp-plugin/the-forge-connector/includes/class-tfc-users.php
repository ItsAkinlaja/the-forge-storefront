<?php
defined( 'ABSPATH' ) || exit;

/**
 * User profile endpoints.
 *
 * GET   /forge/v1/users/me           -- get full profile
 * PATCH /forge/v1/users/me           -- update profile { firstName, lastName, phone }
 * PATCH /forge/v1/users/me/password  -- change password { currentPassword, newPassword }
 * GET   /forge/v1/users/me/orders    -- list WooCommerce orders for this user
 */
class TFC_Users {

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {
        $base = 'forge/v1/users';

        register_rest_route( $base, '/me', [
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'get_profile' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
            [
                'methods'             => 'PATCH',
                'callback'            => [ __CLASS__, 'update_profile' ],
                'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
            ],
        ] );

        register_rest_route( $base, '/me/password', [
            'methods'             => 'PATCH',
            'callback'            => [ __CLASS__, 'change_password' ],
            'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
        ] );

        register_rest_route( $base, '/me/orders', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'get_orders' ],
            'permission_callback' => [ 'TFC_Auth', 'require_auth' ],
        ] );
    }

    public static function get_profile( $request ) {
        $user = TFC_Auth::get_user_from_token( $request );
        return rest_ensure_response( self::format_full_profile( $user ) );
    }

    public static function update_profile( $request ) {
        $user  = TFC_Auth::get_user_from_token( $request );
        $data  = [];

        if ( $fn = $request->get_param( 'firstName' ) ) $data['first_name'] = sanitize_text_field( $fn );
        if ( $ln = $request->get_param( 'lastName' ) )  $data['last_name']  = sanitize_text_field( $ln );
        if ( $ph = $request->get_param( 'phone' ) )     update_user_meta( $user->ID, 'billing_phone', sanitize_text_field( $ph ) );

        if ( ! empty( $data ) ) {
            $data['ID'] = $user->ID;
            wp_update_user( $data );
        }

        $user = get_user_by( 'ID', $user->ID );
        return rest_ensure_response( self::format_full_profile( $user ) );
    }

    public static function change_password( $request ) {
        $user         = TFC_Auth::get_user_from_token( $request );
        $current_pass = $request->get_param( 'currentPassword' );
        $new_pass     = $request->get_param( 'newPassword' );

        if ( ! wp_check_password( $current_pass, $user->user_pass, $user->ID ) ) {
            return new WP_Error( 'wrong_password', 'Current password is incorrect.', [ 'status' => 400 ] );
        }

        if ( strlen( $new_pass ) < 8 ) {
            return new WP_Error( 'weak_password', 'New password must be at least 8 characters.', [ 'status' => 400 ] );
        }

        wp_set_password( $new_pass, $user->ID );

        return rest_ensure_response( [ 'success' => true, 'message' => 'Password updated successfully.' ] );
    }

    public static function get_orders( $request ) {
        $user   = TFC_Auth::get_user_from_token( $request );
        $orders = wc_get_orders( [
            'customer_id' => $user->ID,
            'limit'       => 20,
            'orderby'     => 'date',
            'order'       => 'DESC',
            'status'      => [ 'wc-pending', 'wc-processing', 'wc-on-hold', 'wc-completed', 'wc-cancelled' ],
        ] );

        $formatted = [];
        foreach ( $orders as $order ) {
            $items = [];
            foreach ( $order->get_items() as $item ) {
                $items[] = [
                    'name'     => $item->get_name(),
                    'quantity' => $item->get_quantity(),
                    'total'    => $item->get_total(),
                ];
            }
            $formatted[] = [
                'id'          => $order->get_id(),
                'number'      => $order->get_order_number(),
                'status'      => $order->get_status(),
                'total'       => $order->get_total(),
                'currency'    => $order->get_currency(),
                'dateCreated' => $order->get_date_created()?->date( 'c' ),
                'items'       => $items,
            ];
        }

        return rest_ensure_response( $formatted );
    }

    private static function format_full_profile( WP_User $user ): array {
        return [
            'id'          => $user->ID,
            'email'       => $user->user_email,
            'firstName'   => $user->first_name,
            'lastName'    => $user->last_name,
            'displayName' => $user->display_name,
            'phone'       => get_user_meta( $user->ID, 'billing_phone', true ) ?: '',
            'roles'       => $user->roles,
            'createdAt'   => $user->user_registered,
        ];
    }
}