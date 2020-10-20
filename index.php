<?php

/**
 * Plugin name: React Libre Form
 * Plugin URI: https://github.com/libreform/react-component
 * Description: React component for WP Libre Form. Exposes the component under window.ReactLibreForm. This is not how we recommend using this, but eh, it works.
 * Version: 2.0.0-beta.12
 * Author: Libre Form
 * Author URI: https://github.com/libreform/
 * License: GPLv2
 * License URI: https://www.gnu.org/licenses/gpl.html
 * Text Domain: wplf
 *
 */

add_action('wp_enqueue_scripts', 'enqueueReactLibreForm');
add_action('admin_enqueue_scripts', 'enqueueReactLibreForm');

function enqueueReactLibreForm() {
  $file = defined('WP_DEBUG') && WP_DEBUG ? 'dist/index.js' : 'dist/index.min.js';
  wp_enqueue_script('react-component', plugin_dir_url(__FILE__) . $file, ['react', 'react-dom', 'wplf-frontend'], get_file_data(__FILE__, ['Version' => null])['Version'], true);
}
