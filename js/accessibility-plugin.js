    
    // [LIST OF WHAT NEEDS TO BE DONE] ---> more below in code.
    // TODO (1): webspeech API broweser support --> there may be a few browsers that dont support this api, we may need to think of a work around this edge case.
    // // TODO (2): need a func that stops the read, we cant read all website at once
    // // TODO (3): implement keyboard navigation -> I'll take this on right now (Isaac Quintanilla)
    // // TODO (4): implement voice nav -> requires audio input, need a function to stopp gettng audio input
    // TODO (5): handling errors --> this needs to be more thought out.
    // // TODO (6): FEATURE: toolbar to navigate features --> could be done in PHP with CSS styling, this may be the easiest way. 
    // // TODO (7): FEATURE: color mode funct for color blindness
    // // TODO (8): FEATURES : adjusting text size , line spacing, dyslexia friendly font
    // TODO (9): --> animation for pausing  POTENTIAL FEATURE! --> prolly wont happen 
    // // TODO (18): Finish Color Mode Feature 
    // TODO (19): make screen reader, read faster ---> customizable speed. || Blind individuals tend to process audio info faster according to thursday business guest speaker

    // UPDATED TODO --> everything that has not been crossed out we still need to do, below are the new todos
    // TODO: fix keyboard nav, doesnt work properly. 
    // TODO: Screen reader continues to read previous page if you click on another site page
    // TODO: Font size not working properly, works more like a tab
    // TODO: Only deutranopia & default color modes work, BUT when you change to deutranopia, the tool bar stays at the bottom of the page
    // TODO: figure out why sometimes the toolbar just dissapears 
    // TODO: Dyslexia Font Does not work / replace the font on the page 
    // TODO: Settings dont change when you move to a diff page 
    // TODO: Test Voice nav, has not been tested at all
        // TODO: add more commands for voice nav
    // TODO: we can probably delete our css file entirely, since its been streamlined to toolbar.php

    // // TODO event listeners [FEATURES]
       //  // TODO (10): toggling screen reader 
        // // TODO (11): toggle key board nav 
        // // TODO (12): toggel voice nav
        // // TODO (13): toggel color mode 
        // // TODO (14): font size
        // // TODO (15): line spacing
        // // TODO (16): dyslexia font 
        // TODO (17): animatations


    // TODO Im sure there is more func and stuff I havent thought of --> add what you think what else needs to be done 
    // TODO TEST EVERYTHING
        // // TODO Current Issue, i theorize that the css and js files are not being correctly loaded, cannot find them 
                // // TODO when i inspect element in test site --> I believe they should still appear
                    // // TODO  Additionally, the toolbar has no styling nor functionality. 
    
    // other docs -- more detail located within their respected files!
    // // TODO : CSS stlyes page 
    // // TODO php enque script 
    // // TODO php template for toolbar --> located in templates directory 

    


// screen reader logic 
// IIFE function, so we can reduce global scope pollution
(function(){

    'use strict';

    // current state variable --> is feature: enabled or disabled?
    let EnableKeyboardNav =     false;
    let EnableVoiceInput =      false;
    let EnableScreenReader =    false;
    let EnableOpenDyslexiaFont =false;
    let EnableAnimatiosPause =  false; // potentially a feature, time permitting 

    // AS OF NOW : this feature is a maybe, will be executed if time permits, but would be nice
    // custom settings ---> init set to default, users if needed can change these
    let fontSize = 100;
    let letterSpac = 0;
    let lineHeight = 1.5;

    
    // PRECHECK: check if browswer support WebSpeech APIs
    const speechSynthSupport = 'speechSynthesis' in window;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechRecognitionSupported = !!SpeechRecognition;
    
    // if supported we can continue 
    // Screen Reader Logic Start 
    const screenReader = {

        // [VARIABLES]
        // Place holder for speech utterance obj from API, reference to speech synth engine from api
        synth: window.speechSynthesis,
        utterance: null, 


        // speack text funct
        // (tts)text-to-speech function, converts text to speech via web speech api
        tts: function(text){

            // we wont to only perform this if screen reader is enabled and our speech synth api is supported by current browser
            if(EnableScreenReader && speechSynthSupport){
                // use our utterance var 
                this.utterance = new SpeechSynthesisUtterance(text);
                // settings for the utterance [subject to change]
                this.utterance.rate =1;
                this.utterance.lang = document.documentElement.lang || 'en-US';
                this.utterance.pitch = 1;

                // tts 
                this.synth.speak(this.utterance);
            }
        },



        // Method to read the website,
        // here is where the screen reader will get what to read
        // it should read the labels from our website
        readWebsite: function(){
            // depending on the website --> select the main content and selectors, assuming website is built using standard semantics/lables 
            let websiteMainCont = document.querySelector(
                'main, [role="main], .main-content, #main-content, #content, .content');
           

            // however, if website doesnt abide by standard labels --> we will use lasagna love specifc selectors,
            if(!websiteMainCont){
                websiteMainCont = document.querySelector(
                    ' .elementor-section-wrap, .elementor-widget-container');
            }


            // if text still not found, we can try the body
            if(!websiteMainCont){
                websiteMainCont = document.body;
            }

            // so now that we have extracted the text ---> tts 
            const textToBeRead = websiteMainCont.innerText || websiteMainCont.textContent;

            // call our tts function 
            this.tts(textToBeRead);
            
        },

        // method to stop screen reader
        stopReading: function() {
            if(this.synth.speaking) {
                this.synth.cancel();
            }
        } 

    }; // end of screen reader obj

    // TODO: Finish, currenty (10/8) bare object not much to it as of now --> FOR ALL THE OBJ BELOW
    const keyboardNavigation = {
        // store currently focused element
        currentFocusedElement: null,

        // initializer funciton 
        init: function(){
            // Set up an event listener for keydown events
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
        },

        // Keydown event handler
        handleKeyDown: function(event) {
            // switch case for different key presses
            switch(event.key) {
                case 'Tab':
                    this.handleTab(event);
                    break;
                case 'ArrowUp':
                    this.navigate('previous');
                    break;
                case 'ArrowDown':
                    this.navigate('next');
                    break;
                case 'Enter':
                    this.activateCurrentElement();
                    break;
                case 'Escape':
                    this.closeFocusedElement();
                    break;
                default:
                    break;

            }
        },

        // Handle Tab key for focused element
        handleTab: function(event) {
            const focusableElements = this.getFocusableElements();
            const currentIndex = focusableElements.indexOf(document.activeElement);

            // Determine next focusable element based on whether Shift is pressed (for reverse Tab)
            let nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;

            // Circular navigation
            if (nextIndex < 0) nextIndex = focusableElements.length - 1;
            if (nextIndex > focusableElements.length) nextIndex = 0;

            focusableElements[nextIndex].focus();
            event.preventDefault(); // Prevent the default tab behavior
        },

        // Get all focusable elements on the page
        getFocusableElements: function() {
            return Array.from(document.querySelectorAll(
                'a, button, input, [tabindex]:not([tabindex="-1"])'
            )).filter(el => !el.hasAttribute('disabled')); // Filter out disabled elements
        },

        // Navigate between sections using Arrow Keys
        navigate: function(direction) {
            const focusableElements = this.getFocusableElements();
            const currentIndex = focusableElements.indecOf(document.activeElement);
            let nextIndex;

            if (direction === 'previous') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            } else {
                nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            }

            focusableElements[nextIndex].focus();
        },

        // Activate currently focused element (for Enter Key)
        activateCurrentElement: function() {
            if (document.activeElement && typeof document.activeElement.click === 'function') {
                document.activeElement.click();
            }
        },

        // Close or cancel (for Escape Key)
        closeFocusedElement: function() {
            const focusedElement = document.activeElement;

            // Example: if a model or pop-up is focused, you might want to close it
            if(focusedElement && focusedElement.classList.contains('modal')) {
                focusedElement.style.display = 'none';
            }
        },
    }; // end of keyboad nav



    // TODO: POTENTIAL FEATURE, if not working well we will proceed without it.
    const voiceInput = {

        voiceRecognition: null, 
        
        // init funct 
        init: function () {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            // if not supported
            if(!speechRecognitionSupported){
                console.warn ("Error: Voice recognition is not supported on your current browser.");
                return;
            }

            // IS SUPPORTED
            // TODO: FINISH!! 
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = document.documentElement.lang || 'en-US';
            this.voiceRecognition.onresult = this.voiceInputCommand.bind(this);

            this.voiceRecognition.onerror = function(event) {
                console.error('Voice Recognition Error: ', event.error);
            };
                
        }, 

        start: function(){
            if(EnableVoiceInput && speechRecognitionSuppot && this.voiceRecognition){

                try{
                    this.voiceRecognition.start();
                }catch(error){
                    console.error("Voice Recognition Start Error: ", error);
                }

            }
        }, 

        stop: function () {
            if(this.voiceRecognition){
                this.voiceRecognition.stop();
            }
        }, 


        // TODO: Finish 
        // we want a fuction that will handle the results, and do some action --> based on our voice input
        voiceInputCommand: function(event) {

            // TODO: finish this --> null is a place holder
            const voiceInputResults = event.results;
            const transcript = results[results.length -1][0].transcript.trim().toLowerCase();

            // TODO: this is bare bones, maybe there is better way?
            if(inputTranscript.includes('scroll down')) {
                window.scrollBy(0,100);
            }

            else if (inputTranscript.includes('scroll up')){
                window.scrollBy(0, -100);
            }

            else if (inputTranscript.includes(('read website'))){
                screenReader.readWebsite();
            }

            else if (inputTranscript.includes(('stop reading'))){
                screenReader.stopReading();
            }

            // TODO: Add more commands, this needs thorough testing !
            
            





        }





    }; // end of voice input obk 


    // TODO: NEEDS TESTING
    const adjustTextSize = {

        increase: function() {
            fontSize+= 10;

            // check if font, hasnt and will not exceed our limit font size 
            if(fontSize > 200){
                fontSize = 200;
            }
            // set font size 
            document.documentElement.style.fontSize = fontSize + '%';
            localStorage.setItem('increase-text-size', fontSize);
        },

        // decreas font size function 
        decrease: function() {
            // limiting the amount we can decrease the font
            fontSize = Math.max(40, fontSize - 10);
            document.documentElement.style.fontSize = fontSize + '%';
            localStorage.setItem('decrease-text-size', fontSize);

        }, 

        // load font size 
        loadFontSize: function() {
            // we want a field that wil save the current font size that will get displayed
            const savedFontSize = localStorage.getItem('adjust-text-size');

            if(savedFontSize){
                fontSize = parseInt(savedFontSize, 10);
                document.documentElement.style.fontSize = fontSize + '%';
            }
        }
    }; // end of adjust text size 


    // TODO: Seems to be working pretty good! --> however, we dont want to adjust the spacing on our toolbar
    const adjusSpacing = {

        // incrase line spacing funct 
        increase: function() {
            // increment with these value at each adjustment 
            letterSpac+=0.5;
            lineHeight += 0.1;

            document.body.style.letterSpacing = letterSpac + 'px';
            document.body.style.lineHeight = lineHeight;

            localStorage.setItem('adjust-letter-spacing', letterSpac);
            localStorage.setItem('adjust-line-spacing', lineHeight);

        }, 

        decrease: function() {
            //  decrease limit 
            letterSpac = Math.max(0, letterSpac - 0.5);
            lineHeight = Math.max(1.0, lineHeight - 0.1);
            
            document.body.style.letterSpacing = letterSpac + 'px';
            document.body.style.lineHeight = lineHeight;

            localStorage.setItem('adjust-letter-spacing', letterSpac);
            localStorage.setItem('adjust-line-spacing', lineHeight);

        }, 

        loadSpacing: function() {

            const savedLetter = localStorage.getItem('adjust-letter-spacing');
            const savedHeight = localStorage.getItem('adjust-line-spacing');
            
            if(savedLetter) {
                letterSpac = parseFloat(savedLetter);
                document.body.style.letterSpacing = letterSpac;
            }

            if(savedHeight) {
                lineHeight = parseFloat(savedHeight);
                document.body.style.lineHeight  = lineHeight;
            }
        }

    }; 

    // // TODO: NEEDS finishing --> loading font
    // dyslexia font 
    const OpenDyslexiaFont = {

        toggle: function() {
            // enable O.D font --> inverse, since set to false;
            EnableOpenDyslexiaFont = !EnableOpenDyslexiaFont;

            if(EnableOpenDyslexiaFont){
                document.body.classList.add('dyslexia-font-toggle');
                localStorage.setItem('Open-Dyslexia-Font', 'true');
            }else {
                document.body.classList.remove('dyslexia-font-toggle');
                localStorage.setItem('Open-Dyslexia-Font', 'false');
            }
        }, 

        // load font 
        loadDyslexiaFont: function() {
            const savedFont = localStorage.getItem('Open-Dyslexia-Font') === 'true';
            if(savedFont){
                EnableOpenDyslexiaFont = true;
                document.body.classList.add('dyslexia-font-toggle');
            }
        }

    }; // end of adjust spacing obj 

    // color mode feature --> protanopia, deuteranopia, tritanopia, high-contrast

    // TODO: Finish
    const colorMode = {

        // setting mode --> remove any current color mode  
        setColorMode: function(mode){
            document.body.classList.remove('color-mode-tritanopia','color-mode-highcontrast', 'color-mode-protanopia', 'color-mode-deuteranopia' );
            
            // setting our desired color mode --> checks to see if we have requested something other than the default color mode curr set
            if(mode !== 'default'){
                document.body.classList.add(`color-mode-${mode}`);
            }
            
            // // reset to default color mode mechanism 
            // if(mode == 'reset'){
            //     mode = 'default';
            // }

            localStorage.setItem('color-mode', mode);

        },

        loadColorMode: function() {

            // save our current mode 
            const savedColorMode = localStorage.getItem('color-mode') || 'default';
            // fetch and apply 
            this.setColorMode(savedColorMode);

            const selectColorMode = document.getElementById('color-mode-select');
            if(selectColorMode){
                selectColorMode.value = savedColorMode;
            }


        }
        

    };



    //  [  EVENT LISTENERS FOR TOGGLING ]

    document.addEventListener('DOMContentLoaded', function (){

        // cust setting
        adjustTextSize.loadFontSize();
        adjusSpacing.loadSpacing();
        OpenDyslexiaFont.loadDyslexiaFont();
        colorMode.loadColorMode();


        // toggle toolbar 
        const accessbilityToggle = document.getElementById('accessibility-toggle');
        const accessbilityToolbar = document.getElementById('accessibility-toolbar');

        const tbState = localStorage.getItem('accessibility-toolbar') === 'true';
        if(accessbilityToolbar){
            accessbilityToolbar.hidden = !tbState;
        }
        if(accessbilityToggle){
            accessbilityToggle.setAttribute('aria-pressed', tbState.toString());

            accessbilityToggle.addEventListener('click', function(){
                const toggled = this.getAttribute('aria-pressed') === 'true';
                const newTbState = !toggled;
                this.setAttribute('aria-pressed', newTbState.toString());
                accessbilityToolbar.hidden = !newTbState;
                localStorage.setItem('accessibility-toolbar', newTbState.toString());
            });
        }

        // keyboard toggle 
        const keyboardNavigationToggle = document.getElementById("keyboard-navigation-toggle");
        if(keyboardNavigationToggle) {
            keyboardNavigationToggle.addEventListener('click', function(){
                EnableKeyboardNav = !EnableKeyboardNav;
                if(EnableKeyboardNav){
                    keyboardNavigation.init();
                    this.textContent = 'Keyboard Navigation ON';
                    this.setAttribute('aria-pressed', 'true');
                    // // TODO: Fill in correct id
                    localStorage.setItem('keyboard-navigation', 'true');
                }else{
                    this.textContent = 'Keyboard Navigation OFF';
                    this.setAttribute('aria-pressed', 'true');
                    // // TODO: Fill in correct id
                    localStorage.setItem('keyboard-navigation', 'false');
                }
            });

            // init button text 
            const savedKeyboardMode = localStorage.getItem('keyboard-navigation') === true;
            EnableKeyboardNav = savedKeyboardMode;
            keyboardNavigationToggle.textContent = EnableKeyboardNav ? 'Keyboard Navigation ON' : 'Keyboard Navigation OFF';
            keyboardNavigationToggle.setAttribute = ('aria-pressed', EnableKeyboardNav.toString());

        }


        // Screen reader toggle 
        const screenReaderToggle = document.getElementById("screen-reader-toggle");
        if(screenReaderToggle){
            // click i t
            screenReaderToggle.addEventListener('click', function(){
                //Enable the screen reader!
                EnableScreenReader = !EnableScreenReader;
                if(EnableScreenReader){
                    screenReader.readWebsite();
                    this.textContent = 'Screen Reader On';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('screen-reader', 'true');
                } else {
                    screenReader.stopReading();
                    this.textContent = 'Screen Reader Off';
                    this.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('screen-reader', 'false');
                }
            });

            // init button save state
            const screenReaderState = localStorage.getItem('screen-reader') === 'true';
            EnableScreenReader = screenReaderState;

            if(EnableScreenReader){
                screenReader.readWebsite();
            }


            screenReaderToggle.textContent = EnableScreenReader ? 'Screen Reader On' : 'Screen Reader Off';
            screenReaderToggle.setAttribute('aria-pressed', EnableScreenReader.toString());

        }

        // voice input toggle 
        const voiceInputToggle = document.getElementById('voice-navigation-toggle');
        if(voiceInputToggle){

            voiceInputToggle.addEventListener('click', function(){
                EnableVoiceInput = !EnableVoiceInput;
                if(EnableVoiceInput){
                    voiceInput.init();
                    voiceInput.start();
                    this.textContent = 'Voice Navigation On';

                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('voice-navigation', 'true');
                }
                else {

                    voiceInput.stop();
                    this.textContent = 'Voice Navigation Off';
                    localStorage.setItem('aria-pressed', 'false');
                }
            });

            // init 
            const voiceInputState = localStorage.getItem('voice-navigation') === 'true';

            EnableVoiceInput = voiceInputState;
            if(EnableVoiceInput){
                voiceInput.init();
                voiceInput.start();
            }

            voiceInputToggle.textContent = EnableVoiceInput ? 'Voice Navigation On' : 'Voice Navigation Off';
            voiceInputToggle.setAttribute('aria-pressed', EnableVoiceInput.toString());


        }


        // color mode toggle 
        // TODO: potentital issue, --> wrong id 
        const colorModeToggle = document.getElementById('color-mode-select');
        if(colorModeToggle) {
            colorMode.addEventListener('change', function(){
                colorMode.setColorMode(this.value);
            });
        }

        // TODO: fix this, they are workign like tab buttons ---> OR this could be a website stlying/formatting issue, depending on how it was built.
        // font size toggles 
        const increaseFontSizeButton = document.getElementById('increase-text-size');
        if(increaseFontSizeButton){
            increaseFontSizeButton.addEventListener('click', function() {
                adjustTextSize.increase();
            });
        }
        
        const decreaseFontSizeButton = document.getElementById('decrease-text-size');
        if(decreaseFontSizeButton){
            decreaseFontSizeButton.addEventListener('click', function() {
                adjustTextSize.decrease();
            });
        }

        // spacing toggle
        const increaseSpacingButton = document.getElementById('increase-spacing');
        if(increaseSpacingButton){
            increaseSpacingButton.addEventListener('click', function() {
                adjusSpacing.increase();
            });
        }

        const decreaseSpacingButton = document.getElementById('decrease-spacing');
        if(decreaseSpacingButton){
            decreaseSpacingButton.addEventListener('click', function() {
                adjusSpacing.decrease();
            });
        }

        // dyslexia font toggel
        const dyslexiaFontToggle = document.getElementById('dyslexia-font-toggle');
        if(dyslexiaFontToggle){
            dyslexiaFontToggle.addEventListener('click', function(){
                OpenDyslexiaFont.toggle();
                dyslexiaFontToggle.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
                dyslexiaFontToggle.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
            });


            // init button text
            const savedDysFontState = localStorage.getItem('Open-Dyslexia-font') === 'true';
            EnableOpenDyslexiaFont = savedDysFontState;

            if(EnableOpenDyslexiaFont){
                document.body.classList.add('Open-Dyslexia-font');
            }
            
            this.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
            dyslexiaFontToggle.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
        }


    }); // end of event listeners/toggle section



})(); // end of function

