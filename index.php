<?php

/**
 * Plugin name: React Libre Form
 * Plugin URI: https://github.com/libreform/react-libre-form
 * Description: React component for WP Libre Form. Exposes the component under window.ReactLibreForm
 * Version: 2.0.0-beta.1
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
  wp_enqueue_script('react-libre-form', plugin_dir_url(__FILE__) . 'dist/react-libre-form.js', ['react', 'react-dom', 'wplf-frontend'], '2.0.0-beta.1', true);
}
