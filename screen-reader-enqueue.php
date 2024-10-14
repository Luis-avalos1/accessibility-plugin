

<?php
/*
Plugin Name: Accessibility Plugin
Description: A plugin to improve Lasagna Love's website accessibility.
Version: 1.0
Author: Luis Avalos
*/



// we want to create a method that enqueues our custome JS filer
//         for the screen reader 

// we must exit if this is accesed directly
if(!defined('ABSPATH')){
        exit;
}


//  funciton to enque scripts and stlyes


// css and js file --> enqueue
function enqueue_scripts(){

        wp_enqueue_style(
                'styles',
                plugin_dir_url( __FILE__ ) . 'css/styles.css',
                array(),
                '1.0',
                'all'
        );

        wp_enqueue_script(
                'accessibility-plugin', 
                plugin_dir_url( __FILE__ ) . 'js/accessibility-plugin.js',
                array(),
                '1.0',
                true
        );
}
add_action('wp_enqueue_script', 'enqueue_scripts');
// load our toolbar 
function display_toolbar(){
        include plugin_dir_path(__FILE__) .'templates/toolbar.php';
}

add_action('wp_footer','display_toolbar');



