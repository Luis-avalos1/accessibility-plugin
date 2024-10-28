<!-- Begin toolbar.php -->
<style>
    /* Font Face Declarations for OpenDyslexic Font */
    @font-face {
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Regular.woff2") format('woff2'),
             url("../fonts/OpenDyslexic-Regular.woff") format('woff'),
             url("../fonts/OpenDyslexic-Regular.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Regular.eot");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-It) format('woff2'),
             url("../fonts/OpenDyslexic-It) format('woff'),
             url("../fonts/OpenDyslexic-Italic.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Italic.eot");
        font-weight: normal;
        font-style: italic;
        font-display: swap;
    }

    @font-face {
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Bold.woff2") format('woff2'),
             url("../fonts/OpenDyslexic-Bold.woff) format('woff'),
             url("../fonts/OpenDyslexic-Bold.otf") format('opentype'),
             url("../fonts/OpenDyslexic-Bold.eot");
        font-weight: bold;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Bold-It)) format('woff),
             url("../fonts/OpenDyslexic-Bold-It) format('woff'),
             url("../fonts/OpenDyslexic-Bold-It) format('opentype'),
             url("../fonts/OpenDyslexic-Bold.eot");
        font-weight: bold;
        font-style: italic;
        font-display: swap;
    }

    /* Apply OpenDyslexic Font */
    body.dyslexia-font-toggle {
        font-family: 'OpenDyslexic', Arial, Helvetica, sans-serif !important;
    }

    /* Accessibility Toggle Button Styles */
    #accessibility-toggle {
        position: fixed;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        z-index: 1000;
        background-color: white;
        border: none;
        cursor: pointer;
        padding: 10px;
        border-radius: 50%;
        outline: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Accessibility Logo Styling */
    #accessibility-toggle img {
        width: 30px;
        height: 30px;
    }

    /* Button State: When Pressed */
    #accessibility-toggle[aria-pressed="true"] {
        background-color: blue;
    }

    /* Toolbar Styles */
    #accessibility-toolbar {
        position: fixed;
        top: 50%;
        left: 70px; /* Adjust based on toggle button size and position */
        transform: translateY(-50%);
        z-index: 999;
        background-color: #f9f9f9;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        width: 250px;
    }

    /* Hide the toolbar when not visible */
    #accessibility-toolbar[hidden] {
        display: none;
    }

    /* Toolbar Button Styles */
    #accessibility-toolbar button {
        background-color: lightblue;
        border: none;
        border-radius: 5px;
        margin: 6px 0;
        padding: 10px 15px;
        font-size: 15px;
        width: 100%;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    #accessibility {
        background-color: #0056b3;
    }

    #accessibility-toolbar button:hover {
        background-color: #007bff;
    }

    #accessibility-toolbar button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.5);
    }

    /* Select Wrapping */
    .select-wrapping {
        margin: 10px 0;
    }

    .select-wr {
        display: block;
        font-size: 15px;
        margin-bottom: 5px;
        color: darkslategrey;
    }

    .select {
        width: 100%;
        padding: 10px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        font-size: 15px;
        background-color: white;
        appearance: none;
        position: relative;
        cursor: pointer;
    }

    .select:focus {
        outline: none;
        border-color: lightskyblue;
        box-shadow: 0 0 0 3px rgba(0,123,255,0.25);
    }

    /* Color Mode Styles */
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
        background-color: #000000 !important;
        color: #FFFFFF !important;
    }

    /* High Contrast Mode Specific Elements */
    body.color-mode-high-contrast a {
        color: #00FFFF !important;
    }

    body.color-mode-high-contrast button {
        background-color: #333333 !important;
        color: #FFFFFF !important;
    }
</style>

<!-- Accessibility Toggle Button -->
<button id="accessibility-toggle" aria-label="Enable Accessibility Toolbar" aria-pressed="false">
    <img src="path/to/accessibility-icon.svg" alt="Accessibility Icon" aria-hidden="true">
</button>

<!-- Accessibility Toolbar -->
<div id="accessibility-toolbar" hidden>
    <button id="screen-reader-toggle" class="accessibility-button" aria-pressed="false">
        Screen Reader
    </button>

    <button id="voice-input-toggle" class="accessibility-button" aria-pressed="false">
        Voice Input
    </button>

    <button id="keyboard-navigation-toggle" class="accessibility-button" aria-pressed="false">
        Keyboard Navigation
    </button>

    <button id="increase-text-size" class="accessibility-button" aria-label="Increase Text Size">
        Increase Text Size
    </button>

    <button id="decrease-text-size" aria-label="Decrease Text Size">
        Decrease Text Size
    </button>

    <button id="increase-spacing" class="accessibility-button" aria-label="Increase Spacing">
        Increase Spacing
    </button>

    <button id="decrease-spacing" class="accessibility-button" aria-label="Decrease Spacing">
        Decrease Spacing
    </button>

    <button id="dyslexia-font-toggle" class="accessibility-button" aria-pressed="false">
        Dyslexia Font
    </button>

    <!-- Select Wrapper for Color Mode -->
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
</div>

<!-- Include JavaScript -->
<script src="path/to/your/accessibility-plugin.js"></script>
<!-- End toolbar.php -->
