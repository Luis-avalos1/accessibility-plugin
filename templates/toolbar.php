

<!-- this will be a toolbar for our plug in -->
<div id="toolbar" role ="navigation" aria-label="Accessibility Toolbar">

    {% comment %} TOGGLE OUR FEATURES {% endcomment %}
    {% comment %} Screen Reader Toggle {% endcomment %}
    <button id="screen-reader-toggle" class="accessibility-button" aria-pressed="false">
        <span class="accessibility-button-label">Screen Reader </span>
    </button>

    
    {% comment %} text features toggle {% endcomment %}
    <button id="increase-text-size" class="accessibility-button" aria-label="Increase Text Size">
        <span class="accessibility-button-label">Increase Text Size</span>
    </button>
    
    <button id="decrease-text-size" class="accessibility-button" aria-label="Decrease Text Size">
        <span class="accessibility-button-label">Decrease Text Size</span>
    </button>

    {% comment %} Spacing  {% endcomment %}
    <button id="increase-spacing" class="accessibility-button" aria-label="Increase Spacing">
        <span class="accessibility-button-label">Increase Spacing</span>
    </button>
    
    <button id="decrease-spacing" class="accessibility-button" aria-label="Decrease Spacing">
        <span class="accessibility-button-label">Decrease Spacing</span>
    </button>
    
    {% comment %} Open Dyslexia Font {% endcomment %}
    <button id="dyslexia-font-toggle" class="accessibility-button" aria-pressed="false">
        <span class="accessibility-button-label">Dyslexia Font</span>
    </button>

    {% comment %} color mode {% endcomment %}
    <select id="awe-color-mode-select" class="awe-select" aria-label="Select Color Mode">
        <option value="default">Default</option>
        <option value="protanopia">Protanopia</option>
        <option value="deuteranopia">Deuteranopia</option>
        <option value="tritanopia">Tritanopia</option>
        <option value="high-contrast">High Contrast</option>
        <option value="reset">Reset to Default</option>
    </select>
    




</div> <!-- end of master div --> 



            
    
    

    
    
