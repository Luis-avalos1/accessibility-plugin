<!-- Begin toolbar.php -->
<style>
    /* Your existing CSS styles */

    /* Adjusted button styles to accommodate icons */
    #accessibility-toolbar button {
        background-color: lightblue;
        border: none;
        border-radius: 5px;
        margin: 6px 0;
        padding: 10px;
        font-size: 15px;
        width: 100%;
        cursor: pointer;
        transition: background-color 0.3s ease;
        text-align: center;
    }

    #accessibility-toolbar button img {
        width: 30px;
        height: 30px;
    }

    /* Active button state */
    #accessibility-toolbar button.active {
        background-color: blue;
    }
</style>

<!-- Accessibility Toggle Button -->
<button id="accessibility-toggle" aria-label="Enable Accessibility Toolbar" aria-pressed="false">
    <img src="images/accessibility-icon.svg" alt="Accessibility Icon" aria-hidden="true">
</button>

<!-- Accessibility Toolbar -->
<div id="accessibility-toolbar" hidden>
    <button id="screen-reader-toggle" class="accessibility-button" aria-pressed="false" aria-label="Enable Screen Reader">
        <img src="images/screen-reader-icon.svg" alt="Screen Reader Icon" aria-hidden="true">
    </button>

    <button id="voice-input-toggle" class="accessibility-button" aria-pressed="false" aria-label="Enable Voice Input">
        <img src="images/voice-input-icon.svg" alt="Voice Input Icon" aria-hidden="true">
    </button>

    <button id="keyboard-navigation-toggle" class="accessibility-button" aria-pressed="false" aria-label="Enable Keyboard Navigation">
        <img src="images/keyboard-navigation-icon.svg" alt="Keyboard Navigation Icon" aria-hidden="true">
    </button>

    <button id="increase-text-size" class="accessibility-button" aria-label="Increase Text Size">
        <img src="images/increase-text-size-icon.svg" alt="Increase Text Size Icon" aria-hidden="true">
    </button>

    <button id="decrease-text-size" class="accessibility-button" aria-label="Decrease Text Size">
        <img src="images/decrease-text-size-icon.svg" alt="Decrease Text Size Icon" aria-hidden="true">
    </button>

    <button id="increase-spacing" class="accessibility-button" aria-label="Increase Spacing">
        <img src="images/increase-spacing-icon.svg" alt="Increase Spacing Icon" aria-hidden="true">
    </button>

    <button id="decrease-spacing" class="accessibility-button" aria-label="Decrease Spacing">
        <img src="images/decrease-spacing-icon.svg" alt="Decrease Spacing Icon" aria-hidden="true">
    </button>

    <button id="dyslexia-font-toggle" class="accessibility-button" aria-pressed="false" aria-label="Enable Dyslexia Font">
        <img src="images/dyslexia-font-icon.svg" alt="Dyslexia Font Icon" aria-hidden="true">
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

