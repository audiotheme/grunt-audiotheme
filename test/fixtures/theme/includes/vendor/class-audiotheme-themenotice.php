<?php
/**
 * Class to display a dismissable notice if AudioTheme isn't active.
 *
 * @package AudioTheme_Framework\ThemeNotice
 * @link http://audiotheme.com/
 * @license GPL-2.0+
 * @version 1.0.0
 */
class AudioTheme_ThemeNotice {
	/**
	 * Array of configurable strings.
	 *
	 * @since 1.0.0
	 * @type array
	 */
        public $strings = array();

	/**
	 * Load the AudioTheme Framework or display a notice if it's not active.
	 *
	 * @since 1.0.0
	 */
	public function __construct( $args = array() ) {
		if ( ! $this->is_audiotheme_active() && is_admin() && current_user_can( 'activate_plugins' ) ) {
			$this->strings = array(
				'notice'     => __( 'The AudioTheme Framework should be installed and activated for this theme to display properly.' ),
				'activate'   => __( 'Activate now' ),
				'learn_more' => __( 'Find out more' ),
				'dismiss'    => __( 'Dismiss' ),
			);

			if ( isset( $args['strings'] ) ) {
				$this->strings = $args['strings'];
			}

			add_action( 'admin_notices', array( $this, 'display_notice' ) );
			add_action( 'init', array( $this, 'init' ) );
			add_action( 'wp_ajax_' . $this->dismiss_notice_action(), array( $this, 'ajax_dismiss_notice' ) );
		}
	}

	/**
	 * Check if the AudioTheme Framework is active.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public static function is_audiotheme_active() {
		return function_exists( 'audiotheme_load' );
	}

	/**
	 * Dismiss the Framework required notice.
	 *
	 * This is a fallback in case the AJAX method doesn't work.
	 *
	 * @since 1.0.0
	 */
	public function init() {
		$slug = $this->theme();

		if ( isset( $_GET[ $slug ] ) && 'dismiss-notice' == $_GET[ $slug ] && wp_verify_nonce( $_GET['_wpnonce'], $this->dismiss_notice_action() ) ) {
			$this->dismiss_notice();

			$redirect = remove_query_arg( array( $this->theme(), '_wpnonce' ) );
			wp_safe_redirect( esc_url_raw( $redirect ) );
		}
	}

	/**
	 * Display a notice if the AudioTheme framework isn't active.
	 *
	 * @since 1.0.0
	 */
	public function display_notice() {
		$user_id = get_current_user_id();

		// Return early if user already dismissed the notice.
		if ( 'dismissed' == get_user_meta( $user_id, $this->notice_key(), true ) ) {
			return;
		}
		?>
		<div id="audiotheme-framework-required-notice" class="error">
			<p>
				<?php
				echo $this->strings['notice'];

				if ( 0 === validate_plugin( 'audiotheme/audiotheme.php' ) ) {
					$activate_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=audiotheme/audiotheme.php', 'activate-plugin_audiotheme/audiotheme.php' );
					printf( ' <a href="%s"><strong>%s</strong></a>',
						esc_url( $activate_url ),
						$this->strings['activate']
					);
				} else {
					printf( ' <a href="http://audiotheme.com/view/audiotheme/"><strong>%s</strong></a>',
						$this->strings['learn_more']
					);
				}

				$dismiss_url = wp_nonce_url( add_query_arg( get_template(), 'dismiss-notice' ), $this->dismiss_notice_action() );
				printf( ' <a href="%s" class="dismiss" style="float: right">%s</a>',
					esc_url( $dismiss_url ),
					$this->strings['dismiss']
				);
				?>
			</p>
		</div>
		<script type="text/javascript">
		jQuery( '#audiotheme-framework-required-notice' ).on( 'click', '.dismiss', function( e ) {
			var $notice = jQuery( this ).closest( '.error' );

			e.preventDefault();

			jQuery.get( ajaxurl, {
				action: '<?php echo $this->dismiss_notice_action(); ?>',
				_wpnonce: '<?php echo wp_create_nonce( $this->dismiss_notice_action() ); ?>'
			}, function() {
				$notice.slideUp();
			});
		});
		</script>
		<?php
	}

	/**
	 * AJAX callback to dismiss the Framework required notice.
	 *
	 * @since 1.0.0
	 */
	public function ajax_dismiss_notice() {
		check_admin_referer( $this->dismiss_notice_action() );
		$this->dismiss_notice();
		wp_die( 1 );
	}

	/**
	 * Add the notice status to the current user's meta.
	 *
	 * @since 1.0.0
	 */
	protected function dismiss_notice() {
		$user_id = get_current_user_id();
		update_user_meta( $user_id, $this->notice_key(), 'dismissed', true );
	}

	/**
	 * User meta key for the notice status.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function notice_key() {
		return $this->theme() . '_audiotheme_framework_required_notice';
	}

	/**
	 * Name of the dismiss action.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function dismiss_notice_action() {
		return $this->theme() . '-dismiss-audiotheme-framework-required-notice';
	}

	/**
	 * Get the name of the current parent theme.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	protected function theme() {
		return get_template();
	}
}
