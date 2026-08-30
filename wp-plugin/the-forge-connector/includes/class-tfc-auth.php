<?php
defined( 'ABSPATH' ) || exit;

/**
 * JWT-based authentication endpoints.
 *
 * POST /forge/v1/auth/login          -- { email, password } -> { token, user }
 * POST /forge/v1/auth/register       -- { email, password, firstName, lastName } -> { token, user }
 * GET  /forge/v1/auth/me             -- (Bearer token) -> { user }
 * POST /forge/v1/auth/logout         -- (Bearer token) -> { success }
 */
class TFC_Auth {

    private static string $secret;

    public static function init() {
        self::$secret = defined( 'TFC_JWT_SECRET' ) ? TFC_JWT_SECRET : wp_salt( 'auth' );
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes() {
        $base = 'forge/v1/auth';

        register_rest_route( $base, '/login', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'login' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( $base, '/register', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'register' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( $base, '/me', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'me' ],
            'permission_callback' => [ __CLASS__, 'require_auth' ],
        ] );

        register_rest_route( $base, '/logout', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'logout' ],
            'permission_callback' => [ __CLASS__, 'require_auth' ],
        ] );
    }

    // ------------------------------------------------------------------ LOGIN

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

    // --------------------------------------------------------------- REGISTER

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

    // -------------------------------------------------------------------  ME

    public static function me( $request ) {
        $user = self::get_user_from_token( $request );
        return rest_ensure_response( self::format_user( $user ) );
    }

    // ---------------------------------------------------------------- LOGOUT

    public static function logout( $request ) {
        // Stateless JWT -- client just discards token. We invalidate via a blocklist stored in transients.
        $token   = self::extract_token( $request );
        $payload = self::decode_token( $token );
        if ( $payload ) {
            $exp = $payload['exp'] ?? ( time() + 3600 );
            set_transient( 'tfc_revoked_' . md5( $token ), 1, $exp - time() );
        }
        return rest_ensure_response( [ 'success' => true ] );
    }

    // -------------------------------------------------- TOKEN HELPERS

    public static function generate_token( WP_User $user ): string {
        $issued  = time();
        $expires = $issued + ( 7 * DAY_IN_SECONDS ); // 7-day tokens

        $payload = [
            'iss'   => get_bloginfo( 'url' ),
            'iat'   => $issued,
            'exp'   => $expires,
            'sub'   => $user->ID,
            'email' => $user->user_email,
            'roles' => $user->roles,
        ];

        $header    = self::base64url_encode( json_encode( [ 'typ' => 'JWT', 'alg' => 'HS256' ] ) );
        $payload_b = self::base64url_encode( json_encode( $payload ) );
        $sig       = self::base64url_encode( hash_hmac( 'sha256', "$header.$payload_b", self::$secret, true ) );

        return "$header.$payload_b.$sig";
    }

    public static function decode_token( string $token ): ?array {
        $parts = explode( '.', $token );
        if ( count( $parts ) !== 3 ) return null;

        [ $header, $payload_b, $sig ] = $parts;
        $expected_sig = self::base64url_encode( hash_hmac( 'sha256', "$header.$payload_b", self::$secret, true ) );

        if ( ! hash_equals( $expected_sig, $sig ) ) return null;

        $payload = json_decode( self::base64url_decode( $payload_b ), true );
        if ( ! $payload || $payload['exp'] < time() ) return null;

        // Check revocation list
        if ( get_transient( 'tfc_revoked_' . md5( $token ) ) ) return null;

        return $payload;
    }

    public static function require_auth( $request ): bool|WP_Error {
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

    public static function get_user_from_token( $request ): ?WP_User {
        $token   = self::extract_token( $request );
        $payload = self::decode_token( $token );
        if ( ! $payload ) return null;
        return get_user_by( 'ID', $payload['sub'] );
    }

    private static function extract_token( $request ): ?string {
        $auth_header = $request->get_header( 'authorization' );
        if ( $auth_header && str_starts_with( $auth_header, 'Bearer ' ) ) {
            return trim( substr( $auth_header, 7 ) );
        }
        return null;
    }

    private static function base64url_encode( string $data ): string {
        return rtrim( strtr( base64_encode( $data ), '+/', '-_' ), '=' );
    }

    private static function base64url_decode( string $data ): string {
        return base64_decode( strtr( $data, '-_', '+/' ) );
    }

    public static function format_user( WP_User $user ): array {
        return [
            'id'        => $user->ID,
            'email'     => $user->user_email,
            'firstName' => $user->first_name,
            'lastName'  => $user->last_name,
            'displayName' => $user->display_name,
            'roles'     => $user->roles,
            'createdAt' => $user->user_registered,
        ];
    }
}