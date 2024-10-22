<style>

     
    /* we want to have it so users can use dyslexia fonts if needed.  */
    /* TODO [FIXED]:  we can host the files locally, we no longer rely on external dependencies */
    /* THese are hosted in the fonts dir */


    /* TODO: Figure out why these do not load. */
    /* instantiating OpenDyslexic fonts  */

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

    @font-face { /* ITALICS FONT */
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

    @font-face { /* BOlD-ITALIC FONT */
        font-family: 'OpenDyslexic';
        src: url("../fonts/OpenDyslexic-Bold-Italic.woff2") format('woff2'), 
        url("../fonts/OpenDyslexic-Bold-Italic.woff") format('woff'),
        url("../fonts/OpenDyslexic-Bold-Italic.otf") format('opentype'),
        url("../fonts/OpenDyslexic-Bold-Italic.eot");

        font-weight: bold;
        font-style: italic;
        font-display: swap;
    
    }

    /* Dyslexic Font Fallback Mech. */
    body.accesibility-dyslexia-fonts {
        font-family: 'OpenDyslexic', Arial, Helvetica, sans-serif !important;
    }

    /* TODO: Fix any color or sizes issues --> this wil prolly look bad not good at css / artsy */
    /* TOOL BAR */
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
    #toolbar:focus{
        outline: 2px midnightblue;
        box-shadow: 0 0 0 3px rgba(0, 123,255, 0.5);
    }
    /* TOOL BAR buttons */
    .accessibility-button {
        background-color: lightblue;
        border: none;
        border-radius: 8px;
        margin: 6px 0 ;
        padding: 10px 15px;
        font-size: 15px;
        width: 100%;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .accessibility-button:hover{
        background-color: #0056b3;
    }
    .accessibility-button:focus{
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123,255, 0.5);
    }

    /* select wrapping */
    .select-wrapping {
        margin: 10px 0;
    }
    .select-wrapping label{
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
    .select:focus{
        outline: none;
        border-color: lightskyblue;
        box-shadow: 0 0 0 3px rgba(0, 123,255, 0.25);
    }

    /* TODO: Finish */
    /* Color mode  */
    body.color-mode-protanopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(300%);
    }

    body.color-mode-tritanopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(50deg) saturate(300%);
    }

    body.color-mode-deuteranopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(200%);
    }
    body.high-contrast {
        --background-color: #000000;
        --text-color: #FFFFFF;
        --link-color: #00FFFF;
        --button-background: #333333;
        --button-text: #FFFFFF;
    }

    body.color-mode-default{
        filter: none;
    }

    /* TODO: lets see how this looks in testing --> if it can look better we will use */

    /* TODO: instead of attempting to maniuplate using values, we can use SVG filters */
    /* Protanopia Simulation */
    body.protanopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(300%);
    }

    /* Deuteranopia Simulation */
    body.deuteranopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(200%);
    }

    /* Tritanopia Simulation */
    body.tritanopia {
        filter: grayscale(100%) sepia(100%) hue-rotate(50deg) saturate(300%);
    }

    body.color-mode-high-contrast {
        background-color: var(--background-color, #000);
        color: var(--text-color, #FFF);
    }

    body.color-mode-high-contrast a {
        color: var(--link-color, #00FFFF);
    }

    body.color-mode-high-contrast button {
        background-color: var(--button-background, #333);
        color: var(--button-text, #FFF);
    }

</style>    


<!-- this will be a toolbar for our plugin -->
<div id="toolbar" role="navigation" aria-label="Accessibility Toolbar">

    <button id="screen-reader-toggle" class="accessibility-button" aria-pressed="false">
        <span class="accessibility-button-label">Screen Reader</span>
    </button>

    <button id="voice-input-toggle" class='accessibility-button' aria-pressed="false">
        <span class="accessibility-button-label">Voice Input</span>
    </button>

    <button id="keyboard-navigation-toggle" class='accessibility-button' aria-pressed="false">
        <span class="accessibility-button-label">keyboard navigation</span>
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

    <button id="OpenDyslexic" class="accessibility-button" aria-pressed="false">
        <span class="dyslexia-font-toggle">Dyslexia Font</span>
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
        </select>
    </div>

</div> <!-- end of master div -->
