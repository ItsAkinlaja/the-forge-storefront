<?php
defined( 'ABSPATH' ) || exit;

class TFC_CORS {

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'add_cors_headers' ], 15 );
        add_filter( 'rest_pre_serve_request', [ __CLASS__, 'handle_preflight' ] );
    }

    public static function add_cors_headers() {
        remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
        add_filter( 'rest_pre_serve_request', function( $value ) {
            self::send_headers();
            return $value;
        } );
    }

    public static function handle_preflight( $value ) {
        if ( $_SERVER['REQUEST_METHOD'] === 'OPTIONS' ) {
            self::send_headers();
            header( 'HTTP/1.1 200 OK' );
            exit;
        }
        return $value;
    }

    private static function send_headers() {
        $allowed_origins = [
            'https://theforgebrand.shop',
            'https://www.theforgebrand.shop',
            'http://localhost:3000',
            'http://localhost:3001',
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ( in_array( $origin, $allowed_origins, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . $origin );
        }

        header( 'Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS' );
        header( 'Access-Control-Allow-Credentials: true' );
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With' );
        header( 'Access-Control-Max-Age: 86400' );
        header( 'Vary: Origin' );
    }
}