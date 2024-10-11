
<?php 

/*
Plugin Name As of now, subject to change: Accessibility Plug In
Description: Plug in for LasagnaLove.com to enhance and provide their users with accesibility features: screen reader, adjusting font size, line height, letter spacing, displayin a dyslexia font, adjust color modes, navigate via keyboard arrows, voice nav. 
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
                'screen-reader', 
                plugin_dir_url( __FILE__ ) . 'js/screen-reader.js',
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

