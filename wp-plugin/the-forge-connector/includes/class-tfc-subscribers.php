<?php
defined( 'ABSPATH' ) || exit;

class TFC_Subscribers {

    const TABLE_SUFFIX = 'forge_subscribers';

    public static function init() {
        add_action( 'rest_api_init',  [ __CLASS__, 'register_routes' ] );
        add_action( 'admin_menu',     [ __CLASS__, 'register_admin_menu' ] );
        add_action( 'plugins_loaded', [ __CLASS__, 'maybe_create_table' ], 26 );
    }

    public static function table() {
        global $wpdb;
        return $wpdb->prefix . self::TABLE_SUFFIX;
    }

    public static function maybe_create_table() {
        global $wpdb;
        $table = self::table();
        if ( $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) !== $table ) {
            self::create_table();
        }
    }

    public static function create_table() {
        global $wpdb;
        $charset = $wpdb->get_charset_collate();
        $table   = self::table();
        $sql = "CREATE TABLE IF NOT EXISTS {$table} (
            id         BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            email      VARCHAR(255)        NOT NULL UNIQUE,
            first_name VARCHAR(100)                ,
            source     VARCHAR(50)         NOT NULL DEFAULT 'footer',
            status     VARCHAR(20)         NOT NULL DEFAULT 'active',
            created_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) {$charset};";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    public static function register_routes() {
        register_rest_route( 'forge/v1', '/subscribe', [
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'subscribe' ],
                'permission_callback' => '__return_true',
                'args'                => [
                    'email'     => [ 'required' => true,  'type' => 'string', 'sanitize_callback' => 'sanitize_email' ],
                    'firstName' => [ 'required' => false, 'type' => 'string', 'sanitize_callback' => 'sanitize_text_field' ],
                ],
            ],
            [
                'methods'             => 'GET',
                'callback'            => [ __CLASS__, 'list_subscribers' ],
                'permission_callback' => function() { return current_user_can( 'manage_woocommerce' ); },
            ],
        ] );
    }

    public static function subscribe( $request ) {
        global $wpdb;

        $email      = sanitize_email( $request->get_param( 'email' ) );
        $first_name = sanitize_text_field( $request->get_param( 'firstName' ) ?? '' );

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please enter a valid email address.', [ 'status' => 400 ] );
        }

        $table    = self::table();
        $existing = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$table} WHERE email = %s", $email ) );

        if ( $existing ) {
            return rest_ensure_response( [ 'success' => true, 'message' => 'You are subscribed.' ] );
        }

        $inserted = $wpdb->insert(
            $table,
            [
                'email'      => $email,
                'first_name' => $first_name,
                'source'     => 'footer',
                'status'     => 'active',
                'created_at' => current_time( 'mysql', true ),
            ],
            [ '%s', '%s', '%s', '%s', '%s' ]
        );

        if ( false === $inserted ) {
            return new WP_Error( 'db_error', 'Could not save subscription. Please try again.', [ 'status' => 500 ] );
        }

        $site = get_bloginfo( 'name' );
        $name = $first_name ?: 'there';

        wp_mail(
            $email,
            'Welcome to The Forge',
            "<p>Hey {$name},</p><p>You are now on the list. Expect new drops, exclusive offers, and Forge events straight to your inbox.</p><p>Dare it, Wear it.</p><p><strong>The Forge</strong></p>",
            [ 'Content-Type: text/html; charset=UTF-8', "From: {$site} <noreply@theforgebrand.shop>" ]
        );

        wp_mail(
            get_option( 'admin_email' ),
            "New Subscriber: {$email}",
            "<p>A new subscriber just joined the Forge list: <strong>{$email}</strong></p>",
            [ 'Content-Type: text/html; charset=UTF-8' ]
        );

        return new WP_REST_Response( [ 'success' => true, 'message' => 'Subscribed successfully.' ], 201 );
    }

    public static function list_subscribers( $request ) {
        global $wpdb;
        $rows = $wpdb->get_results( "SELECT * FROM " . self::table() . " ORDER BY created_at DESC" );
        return rest_ensure_response( $rows );
    }

    public static function register_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Forge Leads',
            'Forge Leads',
            'manage_woocommerce',
            'forge-leads',
            [ __CLASS__, 'render_admin_page' ]
        );
    }

    public static function render_admin_page() {
        global $wpdb;
        $table = self::table();

        if (
            isset( $_POST['forge_delete_subscriber'], $_POST['subscriber_id'] )
            && check_admin_referer( 'forge_delete_subscriber' )
            && current_user_can( 'manage_woocommerce' )
        ) {
            $wpdb->delete( $table, [ 'id' => absint( $_POST['subscriber_id'] ) ], [ '%d' ] );
            echo '<div class="updated notice"><p>Subscriber removed.</p></div>';
        }

        if ( isset( $_GET['export'] ) && current_user_can( 'manage_woocommerce' ) ) {
            $rows = $wpdb->get_results( "SELECT email, first_name, source, status, created_at FROM {$table} ORDER BY created_at DESC", ARRAY_A );
            header( 'Content-Type: text/csv; charset=UTF-8' );
            header( 'Content-Disposition: attachment; filename="forge-leads-' . date( 'Y-m-d' ) . '.csv"' );
            $out = fopen( 'php://output', 'w' );
            fputcsv( $out, [ 'Email', 'First Name', 'Source', 'Status', 'Date' ] );
            foreach ( $rows as $row ) {
                fputcsv( $out, array_values( $row ) );
            }
            fclose( $out );
            exit;
        }

        $per_page     = 25;
        $current_page = max( 1, absint( $_GET['paged'] ?? 1 ) );
        $offset       = ( $current_page - 1 ) * $per_page;
        $total        = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" );
        $active       = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table} WHERE status = 'active'" );
        $total_pages  = ceil( $total / $per_page );
        $rows         = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d OFFSET %d", $per_page, $offset ) );
        ?>
        <div class="wrap">
            <h1 style="font-size:22px;margin-bottom:4px;">Forge Leads
                <a href="<?php echo esc_url( add_query_arg( 'export', '1' ) ); ?>" class="page-title-action">Export CSV</a>
            </h1>
            <p style="color:#888;margin-bottom:20px;font-size:13px;"><?php echo esc_html( $active ); ?> active &mdash; <?php echo esc_html( $total ); ?> total</p>

            <table class="wp-list-table widefat fixed striped">
                <thead><tr>
                    <th style="width:40px;">#</th><th>Email</th><th>First Name</th><th>Source</th><th>Status</th><th>Date</th><th>Action</th>
                </tr></thead>
                <tbody>
                <?php if ( empty( $rows ) ) : ?>
                    <tr><td colspan="7" style="text-align:center;padding:40px;color:#888;">No subscribers yet.</td></tr>
                <?php else : ?>
                    <?php foreach ( $rows as $row ) : ?>
                    <tr>
                        <td><?php echo absint( $row->id ); ?></td>
                        <td><a href="mailto:<?php echo esc_attr( $row->email ); ?>"><?php echo esc_html( $row->email ); ?></a></td>
                        <td><?php echo esc_html( $row->first_name ?: '-' ); ?></td>
                        <td><?php echo esc_html( $row->source ); ?></td>
                        <td><span style="background:<?php echo $row->status === 'active' ? '#4CAF50' : '#888'; ?>;color:#fff;padding:2px 10px;font-size:11px;"><?php echo esc_html( $row->status ); ?></span></td>
                        <td><?php echo esc_html( wp_date( 'd M Y', strtotime( $row->created_at ) ) ); ?></td>
                        <td>
                            <form method="post" style="display:inline;" onsubmit="return confirm('Remove?');">
                                <?php wp_nonce_field( 'forge_delete_subscriber' ); ?>
                                <input type="hidden" name="subscriber_id" value="<?php echo absint( $row->id ); ?>" />
                                <button type="submit" name="forge_delete_subscriber" class="button button-small" style="color:#c00;border-color:#c00;">Remove</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>

            <?php if ( $total_pages > 1 ) : ?>
                <div class="tablenav bottom" style="margin-top:16px;">
                    <?php echo paginate_links( [ 'base' => add_query_arg( 'paged', '%#%' ), 'format' => '', 'current' => $current_page, 'total' => $total_pages ] ); ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
}