<?php
defined( 'ABSPATH' ) || exit;

/**
 * Products endpoints.
 *
 * GET  /wp-json/forge/v1/products              -- list (supports ?main_category, ?subcategory, ?featured, ?search, ?per_page, ?page)
 * GET  /wp-json/forge/v1/products/{slug}       -- single product by slug
 */
class TFC_Products {

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
        add_action( 'save_post_product', [ __CLASS__, 'save_custom_meta' ], 10, 2 );
        add_action( 'woocommerce_product_options_general_product_data', [ __CLASS__, 'add_product_fields' ] );
    }

    public static function register_routes() {
        register_rest_route( 'forge/v1', '/products', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'get_products' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'main_category' => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
                'subcategory'   => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
                'featured'      => [ 'type' => 'string' ],
                'search'        => [ 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
                'per_page'      => [ 'type' => 'integer', 'default' => 50, 'minimum' => 1, 'maximum' => 100 ],
                'page'          => [ 'type' => 'integer', 'default' => 1, 'minimum' => 1 ],
            ],
        ] );

        register_rest_route( 'forge/v1', '/products/(?P<slug>[a-zA-Z0-9-]+)', [
            'methods'             => 'GET',
            'callback'            => [ __CLASS__, 'get_product_by_slug' ],
            'permission_callback' => '__return_true',
            'args'                => [
                'slug' => [ 'type' => 'string', 'required' => true ],
            ],
        ] );
    }

    public static function get_products( $request ) {
        $args = [
            'post_type'      => 'product',
            'post_status'    => 'publish',
            'posts_per_page' => $request->get_param( 'per_page' ),
            'paged'          => $request->get_param( 'page' ),
            'meta_query'     => [],
        ];

        // Filter by main category (stored as product meta)
        if ( $main_cat = $request->get_param( 'main_category' ) ) {
            $args['meta_query'][] = [
                'key'     => '_forge_main_category',
                'value'   => $main_cat,
                'compare' => '=',
            ];
        }

        // Filter by subcategory
        if ( $subcat = $request->get_param( 'subcategory' ) ) {
            $args['meta_query'][] = [
                'key'     => '_forge_subcategory',
                'value'   => $subcat,
                'compare' => '=',
            ];
        }

        // Featured filter
        if ( $request->get_param( 'featured' ) === '1' ) {
            $args['meta_query'][] = [
                'key'     => '_forge_featured',
                'value'   => '1',
                'compare' => '=',
            ];
        }

        // Search
        if ( $search = $request->get_param( 'search' ) ) {
            $args['s'] = $search;
        }

        $query    = new WP_Query( $args );
        $products = [];

        foreach ( $query->posts as $post ) {
            $wc_product = wc_get_product( $post->ID );
            if ( $wc_product ) {
                $products[] = self::format_product( $wc_product );
            }
        }

        return rest_ensure_response( $products );
    }

    public static function get_product_by_slug( $request ) {
        $post = get_page_by_path( $request['slug'], OBJECT, 'product' );

        if ( ! $post ) {
            return new WP_Error( 'not_found', 'Product not found.', [ 'status' => 404 ] );
        }

        $wc_product = wc_get_product( $post->ID );
        if ( ! $wc_product ) {
            return new WP_Error( 'not_found', 'Product not found.', [ 'status' => 404 ] );
        }

        return rest_ensure_response( self::format_product( $wc_product ) );
    }

    /**
     * Map a WooCommerce product to the shape the Next.js frontend expects.
     */
    public static function format_product( $product ) {
        $id         = $product->get_id();
        $price      = (float) $product->get_price();
        $main_cat   = get_post_meta( $id, '_forge_main_category', true ) ?: 'the-men-forge';
        $subcat     = get_post_meta( $id, '_forge_subcategory', true ) ?: 'suits-blazers';
        $subcat_name = get_post_meta( $id, '_forge_subcategory_name', true ) ?: ucwords( str_replace( '-', ' ', $subcat ) );
        $is_bespoke = get_post_meta( $id, '_forge_is_bespoke', true ) === '1';
        $featured   = get_post_meta( $id, '_forge_featured', true ) === '1';
        $tagline    = get_post_meta( $id, '_forge_tagline', true ) ?: '';

        // Naira conversion rate -- update as needed
        $naira_rate  = 1400;
        $naira_price = number_format( $price * $naira_rate, 0, '.', ',' );
        $formatted   = '$' . number_format( $price, 0, '.', ',' ) . ' / NGN ' . $naira_price;

        // Product images
        $images        = [];
        $attachment_ids = $product->get_gallery_image_ids();
        array_unshift( $attachment_ids, $product->get_image_id() );

        foreach ( array_unique( array_filter( $attachment_ids ) ) as $att_id ) {
            $images[] = [
                'id'  => (string) $att_id,
                'src' => wp_get_attachment_url( $att_id ) ?: '',
                'alt' => get_post_meta( $att_id, '_wp_attachment_image_alt', true ) ?: $product->get_name(),
            ];
        }

        // Sizes / variations
        $sizes = [];
        if ( $product->is_type( 'variable' ) ) {
            $attributes = $product->get_variation_attributes();
            foreach ( $attributes as $attr ) {
                $sizes = array_merge( $sizes, $attr );
            }
        } else {
            $sizes_meta = get_post_meta( $id, '_forge_sizes', true );
            $sizes      = $sizes_meta ? explode( ',', $sizes_meta ) : [];
            $sizes      = array_map( 'trim', $sizes );
        }

        // Bespoke options
        $bespoke_options = null;
        if ( $is_bespoke ) {
            $fabrics_raw    = get_post_meta( $id, '_forge_fabrics', true );
            $fabrics        = $fabrics_raw ? json_decode( $fabrics_raw, true ) : [];
            $bespoke_options = [
                'id'                => 'bespoke-' . $id,
                'name'              => 'Master Bespoke Tailoring',
                'description'       => get_post_meta( $id, '_forge_bespoke_description', true ) ?: 'Submit your measurements for a custom-cut pattern.',
                'measurementFields' => [ 'Chest/Bust', 'Waist', 'Hips', 'Shoulder Width', 'Sleeve Length', 'Height' ],
                'availableFabrics'  => $fabrics,
            ];
        }

        // Details & fabric care (stored as newline-separated meta)
        $details_raw     = get_post_meta( $id, '_forge_details', true );
        $fabric_care_raw = get_post_meta( $id, '_forge_fabric_care', true );
        $details         = $details_raw     ? array_filter( explode( "\n", $details_raw ) )     : [];
        $fabric_care     = $fabric_care_raw ? array_filter( explode( "\n", $fabric_care_raw ) ) : [];

        return [
            'id'              => (string) $id,
            'slug'            => $product->get_slug(),
            'name'            => $product->get_name(),
            'tagline'         => $tagline,
            'price'           => $price,
            'formattedPrice'  => $formatted,
            'mainCategory'    => $main_cat,
            'subcategory'     => $subcat,
            'subcategoryName' => $subcat_name,
            'featured'        => $featured,
            'isBespoke'       => $is_bespoke,
            'description'     => $product->get_description() ?: $product->get_short_description(),
            'details'         => array_values( $details ),
            'fabricCare'      => array_values( $fabric_care ),
            'images'          => $images,
            'bespokeOptions'  => $bespoke_options,
            'sizes'           => array_values( $sizes ),
            'inStock'         => $product->is_in_stock(),
        ];
    }

    /**
     * Add custom meta fields to WooCommerce product admin.
     */
    public static function add_product_fields() {
        echo '<div class="options_group">';
        echo '<p style="padding:10px 14px;background:#f8f5ef;font-weight:600;font-size:13px;">THE FORGE Custom Fields</p>';

        woocommerce_wp_select( [
            'id'      => '_forge_main_category',
            'label'   => 'Main Category',
            'options' => [
                ''              => 'Select...',
                'the-men-forge' => 'The Men Forge',
                'the-lady-forge' => 'The Lady Forge',
            ],
        ] );

        woocommerce_wp_text_input( [
            'id'          => '_forge_subcategory',
            'label'       => 'Subcategory slug',
            'placeholder' => 'e.g. suits-blazers, jalamia-kaftans',
        ] );

        woocommerce_wp_text_input( [
            'id'          => '_forge_subcategory_name',
            'label'       => 'Subcategory display name',
            'placeholder' => 'e.g. Suits and Blazers',
        ] );

        woocommerce_wp_text_input( [
            'id'          => '_forge_tagline',
            'label'       => 'Tagline',
            'placeholder' => 'Short editorial subtitle shown on product card',
        ] );

        woocommerce_wp_checkbox( [
            'id'    => '_forge_featured',
            'label' => 'Featured on homepage',
        ] );

        woocommerce_wp_checkbox( [
            'id'    => '_forge_is_bespoke',
            'label' => 'Bespoke / Handmade product',
        ] );

        woocommerce_wp_text_input( [
            'id'          => '_forge_sizes',
            'label'       => 'Standard sizes (comma separated)',
            'placeholder' => 'Bespoke Custom Fit, 48 EU, 50 EU',
        ] );

        woocommerce_wp_textarea_input( [
            'id'          => '_forge_details',
            'label'       => 'Construction details (one per line)',
            'placeholder' => 'Each line becomes a bullet point',
        ] );

        woocommerce_wp_textarea_input( [
            'id'          => '_forge_fabric_care',
            'label'       => 'Fabric care (one per line)',
        ] );

        echo '<p style="padding:5px 14px;"><label><strong>Bespoke Fabrics JSON</strong></label><br/>';
        $fabrics = get_post_meta( get_the_ID(), '_forge_fabrics', true );
        echo '<textarea name="_forge_fabrics" style="width:100%;height:80px;font-family:monospace;font-size:11px;" placeholder=\'[{"id":"f1","name":"Onyx Silk","colorHex":"#050505"}]\'>' . esc_textarea( $fabrics ) . '</textarea>';
        echo '<small>JSON array of fabric options for the bespoke selector.</small></p>';
        echo '</div>';
    }

    /**
     * Save custom meta when product is saved.
     */
    public static function save_custom_meta( $post_id, $post ) {
        $fields = [
            '_forge_main_category',
            '_forge_subcategory',
            '_forge_subcategory_name',
            '_forge_tagline',
            '_forge_sizes',
            '_forge_details',
            '_forge_fabric_care',
            '_forge_fabrics',
        ];

        foreach ( $fields as $field ) {
            if ( isset( $_POST[ $field ] ) ) {
                update_post_meta( $post_id, $field, sanitize_textarea_field( wp_unslash( $_POST[ $field ] ) ) );
            }
        }

        $checkboxes = [ '_forge_featured', '_forge_is_bespoke' ];
        foreach ( $checkboxes as $cb ) {
            $value = isset( $_POST[ $cb ] ) ? '1' : '0';
            update_post_meta( $post_id, $cb, $value );
        }
    }
}