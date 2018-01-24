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
    global $current_user;

	wp_enqueue_script(
		'give_blocks_enqueue_block_editor_assets',
		plugins_url( 'block.build.js', __FILE__ ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'block.build.js' )
	);

	//
    wp_localize_script( 'give_blocks_enqueue_block_editor_assets', giveBlocksVars, array(
	    'key'   => Give()->api->get_user_public_key( $current_user->ID ),
        'token' => Give()->api->get_token( $current_user->ID )
    ));
}

add_action( 'init', 'give_register_block_type' );

/**
 * Register give donation block type for server side shortcode rendering
 */
function give_register_block_type() {

    register_block_type('give/donation-form-block', array(
            'render_callback' => 'give_donation_form_block_render',
            'attributes' => array(
                'id' => array(
                    'type' => 'number'
                ),
                'displayStyle' => array (
                    'type' => 'string'
                ),
                'showTitle' => array (
                    'type' => 'boolean',
                    'default' => false
                ),
                'showGoal' => array (
                    'type' => 'boolean',
                        'default' => false
                ),
                'showContent' => array (
                    'type' => 'string',
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
function give_donation_form_block_render( $attributes ) {
    return do_shortcode('[give_form id="'.$attributes[ 'id' ].'"  show_title="'. var_export( $attributes[ 'showTitle' ], 1 ).'" show_goal="'. var_export( $attributes[ 'showGoal' ], 1 ) .'"  display_style="'. $attributes[ 'displayStyle' ] .'" show_content="'. $attributes[ 'showContent' ] .'"]');
}

add_action( 'rest_api_init', 'give_gutenberg_register_rest_api' );

/**
 * Register rest route to fetch form data
 * TODO: This is a temporary solution. Next step would be to find a solution that is limited to the editor.
 *
 */
function give_gutenberg_register_rest_api() {
    register_rest_route( 'give-api/v1', '/form/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'give_fetch_form_data',
    ));
}

/**
 * Rest fetch form data callback
 * @param $request
 * @return array|mixed|object
 */
function give_fetch_form_data( $request ) {

    $parameters = $request->get_params();

    if( !isset( $parameters['id'] ) || empty($parameters['id']) )
        return array( 'error' => 'no_parameter_given' );

    $form_id = $parameters['id'];
    $form = get_post($form_id);

    // Response data array
    $response = array(
        'title' => $form->post_title
    );

    return $response;
}