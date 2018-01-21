<?php
/**
 * Plugin Name: Give Donation Form Block
 * Plugin URI: https://pareshradadiya.github.io/
 * Description: Give donation form block for the WordPress Gutenberg block editor
 * Author: Parehsh
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package GB
 */

defined( 'ABSPATH' ) || exit;

add_action( 'enqueue_block_editor_assets', 'give_blocks_enqueue_block_editor_assets' );

/**
 * Enqueue the block's assets for the editor.
 */
function give_blocks_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'give_blocks_enqueue_block_editor_assets',
		plugins_url( 'block.build.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'block.build.js' )
	);
}

add_action( 'init', 'give_register_block_type' );

/**
 * Register give donation block type for server side shortcode rendering
 */
function give_register_block_type() {

    register_block_type('donation-form-block/give-block', array(
            'render_callback' => 'give_donation_form_block_render',
            'attributes' => array(
                'id' => array(
                    'type' => 'number'
                )
            )
        )
    );
}

/**
 * Output the donation form shortcode on frontend
 * @param $attributes
 * @return string
 */
function give_donation_form_block_render( $attributes ){
    $form_id = $attributes[ 'id' ];
    return do_shortcode('[give_form id='.$form_id.']');
}