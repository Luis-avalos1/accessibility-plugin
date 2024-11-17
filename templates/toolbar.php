<!-- Accessibility Toolbar with Embedded CSS -->

<!-- Start of CSS and HTML combined -->
<style>
    /* OpenDyslexic Fonts */
    @font-face { /* REGULAR FONT */
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Regular.woff2") format('woff2'),
             url("../fonts/OpenDyslexic-Regular.woff") format('woff'),
             url("../fonts/OpenDyslexic-Regular.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Regular.eot");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face { /* ITALIC FONT */
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Italic.woff2") format('woff2'),
             url("../fonts/OpenDyslexic-Italic.woff") format('woff'),
             url("../fonts/OpenDyslexic-Italic.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Italic.eot");
        font-weight: normal;
        font-style: italic;
        font-display: swap;
    }

    @font-face { /* BOLD FONT */
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Bold.woff2") format('woff2'),
             url("../fonts/OpenDyslexic-Bold.woff") format('woff'),
             url("../fonts/OpenDyslexic-Bold.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Bold.eot");
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }

    @font-face { /* BOLD-ITALIC FONT */
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Bold-Italic.woff2") format('woff2'),
             url("../fonts/OpenDyslexic-Bold-Italic.woff") format('woff'),
             url("../fonts/OpenDyslexic-Bold-Italic.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Bold-Italic.eot");
        font-weight: bold;
        font-style: italic;
        font-display: swap;
    }

    /* Dyslexia Font Fallback Mechanism */
    body.accessibility-dyslexia-fonts {
        font-family: 'OpenDyslexic' !important;
    }

    /* Toolbar Styling */
    #toolbar {
        position: fixed;
        bottom: 25px;
        right: 25px;
        background-color: rgba(255, 255, 255, 0.98);
        border-radius: 10px;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0, 0.1);
        font-family: Arial, Helvetica, sans-serif;
        width: 280px;
        transition: all 0.3s ease-in-out;
    }

    #toolbar:hover {
        box-shadow: 0 4px 18px rgba(0,0,0, 0.15);
    }

    #toolbar:focus {
        outline: 2px midnightblue;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
    }

    /* Toolbar Buttons */
    .accessibility-button {
        background-color: lightblue;
        border: none;
        border-radius: 8px;
        margin: 6px 0;
        padding: 10px 15px;
        font-size: 15px;
        width: 100%;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .accessibility-button:hover {
        background-color: #0056b3;
        color: white;
    }

    .accessibility-button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
    }

    /* Select Wrapping */
    .select-wrapping {
        margin: 10px 0;
    }

    .select-wrapping label {
        display: block;
        font-size: 15px;
        margin-bottom: 5px;
        color: darkslategrey;
    }

    .select {
        width: 100%;
        padding: 10px;
        border: 1px solid #CCCCCC;
        border-radius: 8px;
        font-size: 15px;
        background-color: white;
        appearance: none;
        background-image: url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns="http://www.w3.org/2000/svg"%20viewBox="0%200%204%205"><polygon%20points="2,0%204,5%200,5"%20style="fill:%23CCCCCC;"/></svg>');
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 8px 10px;
    }

    .select:focus {
        outline: none;
        border-color: lightskyblue;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    /* Color Modes */
    body.color-mode-protanopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(300%);
    }

    body.color-mode-deuteranopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(200%);
    }

    body.color-mode-tritanopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(50deg) saturate(300%);
    }

    body.color-mode-high-contrast {
        --background-color: #000000;
        --text-color: #FFFFFF;
        --link-color: #00FFFF;
        --button-background: #333333;
        --button-text: #FFFFFF;
        background-color: var(--background-color);
        color: var(--text-color);
    }

    body.color-mode-high-contrast a {
        color: var(--link-color);
    }

    body.color-mode-high-contrast button {
        background-color: var(--button-background);
        color: var(--button-text);
    }

    body.color-mode-default {
        filter: none;
    }

    /* Ensure Toolbar Stays Fixed in Color Modes */
    body[class*="color-mode-"] #toolbar {
        position: fixed;
    }

    /* Keyboard Focused Element */
    .keyboard-focused {
        outline: 2px solid red !important;
    }
</style>

<!-- Accessibility Toolbar -->
<div id="toolbar" role="navigation" aria-label="Accessibility Toolbar">

    <button id="screen-reader-toggle" class="accessibility-button" aria-pressed="false" aria-label="Toggle Screen Reader">
        <span class="accessibility-button-label">Screen Reader</span>
    </button>

    <button id="voice-input-toggle" class="accessibility-button" aria-pressed="false" aria-label="Toggle Voice Input">
        <span class="accessibility-button-label">Voice Input</span>
    </button>

    <!-- Voice Input Status Indicator -->
    <div id="voice-input-status" aria-live="polite" style="margin-top: 10px; font-size: 15px; color: darkgreen;"></div>

    <button id="keyboard-navigation-toggle" class="accessibility-button" aria-pressed="false" aria-label="Toggle Keyboard Navigation">
        <span class="accessibility-button-label">Keyboard Navigation</span>
    </button>

    <button id="increase-text-size" class="accessibility-button" aria-label="Increase Text Size">
        <span class="accessibility-button-label">Increase Text Size</span>
    </button>

    <button id="decrease-text-size" class="accessibility-button" aria-label="Decrease Text Size">
        <span class="accessibility-button-label">Decrease Text Size</span>
    </button>

    <button id="increase-spacing" class="accessibility-button" aria-label="Increase Spacing">
        <span class="accessibility-button-label">Increase Spacing</span>
    </button>

    <button id="decrease-spacing" class="accessibility-button" aria-label="Decrease Spacing">
        <span class="accessibility-button-label">Decrease Spacing</span>
    </button>

    <button id="dyslexia-font-toggle" class="accessibility-button" aria-pressed="false" aria-label="Toggle Dyslexia Font">
        <span class="accessibility-button-label">Dyslexia Font</span>
    </button>

    <!-- Color Mode Select -->
    <div class="select-wrapping">
        <label for="color-mode-select">Color Mode</label>
        <select id="color-mode-select" class="select" aria-label="Select Color Mode">
            <option value="default">Default</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
            <option value="high-contrast">High Contrast</option>
        </select>
    </div>

</div> <!-- End of Toolbar -->


