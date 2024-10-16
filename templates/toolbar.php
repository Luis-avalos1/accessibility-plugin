<!-- this will be a toolbar for our plugin -->
<div id="toolbar" role="navigation" aria-label="Accessibility Toolbar">

    <button id="screen-reader-toggle" class="accessibility-button" aria-pressed="false">
        <span class="accessibility-button-label">Screen Reader</span>
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

    <button id="dyslexia-font-toggle" class="accessibility-button" aria-pressed="false">
        <span class="accessibility-button-label">Dyslexia Font</span>
    </button>

    <!-- Wrap the select element in a div with class 'select-wrapping' and include a label -->
    <div class="select-wrapping">
        <label for="color-mode-select">Color Mode</label>
        <select id="color-mode-select" class="select" aria-label="Select Color Mode">
            <option value="default">Default</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
            <option value="high-contrast">High Contrast</option>
            <option value="reset">Reset to Default</option>
        </select>
    </div>

</div> <!-- end of master div -->
