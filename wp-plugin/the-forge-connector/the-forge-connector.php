<?php
/**
 * Plugin Name:       The Forge Connector
 * Plugin URI:        https://akinlajatimileyin.dev
 * Description:       Headless REST API connector for The Forge Next.js storefront. Handles products, authentication, user accounts, server-side cart, custom requests, and newsletter leads via WooCommerce.
 * Version:           1.1.0
 * Author:            Akinlaja Timileyin
 * Author URI:        https://akinlajatimileyin.dev
 * License:           GPL-2.0+
 * Text Domain:       the-forge-connector
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * WC requires at least: 8.0
 */

defined( 'ABSPATH' ) || exit;

define( 'TFC_VERSION',    '1.1.0' );
define( 'TFC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TFC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

function tfc_boot() {
    static $booted = false;
    if ( $booted ) return;

    if ( ! function_exists( 'WC' ) && ! class_exists( 'WooCommerce' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>The Forge Connector</strong> requires WooCommerce to be installed and active.</p></div>';
        } );
        return;
    }

    $booted = true;

    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-cors.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-products.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-auth.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-cart.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-users.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-checkout.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-custom-requests.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-subscribers.php';

    TFC_CORS::init();
    TFC_Products::init();
    TFC_Auth::init();
    TFC_Cart::init();
    TFC_Users::init();
    TFC_Checkout::init();
    TFC_Custom_Requests::init();
    TFC_Subscribers::init();
}

add_action( 'woocommerce_loaded', 'tfc_boot' );
add_action( 'plugins_loaded', 'tfc_boot', 20 );