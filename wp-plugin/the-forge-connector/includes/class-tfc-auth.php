<?php
defined( 'ABSPATH' ) || exit;

class TFC_Auth {

    private static $secret = '';

    public static function init() {
        self::$secret = defined( 'TFC_JWT_SECRET' ) ? TFC_JWT_SECRET : wp_salt( 'auth' );
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {
        register_rest_route( 'forge/v1', '/auth/login', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'login' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'forge/v1', '/auth/register', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'register' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'forge/v1', '/auth/me', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'me' ],
            'permission_callback' => [ __CLASS__, 'require_auth' ],
        ] );

        register_rest_route( 'forge/v1', '/auth/logout', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'logout' ],
            'permission_callback' => [ __CLASS__, 'require_auth' ],
        ] );
    }

    public static function login( $request ) {
        $email    = sanitize_email( $request->get_param( 'email' ) );
        $password = $request->get_param( 'password' );

        if ( empty( $email ) || empty( $password ) ) {
            return new WP_Error( 'missing_credentials', 'Email and password are required.', [ 'status' => 400 ] );
        }

        $user = get_user_by( 'email', $email );

        if ( ! $user || ! wp_check_password( $password, $user->user_pass, $user->ID ) ) {
            return new WP_Error( 'invalid_credentials', 'Incorrect email or password.', [ 'status' => 401 ] );
        }

        return rest_ensure_response( [
            'token' => self::generate_token( $user ),
            'user'  => self::format_user( $user ),
        ] );
    }

    public static function register( $request ) {
        $email      = sanitize_email( $request->get_param( 'email' ) );
        $password   = $request->get_param( 'password' );
        $first_name = sanitize_text_field( $request->get_param( 'firstName' ) ?: '' );
        $last_name  = sanitize_text_field( $request->get_param( 'lastName' )  ?: '' );

        if ( empty( $email ) || empty( $password ) ) {
            return new WP_Error( 'missing_fields', 'Email and password are required.', [ 'status' => 400 ] );
        }
        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please provide a valid email address.', [ 'status' => 400 ] );
        }
        if ( email_exists( $email ) ) {
            return new WP_Error( 'email_exists', 'An account with this email already exists.', [ 'status' => 409 ] );
        }
        if ( strlen( $password ) < 8 ) {
            return new WP_Error( 'weak_password', 'Password must be at least 8 characters.', [ 'status' => 400 ] );
        }

        $username = sanitize_user( current( explode( '@', $email ) ) . '_' . wp_generate_password( 4, false ) );
        $user_id  = wp_insert_user( [
            'user_login' => $username,
            'user_email' => $email,
            'user_pass'  => $password,
            'first_name' => $first_name,
            'last_name'  => $last_name,
            'role'       => 'customer',
        ] );

        if ( is_wp_error( $user_id ) ) {
            return new WP_Error( 'registration_failed', $user_id->get_error_message(), [ 'status' => 500 ] );
        }

        $user = get_user_by( 'ID', $user_id );
        return new WP_REST_Response( [
            'token' => self::generate_token( $user ),
            'user'  => self::format_user( $user ),
        ], 201 );
    }

    public static function me( $request ) {
        $user = self::get_user_from_token( $request );
        if ( ! $user ) {
            return new WP_Error( 'invalid_token', 'Token invalid or expired.', [ 'status' => 401 ] );
        }
        return rest_ensure_response( self::format_user( $user ) );
    }

    public static function logout( $request ) {
        $token   = self::extract_token( $request );
        $payload = self::decode_token( $token );
        if ( $payload ) {
            $exp = isset( $payload['exp'] ) ? $payload['exp'] : ( time() + 3600 );
            set_transient( 'tfc_revoked_' . md5( $token ), 1, $exp - time() );
        }
        return rest_ensure_response( [ 'success' => true ] );
    }

    public static function require_auth( $request ) {
        $token = self::extract_token( $request );
        if ( ! $token ) {
            return new WP_Error( 'no_token', 'Authentication token required.', [ 'status' => 401 ] );
        }
        $payload = self::decode_token( $token );
        if ( ! $payload ) {
            return new WP_Error( 'invalid_token', 'Token is invalid or expired.', [ 'status' => 401 ] );
        }
        return true;
    }

    public static function get_user_from_token( $request ) {
        $token   = self::extract_token( $request );
        if ( ! $token ) return null;
        $payload = self::decode_token( $token );
        if ( ! $payload ) return null;
        return get_user_by( 'ID', $payload['sub'] );
    }

    public static function generate_token( $user ) {
        $issued  = time();
        $expires = $issued + ( 7 * DAY_IN_SECONDS );

        $payload = [
            'iss'   => get_bloginfo( 'url' ),
            'iat'   => $issued,
            'exp'   => $expires,
            'sub'   => $user->ID,
            'email' => $user->user_email,
            'roles' => $user->roles,
        ];

        $header    = self::b64url( json_encode( [ 'typ' => 'JWT', 'alg' => 'HS256' ] ) );
        $payload_b = self::b64url( json_encode( $payload ) );
        $sig       = self::b64url( hash_hmac( 'sha256', "$header.$payload_b", self::$secret, true ) );

        return "$header.$payload_b.$sig";
    }

    public static function decode_token( $token ) {
        if ( empty( $token ) ) return null;
        $parts = explode( '.', $token );
        if ( count( $parts ) !== 3 ) return null;

        list( $header, $payload_b, $sig ) = $parts;
        $expected = self::b64url( hash_hmac( 'sha256', "$header.$payload_b", self::$secret, true ) );

        if ( ! hash_equals( $expected, $sig ) ) return null;

        $payload = json_decode( base64_decode( strtr( $payload_b, '-_', '+/' ) ), true );
        if ( ! $payload || $payload['exp'] < time() ) return null;
        if ( get_transient( 'tfc_revoked_' . md5( $token ) ) ) return null;

        return $payload;
    }

    private static function extract_token( $request ) {
        $auth = $request->get_header( 'authorization' );
        if ( $auth && strpos( $auth, 'Bearer ' ) === 0 ) {
            return trim( substr( $auth, 7 ) );
        }
        return null;
    }

    private static function b64url( $data ) {
        return rtrim( strtr( base64_encode( $data ), '+/', '-_' ), '=' );
    }

    public static function format_user( $user ) {
        return [
            'id'          => $user->ID,
            'email'       => $user->user_email,
            'firstName'   => $user->first_name,
            'lastName'    => $user->last_name,
            'displayName' => $user->display_name,
            'roles'       => $user->roles,
            'createdAt'   => $user->user_registered,
        ];
    }
}