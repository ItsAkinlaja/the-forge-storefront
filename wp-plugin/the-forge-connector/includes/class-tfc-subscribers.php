<?php
defined( 'ABSPATH' ) || exit;

/**
 * Newsletter subscribers -- stores leads from the footer subscribe form.
 *
 * POST /forge/v1/subscribe   { email, firstName? }
 * GET  /forge/v1/subscribe   (admin only) -- list all subscribers
 */
class TFC_Subscribers {

    const TABLE_SUFFIX = 'forge_subscribers';

    public static function init() {
        add_action( 'rest_api_init',  [ __CLASS__, 'register_routes' ] );
        add_action( 'admin_menu',     [ __CLASS__, 'register_admin_menu' ] );
        add_action( 'plugins_loaded', [ __CLASS__, 'maybe_create_table' ], 26 );
    }

    // ── DB ────────────────────────────────────────────────────────────────────

    public static function table() {
        global ;
        return ->prefix . self::TABLE_SUFFIX;
    }

    public static function maybe_create_table() {
        global ;
         = self::table();
        if ( ->get_var( "SHOW TABLES LIKE '{}'" ) !==  ) {
            self::create_table();
        }
    }

    public static function create_table() {
        global ;
         = ->get_charset_collate();
           = self::table();
         = "CREATE TABLE IF NOT EXISTS {} (
            id         BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            email      VARCHAR(255)        NOT NULL UNIQUE,
            first_name VARCHAR(100)                ,
            source     VARCHAR(50)         NOT NULL DEFAULT 'footer',
            status     VARCHAR(20)         NOT NULL DEFAULT 'active',
            created_at DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) {};";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta(  );
    }

    // ── Routes ────────────────────────────────────────────────────────────────

    public static function register_routes() {
        register_rest_route( 'forge/v1', '/subscribe', [
            [
                'methods'             => 'POST',
                'callback'            => [ __CLASS__, 'subscribe' ],
                'permission_callback' => '__return_true',
                'args'                => [
                    'email'     => [ 'required' => true, 'type' => 'string', 'sanitize_callback' => 'sanitize_email' ],
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

    // ── Subscribe handler ─────────────────────────────────────────────────────

    public static function subscribe( WP_REST_Request  ) {
        global ;

              = sanitize_email( ->get_param( 'email' ) );
         = sanitize_text_field( ->get_param( 'firstName' ) ?? '' );

        if ( ! is_email(  ) ) {
            return new WP_Error( 'invalid_email', 'Please enter a valid email address.', [ 'status' => 400 ] );
        }

            = self::table();
         = ->get_var( ->prepare( "SELECT id FROM {} WHERE email = %s",  ) );

        if (  ) {
            // Already subscribed -- return success silently (no info leak)
            return rest_ensure_response( [ 'success' => true, 'message' => 'You are subscribed.' ] );
        }

         = ->insert(
            ,
            [
                'email'      => ,
                'first_name' => ,
                'source'     => 'footer',
                'status'     => 'active',
                'created_at' => current_time( 'mysql', true ),
            ],
            [ '%s', '%s', '%s', '%s', '%s' ]
        );

        if ( false ===  ) {
            return new WP_Error( 'db_error', 'Could not save subscription. Please try again.', [ 'status' => 500 ] );
        }

        // Send welcome email to subscriber
         = get_bloginfo( 'name' );
         =  ?: 'there';
        wp_mail(
            ,
            "Welcome to The Forge",
            "<p>Hey {},</p><p>You are now on the list. Expect new drops, exclusive offers, and Forge events straight to your inbox.</p><p>Dare it, Wear it.</p><p><strong>The Forge</strong></p>",
            [ 'Content-Type: text/html; charset=UTF-8', "From: {} <noreply@theforgebrand.shop>" ]
        );

        // Notify admin of new subscriber
        wp_mail(
            get_option( 'admin_email' ),
            "New Subscriber: {}",
            "<p>A new subscriber just joined the Forge list: <strong>{}</strong></p>",
            [ 'Content-Type: text/html; charset=UTF-8' ]
        );

        return new WP_REST_Response( [ 'success' => true, 'message' => 'Subscribed successfully.' ], 201 );
    }

    // ── Admin list (API) ─────────────────────────────────────────────────────

    public static function list_subscribers( WP_REST_Request  ) {
        global ;
         = ->get_results( "SELECT * FROM " . self::table() . " ORDER BY created_at DESC" );
        return rest_ensure_response(  );
    }

    // ── Admin menu ────────────────────────────────────────────────────────────

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
        global ;
         = self::table();

        // Handle unsubscribe / delete
        if (
            isset( ['forge_delete_subscriber'], ['subscriber_id'] )
            && check_admin_referer( 'forge_delete_subscriber' )
            && current_user_can( 'manage_woocommerce' )
        ) {
            ->delete( , [ 'id' => absint( ['subscriber_id'] ) ], [ '%d' ] );
            echo '<div class="updated notice"><p>Subscriber removed.</p></div>';
        }

        // Export CSV
        if ( isset( ['export'] ) && current_user_can( 'manage_woocommerce' ) ) {
             = ->get_results( "SELECT email, first_name, source, status, created_at FROM {} ORDER BY created_at DESC", ARRAY_A );
            header( 'Content-Type: text/csv; charset=UTF-8' );
            header( 'Content-Disposition: attachment; filename="forge-leads-' . date( 'Y-m-d' ) . '.csv"' );
             = fopen( 'php://output', 'w' );
            fputcsv( , [ 'Email', 'First Name', 'Source', 'Status', 'Date' ] );
            foreach (  as  ) {
                fputcsv( , array_values(  ) );
            }
            fclose(  );
            exit;
        }

             = 25;
         = max( 1, absint( ['paged'] ?? 1 ) );
               = (  - 1 ) * ;
                = (int) ->get_var( "SELECT COUNT(*) FROM {}" );
               = (int) ->get_var( "SELECT COUNT(*) FROM {} WHERE status = 'active'" );
          = ceil(  /  );
                 = ->get_results( ->prepare( "SELECT * FROM {} ORDER BY created_at DESC LIMIT %d OFFSET %d", ,  ) );
        ?>
        <div class="wrap">
            <h1 style="font-size:22px;margin-bottom:4px;">Forge Leads
                <a href="<?php echo esc_url( add_query_arg( 'export', '1' ) ); ?>" class="page-title-action">Export CSV</a>
            </h1>
            <p style="color:#888;margin-bottom:20px;font-size:13px;"><?php echo esc_html(  ); ?> active subscribers &mdash; <?php echo esc_html(  ); ?> total</p>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th style="width:40px;">#</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Date Joined</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                <?php if ( empty(  ) ) : ?>
                    <tr><td colspan="7" style="text-align:center;padding:40px;color:#888;">No subscribers yet.</td></tr>
                <?php else : ?>
                    <?php foreach (  as  ) : ?>
                        <tr>
                            <td><?php echo absint( ->id ); ?></td>
                            <td><a href="mailto:<?php echo esc_attr( ->email ); ?>"><?php echo esc_html( ->email ); ?></a></td>
                            <td><?php echo esc_html( ->first_name ?: '—' ); ?></td>
                            <td><?php echo esc_html( ->source ); ?></td>
                            <td>
                                <span style="background:<?php echo ->status === 'active' ? '#4CAF50' : '#888'; ?>;color:#fff;padding:2px 10px;font-size:11px;border-radius:2px;text-transform:uppercase;letter-spacing:.05em;">
                                    <?php echo esc_html( ->status ); ?>
                                </span>
                            </td>
                            <td><?php echo esc_html( wp_date( 'd M Y', strtotime( ->created_at ) ) ); ?></td>
                            <td>
                                <form method="post" style="display:inline;" onsubmit="return confirm('Remove this subscriber?');">
                                    <?php wp_nonce_field( 'forge_delete_subscriber' ); ?>
                                    <input type="hidden" name="subscriber_id" value="<?php echo absint( ->id ); ?>" />
                                    <button type="submit" name="forge_delete_subscriber" class="button button-small" style="color:#c00;border-color:#c00;">Remove</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>

            <?php if (  > 1 ) : ?>
                <div class="tablenav bottom" style="margin-top:16px;">
                    <?php echo paginate_links( [ 'base' => add_query_arg( 'paged', '%#%' ), 'format' => '', 'current' => , 'total' =>  ] ); ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
}