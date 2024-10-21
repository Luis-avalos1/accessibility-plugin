    
    // [LIST OF WHAT NEEDS TO BE DONE] ---> more below in code.
    // TODO (1): webspeech API broweser support --> there may be a few browsers that dont support this api, we may need to think of a work around this edge case.
    // TODO (2): need a func that stops the read, we cant read all website at once
    // TODO (3): implement keyboard navigation -> I'll take this on right now (Isaac Quintanilla)
    // TODO (4): implement voice nav -> requires audio input, need a function to stopp gettng audio input
    // TODO (5): handling errors --> this needs to be more thought out.
    // TODO (6): FEATURE: toolbar to navigate features --> could be done in PHP with CSS styling, this may be the easiest way. 
    // TODO (7): FEATURE: color mode funct for color blindness
    // TODO (8): FEATURES : adjusting text size , line spacing, dyslexia friendly font
    // TODO (9): --> animation for pausing  POTENTIAL FEATURE!
    // TODO (18): Finish Color Mode Feature 
    // TODO (19): make screen reader, read faster ---> customizable speed. 

    // TODO event listeners [FEATURES]
        // TODO (10): toggling screen reader 
        // TODO (11): toggle key board nav 
        // TODO (12): toggel voice nav
        // TODO (13): toggel color mode 
        // TODO (14): font size
        // TODO (15): line spacing
        // TODO (16): dyslexia font 
        // TODO (17): animatations

    // TODO Im sure there is more func and stuff I havent thought of --> add what you think what else needs to be done 
    

    
    // TODO IMPORTANT
    // TODO TEST EVERYTHING
        // TODO Current Issue, i theorize that the css and js files are not being correctly loaded, cannot find them 
                // TODO when i inspect element in test site --> I believe they should still appear
                    // TODO  Additionally, the toolbar has no styling nor functionality. 
    




    // other docs -- more detail located within their respected files!
    // TODO : CSS stlyes page 
    // TODO php enque script 
    // TODO php template for toolbar --> located in templates directory 

    


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
    const speechRecognitionSuppot = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    

    // if supported we can continue 
    // Screen Reader Logic Start 
    const screenReader = {

        // [VARIABLES]
        // Place holder for speech utterance obj from API, reference to speech synth engine from api
        synth: window.speechSynthesis,
        utterance: null, 


        // speack text funct
        // (tts)text-to-speech function, converts text to speech via web speech api
        // TODO: fix this function --> i dont think it should take in a parameter 
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
            let websiteMainCont = 
            document.querySelector('main')||
            document.querySelector('[role= "main"]') ||
            document.querySelector('.main-content')||
            document.getElementById('main-content')||
            document.querySelector('#content');
            document.querySelector('.content');


            // however, if website doesnt abide by standard labels --> we will use lasagna love specifc selectors,
            // TODO: add more lables/selectors specific to the current lasagna love website! if needed, but probably
            if(!websiteMainCont){
                websiteMainCont = 
                document.querySelector('.elementor-section-wrap') ||
                document.querySelector('.elementor-widget-container');
            }


            // TODO: If still not found --> BODY CONTENT
            // if we still have content, we will try and get it from body
            // BODY CONTENT




            // TODO: If still not found go to BODY TEXT

            // CODE HERE, ---> NOT DONE
            // TODO: finish this --> way more to be added 
            
        },

        // TODO: more functions go below here!
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
            if(!SpeechRecognition){
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
            }else if (inputTranscript.includes('scroll up')){
                window.scrollBy(0, -100);
            }// }else if()
            // TODO: finsh ---> handle feature toggline 
            





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

    // TODO: NEEDS TESTING 
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

    // TODO: NEEDS finishing --> loading font 
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
            document.body.classList.remove('color-mode-tritanopia','color-mode-highconstrast', 'color-mode-protanopia', 'color-mode-deuteranopia' );
            
            // setting our desired color mode --> checks to see if we have requested something other than the default color mode curr set
            if(mode !== 'default'){
                document.body.classList.add(`color-mode-${mode}`);
            }
            
            // reset to default color mode mechanism 
            if(mode == 'reset'){
                mode = 'default';
            }

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


        // toggling below


        // toggle 
        // TODO: input correct id 
        const keyboardNavigationToggle = document.getElementById("keyboard-navigation-toggle");
        if(keyboardNavigationToggle) {
            keyboardNavigationToggle.addEventListener('click', function(){
                EnableKeyboardNav = !EnableKeyboardNav;
                if(EnableKeyboardNav){
                    keyboardNavigation.init();
                    this.textContent = 'Keyboard Navigation ON';
                    this.setAttribute('aria-pressed', 'true');
                    // TODO: Fill in correct id
                    localStorage.setItem('', 'true');
                }else{
                    this.textContent = 'Keyboard Navigation OFF';
                    this.setAttribute('aria-pressed', 'true');
                    // TODO: Fill in correct id
                    localStorage.setItem('', 'false');
                }
            });

            // init button text 
            keyboardNavigationToggle.textContent = EnableKeyboardNav ? 'Keyboard Navigation ON' : 'Keyboard Navigation OFF';
            keyboardNavigationToggle.setAttribute = ('aria-pressed', EnableKeyboardNav.toString());

        }

        // color mode toggle 
        // TODO: potentital issue, --> wrong id 
        const colorModeToggle = document.getElementById('color-mode-select');
        if(colorModeToggle) {
            // TODO: comment below this
            // trying the 'click' ---> instead of 'change ::: was previously change, so if it doesnt work change it back
            colorMode.addEventListener('click', function(){
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
            this.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
            dyslexiaFontToggle.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
        }


    }); // end of event listeners/toggle section



})(); // end of function

