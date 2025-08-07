# Lasagna Love Accessibility Plugin

A comprehensive WordPress accessibility plugin that enhances website usability for users with disabilities through advanced screen reading, keyboard navigation, and visual adjustment features.

## Features

### 🎵 Screen Reader Support
Provides text-to-speech functionality using the Web Speech API to read website content aloud for visually impaired users.

### 🎤 Voice Command Navigation
Enables hands-free website navigation through voice recognition commands.

### 🔤 Dyslexia-Friendly Font
Transforms website text to OpenDyslexic font for improved readability for users with dyslexia.

### ⌨️ Keyboard Navigation
Enhanced arrow key navigation with visual indicators showing current focus position on the page.

### 🎨 Color Vision Accessibility
Multiple colorblind-friendly modes including:
- **Deuteranopia** - Red-green colorblind support
- **Tritanopia** - Blue-yellow colorblind support  
- **Protanopia** - Red-green colorblind support
- **High Contrast** - Enhanced contrast for low vision users

### 🔄 Integrated Navigation
Seamless combination of screen reader and keyboard navigation - the screen reader automatically announces focused elements during keyboard navigation.

### 📏 Typography Controls
- **Font Size Adjustment** - Increase/decrease text size for better readability
- **Letter Spacing** - Adjust character spacing for improved text clarity

### ✅ WCAG Compliance
Built following Web Content Accessibility Guidelines (WCAG) standards for maximum inclusivity.

## Technical Implementation

### Script Enqueue System
The plugin uses WordPress's standard script enqueuing system through `script-enqueue.php`:

```php
// Enqueues the main accessibility JavaScript file
wp_enqueue_script(
    'plugin-js', 
    plugin_dir_url( __FILE__ ) . 'js/accessibility-plugin.js',
    array(),
    '1.0',
    true
);
```

### Core JavaScript Architecture
- **IIFE Pattern**: Uses Immediately Invoked Function Expression to avoid global scope pollution
- **Web Speech APIs**: Leverages `speechSynthesis` and `SpeechRecognition` for audio features
- **State Management**: Maintains feature states (`EnableScreenReader`, `EnableKeyboardNavigation`, etc.)
- **Browser Compatibility**: Includes fallbacks and feature detection

### WordPress Integration
- Hooks into `wp_enqueue_scripts` for proper script loading
- Uses `wp_body_open` or `wp_head` for toolbar injection
- Follows WordPress plugin standards and security practices

## Installation

### Prerequisites
- WordPress 5.0 or higher
- PHP 7.4 or higher
- Modern web browser with Web Speech API support

### Setup Instructions

1. **Upload Plugin Files**
   ```bash
   # Upload the entire plugin directory to your WordPress plugins folder
   wp-content/plugins/accessibility-plugin/
   ```

2. **Activate the Plugin**
   - Navigate to WordPress Admin → Plugins
   - Find "Accessibility Plugin" and click "Activate"

3. **Verify Installation**
   - The accessibility toolbar should appear on your website
   - JavaScript file is automatically enqueued via `script-enqueue.php`

### File Structure
```
accessibility-plugin/
├── script-enqueue.php          # Main plugin file & script enqueuing
├── js/
│   └── accessibility-plugin.js # Core functionality
├── templates/
│   └── toolbar.php             # Accessibility toolbar UI
└── README.md
```

## Usage

The plugin automatically adds an accessibility toolbar to your website. Users can:
- Toggle individual accessibility features on/off
- Adjust typography settings in real-time
- Navigate using keyboard or voice commands
- Experience enhanced screen reader functionality

## Development Team

This project is developed by the Lasagna Love accessibility team:

- **Luis Avalos** - Lead Developer
- **Ernesto Perez** - Developer  
- **Isaac Quintanilla** - Developer
- **Tyler Tait** - Developer
- **Hanna Mekonnen** - Developer

## Project Goals

Create an intuitive, comprehensive accessibility solution that addresses diverse user needs through:
- Advanced screen reading capabilities
- Multi-modal navigation options
- Visual accessibility enhancements
- WCAG compliance standards
- Seamless WordPress integration
