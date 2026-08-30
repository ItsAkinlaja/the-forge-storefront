<?php
/**
 * Plugin Name:       The Forge Connector
 * Plugin URI:        https://theforgebrand.shop
 * Description:       Headless REST API connector for The Forge Next.js storefront. Handles products, auth, user accounts, and server-side cart via WooCommerce.
 * Version:           1.0.0
 * Author:            The Forge Atelier
 * License:           GPL-2.0+
 * Text Domain:       the-forge-connector
 * Requires at least: 6.0
 * Requires PHP:      8.0
 */

defined( 'ABSPATH' ) || exit;

define( 'TFC_VERSION',    '1.0.0' );
define( 'TFC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TFC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

add_action( 'plugins_loaded', function () {
    if ( ! class_exists( 'WooCommerce' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>The Forge Connector</strong> requires WooCommerce to be active.</p></div>';
        } );
        return;
    }

    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-cors.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-products.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-auth.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-cart.php';
    require_once TFC_PLUGIN_DIR . 'includes/class-tfc-users.php';

    TFC_CORS::init();
    TFC_Products::init();
    TFC_Auth::init();
    TFC_Cart::init();
    TFC_Users::init();
} );