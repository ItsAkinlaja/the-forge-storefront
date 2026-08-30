<?php
defined( 'ABSPATH' ) || exit;

/**
 * Custom order requests — public endpoint, DB storage, email notification, admin UI.
 *
 * POST /forge/v1/custom-requests
 *   Accepts multipart/form-data with fields:
 *     fullName, email, phone, gender, garmentType, description,
 *     occasion, preferredColours, budget, sampleImages[] (up to 3, max 5 MB each)
 *
 * Admin menu: Forge Requests (under WooCommerce)
 */
class TFC_Custom_Requests {

    const TABLE_SUFFIX = 'forge_custom_requests';
    const UPLOAD_DIR   = 'forge-custom-requests';
    const MAX_IMAGES   = 3;
    const MAX_FILE_MB  = 5;

    public static function init() {
        add_action( 'rest_api_init',       [ __CLASS__, 'register_routes' ] );
        add_action( 'admin_menu',          [ __CLASS__, 'register_admin_menu' ] );
        register_activation_hook( TFC_PLUGIN_DIR . '../the-forge-connector.php', [ __CLASS__, 'create_table' ] );
        // Also create on init in case plugin was already active when this class was added.
        add_action( 'plugins_loaded', [ __CLASS__, 'maybe_create_table' ], 25 );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Database
    // ──────────────────────────────────────────────────────────────────────────

    public static function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . self::TABLE_SUFFIX;
    }

    public static function create_table() {
        global $wpdb;
        $table      = self::get_table_name();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS {$table} (
            id              BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            full_name       VARCHAR(255)        NOT NULL,
            email           VARCHAR(255)        NOT NULL,
            phone           VARCHAR(50)         NOT NULL,
            gender          VARCHAR(10)         NOT NULL,
            garment_type    VARCHAR(100)        NOT NULL,
            description     TEXT                NOT NULL,
            occasion        VARCHAR(255)                ,
            preferred_colours VARCHAR(255)              ,
            budget          VARCHAR(100)        NOT NULL,
            image_urls      LONGTEXT                    ,
            status          VARCHAR(20)         NOT NULL DEFAULT 'pending',
            created_at      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }

    public static function maybe_create_table() {
        global $wpdb;
        $table = self::get_table_name();
        // Only run dbDelta when the table is missing (avoids overhead on every request).
        if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) !== $table ) {
            self::create_table();
        }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // REST routes
    // ──────────────────────────────────────────────────────────────────────────

    public static function register_routes() {
        register_rest_route( 'forge/v1', '/custom-requests', [
            'methods'             => 'POST',
            'callback'            => [ __CLASS__, 'handle_request' ],
            'permission_callback' => '__return_true',
        ] );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Handler
    // ──────────────────────────────────────────────────────────────────────────

    public static function handle_request( WP_REST_Request $request ) {

        // ── 1. Read and sanitise text fields ──────────────────────────────────
        $full_name         = sanitize_text_field( $request->get_param( 'fullName' )         ?? '' );
        $email             = sanitize_email(       $request->get_param( 'email' )             ?? '' );
        $phone             = sanitize_text_field( $request->get_param( 'phone' )             ?? '' );
        $gender            = sanitize_text_field( $request->get_param( 'gender' )            ?? '' );
        $garment_type      = sanitize_text_field( $request->get_param( 'garmentType' )       ?? '' );
        $description       = sanitize_textarea_field( $request->get_param( 'description' )   ?? '' );
        $occasion          = sanitize_text_field( $request->get_param( 'occasion' )          ?? '' );
        $preferred_colours = sanitize_text_field( $request->get_param( 'preferredColours' )  ?? '' );
        $budget            = sanitize_text_field( $request->get_param( 'budget' )            ?? '' );

        // ── 2. Required field validation ──────────────────────────────────────
        $required = [
            'fullName'    => $full_name,
            'email'       => $email,
            'phone'       => $phone,
            'gender'      => $gender,
            'garmentType' => $garment_type,
            'description' => $description,
            'budget'      => $budget,
        ];

        foreach ( $required as $field => $value ) {
            if ( '' === $value ) {
                return new WP_Error(
                    'missing_field',
                    sprintf( 'The field "%s" is required.', $field ),
                    [ 'status' => 400 ]
                );
            }
        }

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Please provide a valid email address.', [ 'status' => 400 ] );
        }

        $allowed_genders = [ 'men', 'women' ];
        if ( ! in_array( $gender, $allowed_genders, true ) ) {
            return new WP_Error( 'invalid_gender', 'Gender must be "men" or "women".', [ 'status' => 400 ] );
        }

        // ── 3. File uploads ───────────────────────────────────────────────────
        $image_urls = [];

        if ( ! empty( $_FILES['sampleImages'] ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';

            $files = self::normalise_files( $_FILES['sampleImages'] );

            if ( count( $files ) > self::MAX_IMAGES ) {
                return new WP_Error(
                    'too_many_images',
                    sprintf( 'You may upload a maximum of %d images.', self::MAX_IMAGES ),
                    [ 'status' => 400 ]
                );
            }

            $allowed_mime_types = [ 'image/jpeg', 'image/png', 'image/webp' ];
            $max_bytes          = self::MAX_FILE_MB * 1024 * 1024;

            // Prepare custom upload subdirectory.
            $year  = gmdate( 'Y' );
            $month = gmdate( 'm' );
            $subdir = self::UPLOAD_DIR . "/{$year}/{$month}";

            add_filter( 'upload_dir', function ( $dirs ) use ( $subdir ) {
                $dirs['subdir'] = '/' . $subdir;
                $dirs['path']   = $dirs['basedir'] . '/' . $subdir;
                $dirs['url']    = $dirs['baseurl'] . '/' . $subdir;
                return $dirs;
            } );

            foreach ( $files as $file ) {
                // Basic PHP upload error check.
                if ( isset( $file['error'] ) && UPLOAD_ERR_OK !== $file['error'] ) {
                    continue;
                }

                if ( $file['size'] > $max_bytes ) {
                    remove_all_filters( 'upload_dir' );
                    return new WP_Error(
                        'file_too_large',
                        sprintf( '"%s" exceeds the %d MB size limit.', $file['name'], self::MAX_FILE_MB ),
                        [ 'status' => 400 ]
                    );
                }

                // Verify MIME via file content, not just extension.
                $finfo = new finfo( FILEINFO_MIME_TYPE );
                $mime  = $finfo->file( $file['tmp_name'] );

                if ( ! in_array( $mime, $allowed_mime_types, true ) ) {
                    remove_all_filters( 'upload_dir' );
                    return new WP_Error(
                        'invalid_file_type',
                        sprintf( '"%s" is not an allowed file type. Use JPG, PNG, or WebP.', $file['name'] ),
                        [ 'status' => 400 ]
                    );
                }

                $overrides = [ 'test_form' => false, 'mimes' => array_combine( $allowed_mime_types, $allowed_mime_types ) ];
                $moved     = wp_handle_upload( $file, $overrides );

                if ( isset( $moved['error'] ) ) {
                    remove_all_filters( 'upload_dir' );
                    return new WP_Error( 'upload_failed', $moved['error'], [ 'status' => 500 ] );
                }

                $image_urls[] = $moved['url'];
            }

            remove_all_filters( 'upload_dir' );
        }

        // ── 4. Save to database ───────────────────────────────────────────────
        global $wpdb;
        $table = self::get_table_name();

        $inserted = $wpdb->insert(
            $table,
            [
                'full_name'         => $full_name,
                'email'             => $email,
                'phone'             => $phone,
                'gender'            => $gender,
                'garment_type'      => $garment_type,
                'description'       => $description,
                'occasion'          => $occasion,
                'preferred_colours' => $preferred_colours,
                'budget'            => $budget,
                'image_urls'        => wp_json_encode( $image_urls ),
                'status'            => 'pending',
                'created_at'        => current_time( 'mysql', true ),
            ],
            [
                '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s',
            ]
        );

        if ( false === $inserted ) {
            return new WP_Error( 'db_error', 'Could not save your request. Please try again.', [ 'status' => 500 ] );
        }

        $request_id = $wpdb->insert_id;

        // ── 5. Send admin email ───────────────────────────────────────────────
        self::send_admin_email( [
            'id'                => $request_id,
            'full_name'         => $full_name,
            'email'             => $email,
            'phone'             => $phone,
            'gender'            => ucfirst( $gender ),
            'garment_type'      => $garment_type,
            'description'       => $description,
            'occasion'          => $occasion ?: '—',
            'preferred_colours' => $preferred_colours ?: '—',
            'budget'            => $budget,
            'image_urls'        => $image_urls,
        ] );

        // ── 6. Respond ────────────────────────────────────────────────────────
        return rest_ensure_response( [
            'success' => true,
            'message' => 'Request received. We will be in touch within 24 hours.',
            'id'      => $request_id,
        ] );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Email notification
    // ──────────────────────────────────────────────────────────────────────────

    private static function send_admin_email( array $data ) {
        $admin_email = get_option( 'admin_email' );
        $site_name   = get_bloginfo( 'name' );
        $subject     = sprintf(
            'New Custom Order Request — %s for %s',
            esc_html( $data['garment_type'] ),
            esc_html( $data['full_name'] )
        );

        $image_links = '';
        if ( ! empty( $data['image_urls'] ) ) {
            foreach ( $data['image_urls'] as $url ) {
                $image_links .= sprintf(
                    '<p><a href="%s" target="_blank">%s</a></p>',
                    esc_url( $url ),
                    esc_html( basename( $url ) )
                );
            }
        } else {
            $image_links = '<p>No reference images uploaded.</p>';
        }

        $body = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;color:#333;max-width:680px;margin:0 auto;padding:20px;">';
        $body .= sprintf(
            '<h2 style="color:#050505;border-bottom:2px solid #C6A15B;padding-bottom:10px;margin-bottom:24px;">New Custom Order Request #%d</h2>',
            absint( $data['id'] )
        );

        $rows = [
            'Customer Name'     => $data['full_name'],
            'Email'             => $data['email'],
            'Phone / WhatsApp'  => $data['phone'],
            'Gender'            => $data['gender'],
            'Garment Type'      => $data['garment_type'],
            'Occasion'          => $data['occasion'],
            'Preferred Colours' => $data['preferred_colours'],
            'Budget Range'      => $data['budget'],
        ];

        $body .= '<table style="width:100%;border-collapse:collapse;margin-bottom:24px;">';
        foreach ( $rows as $label => $value ) {
            $body .= sprintf(
                '<tr><td style="padding:10px 14px;background:#F5F5F5;font-weight:bold;width:35%%;border-bottom:1px solid #E0E0E0;">%s</td>'
                . '<td style="padding:10px 14px;border-bottom:1px solid #E0E0E0;">%s</td></tr>',
                esc_html( $label ),
                esc_html( $value )
            );
        }
        $body .= '</table>';

        $body .= '<h3 style="color:#050505;margin-bottom:8px;">Description</h3>';
        $body .= sprintf(
            '<p style="background:#F5F5F5;padding:14px;line-height:1.6;white-space:pre-wrap;">%s</p>',
            esc_html( $data['description'] )
        );

        $body .= '<h3 style="color:#050505;margin-bottom:8px;margin-top:24px;">Reference Images</h3>';
        $body .= $image_links;

        $body .= sprintf(
            '<p style="margin-top:32px;font-size:12px;color:#888;">Sent from %s</p>',
            esc_html( $site_name )
        );
        $body .= '</body></html>';

        wp_mail(
            $admin_email,
            $subject,
            $body,
            [ 'Content-Type: text/html; charset=UTF-8' ]
        );
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Admin menu
    // ──────────────────────────────────────────────────────────────────────────

    public static function register_admin_menu() {
        add_submenu_page(
            'woocommerce',
            'Forge Requests',
            'Forge Requests',
            'manage_woocommerce',
            'forge-custom-requests',
            [ __CLASS__, 'render_admin_page' ]
        );
    }

    public static function render_admin_page() {
        global $wpdb;
        $table = self::get_table_name();

        // ── Status update ─────────────────────────────────────────────────────
        if (
            isset( $_POST['forge_update_status'], $_POST['request_id'], $_POST['new_status'] )
            && check_admin_referer( 'forge_update_status' )
            && current_user_can( 'manage_woocommerce' )
        ) {
            $id     = absint( $_POST['request_id'] );
            $status = sanitize_text_field( $_POST['new_status'] );
            $allowed_statuses = [ 'pending', 'reviewed', 'completed' ];
            if ( $id && in_array( $status, $allowed_statuses, true ) ) {
                $wpdb->update( $table, [ 'status' => $status ], [ 'id' => $id ], [ '%s' ], [ '%d' ] );
                echo '<div class="updated notice"><p>Status updated.</p></div>';
            }
        }

        // ── Single request view ───────────────────────────────────────────────
        if ( isset( $_GET['view'] ) ) {
            $id   = absint( $_GET['view'] );
            $row  = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$table} WHERE id = %d", $id ) );
            if ( $row ) {
                self::render_single_view( $row );
                return;
            }
        }

        // ── Pagination ────────────────────────────────────────────────────────
        $per_page    = 20;
        $current_page = isset( $_GET['paged'] ) ? max( 1, absint( $_GET['paged'] ) ) : 1;
        $offset       = ( $current_page - 1 ) * $per_page;
        $total        = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" );
        $total_pages  = ceil( $total / $per_page );

        $rows = $wpdb->get_results(
            $wpdb->prepare( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT %d OFFSET %d", $per_page, $offset )
        );

        // ── Status badge helper ───────────────────────────────────────────────
        $badge = static function( $status ) {
            $colors = [
                'pending'   => '#C6A15B',
                'reviewed'  => '#2196F3',
                'completed' => '#4CAF50',
            ];
            $color = $colors[ $status ] ?? '#888';
            return sprintf(
                '<span style="background:%s;color:#fff;padding:2px 10px;font-size:11px;border-radius:2px;text-transform:uppercase;letter-spacing:.05em;">%s</span>',
                esc_attr( $color ),
                esc_html( $status )
            );
        };
        ?>
        <div class="wrap">
            <h1 style="font-size:22px;margin-bottom:20px;">Forge Custom Requests
                <span style="font-size:13px;color:#888;font-weight:normal;margin-left:8px;"><?php echo esc_html( $total ); ?> total</span>
            </h1>

            <table class="wp-list-table widefat fixed striped" style="margin-top:10px;">
                <thead>
                    <tr>
                        <th style="width:40px;">#</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Garment</th>
                        <th>Gender</th>
                        <th>Budget</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                <?php if ( empty( $rows ) ) : ?>
                    <tr><td colspan="9" style="text-align:center;padding:40px;color:#888;">No requests yet.</td></tr>
                <?php else : ?>
                    <?php foreach ( $rows as $row ) : ?>
                        <tr>
                            <td><?php echo absint( $row->id ); ?></td>
                            <td><?php echo esc_html( $row->full_name ); ?></td>
                            <td><a href="mailto:<?php echo esc_attr( $row->email ); ?>"><?php echo esc_html( $row->email ); ?></a></td>
                            <td><?php echo esc_html( $row->garment_type ); ?></td>
                            <td><?php echo esc_html( ucfirst( $row->gender ) ); ?></td>
                            <td><?php echo esc_html( $row->budget ); ?></td>
                            <td><?php echo $badge( $row->status ); ?></td>
                            <td><?php echo esc_html( wp_date( 'd M Y', strtotime( $row->created_at ) ) ); ?></td>
                            <td>
                                <a href="<?php echo esc_url( admin_url( 'admin.php?page=forge-custom-requests&view=' . absint( $row->id ) ) ); ?>" class="button button-small">View</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
                </tbody>
            </table>

            <?php if ( $total_pages > 1 ) : ?>
                <div class="tablenav bottom" style="margin-top:16px;">
                    <?php
                    echo paginate_links( [
                        'base'    => add_query_arg( 'paged', '%#%' ),
                        'format'  => '',
                        'current' => $current_page,
                        'total'   => $total_pages,
                    ] );
                    ?>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }

    private static function render_single_view( object $row ) {
        $images = json_decode( $row->image_urls, true ) ?: [];
        $back   = admin_url( 'admin.php?page=forge-custom-requests' );
        ?>
        <div class="wrap">
            <h1>Custom Request #<?php echo absint( $row->id ); ?>
                <a href="<?php echo esc_url( $back ); ?>" class="page-title-action">Back to list</a>
            </h1>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;margin-top:24px;">
                <?php
                $fields = [
                    'Customer Name'     => $row->full_name,
                    'Email'             => $row->email,
                    'Phone / WhatsApp'  => $row->phone,
                    'Gender'            => ucfirst( $row->gender ),
                    'Garment Type'      => $row->garment_type,
                    'Occasion'          => $row->occasion ?: '—',
                    'Preferred Colours' => $row->preferred_colours ?: '—',
                    'Budget'            => $row->budget,
                    'Status'            => ucfirst( $row->status ),
                    'Submitted'         => wp_date( 'd M Y, H:i', strtotime( $row->created_at ) ),
                ];
                foreach ( $fields as $label => $value ) : ?>
                    <div style="background:#f9f9f9;padding:14px 18px;border-left:3px solid #C6A15B;">
                        <strong style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:4px;"><?php echo esc_html( $label ); ?></strong>
                        <span style="font-size:14px;color:#050505;"><?php echo esc_html( $value ); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div style="max-width:900px;margin-top:24px;background:#f9f9f9;padding:18px;border-left:3px solid #C6A15B;">
                <strong style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:8px;">Description</strong>
                <p style="white-space:pre-wrap;line-height:1.7;color:#050505;"><?php echo esc_html( $row->description ); ?></p>
            </div>

            <?php if ( ! empty( $images ) ) : ?>
                <div style="max-width:900px;margin-top:24px;">
                    <strong style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:12px;">Reference Images</strong>
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <?php foreach ( $images as $url ) : ?>
                            <a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener">
                                <img src="<?php echo esc_url( $url ); ?>" style="width:140px;height:140px;object-fit:cover;border:1px solid #E0E0E0;" alt="Reference image" />
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Status update form -->
            <div style="max-width:900px;margin-top:32px;padding:20px;background:#fff;border:1px solid #E0E0E0;">
                <strong style="display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:12px;">Update Status</strong>
                <form method="post">
                    <?php wp_nonce_field( 'forge_update_status' ); ?>
                    <input type="hidden" name="request_id" value="<?php echo absint( $row->id ); ?>" />
                    <select name="new_status" style="margin-right:8px;padding:6px 10px;">
                        <?php foreach ( [ 'pending', 'reviewed', 'completed' ] as $s ) : ?>
                            <option value="<?php echo esc_attr( $s ); ?>" <?php selected( $row->status, $s ); ?>><?php echo esc_html( ucfirst( $s ) ); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <input type="submit" name="forge_update_status" value="Update" class="button button-primary" />
                </form>
            </div>
        </div>
        <?php
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * PHP's $_FILES format for multiple files can be either:
     *   $_FILES['sampleImages'] = [ 'name' => ['a','b'], 'tmp_name' => ['/tmp/x', '/tmp/y'], ... ]
     * or for a single file:
     *   $_FILES['sampleImages'] = [ 'name' => 'a', 'tmp_name' => '/tmp/x', ... ]
     *
     * This normalises both into an array of single-file arrays.
     */
    private static function normalise_files( array $files_entry ): array {
        if ( is_array( $files_entry['name'] ) ) {
            $normalised = [];
            foreach ( $files_entry['name'] as $i => $name ) {
                if ( '' === $name || UPLOAD_ERR_NO_FILE === $files_entry['error'][ $i ] ) {
                    continue;
                }
                $normalised[] = [
                    'name'     => $files_entry['name'][ $i ],
                    'type'     => $files_entry['type'][ $i ],
                    'tmp_name' => $files_entry['tmp_name'][ $i ],
                    'error'    => $files_entry['error'][ $i ],
                    'size'     => $files_entry['size'][ $i ],
                ];
            }
            return $normalised;
        }

        // Single file.
        if ( '' === $files_entry['name'] || UPLOAD_ERR_NO_FILE === $files_entry['error'] ) {
            return [];
        }
        return [ $files_entry ];
    }
}
