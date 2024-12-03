
// We can use a IIFE funciton to reduce global scope population
(function() {

    'use strict';


    // state variables --> are our features enabled???????
    let EnableKeyboardNavigation = false;
    let EnableVoiceInput = false;
    let EnableScreenReader = false;
    let EnableOpenDyslexiaFont = false;

    // initial settings --> these can be changed via methods below!
    let fontSize = 100;
    let letterSpac =0;
    let lineHeight = 1.5;


    // PRECHECK: we need to check if our browser supports the webSpeech APIs
    const speechSynthSupport = 'speechSynthesis' in window;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSpeechRecognitionSupported = !!SpeechRecognition;




    // screen reader logic 
    const screenReaderObject = {

        // place holderes foru speech utterance object from our API, reference to sppech synth engine from API
        synth: window.speechSynthesis,
        utterance: null,



        // our speak text function 
        // ttt == text to speech ,  converts text to speech via web speech api 
        //  takes in a textm and using the utterance obj it will speak it. 
        tts: function(text) {

            // we want to only use this if the screen reader is enables and our sppech synth api is supported in our browser
            if (EnableScreenReader && speechSynthSupport) {

                // case where if it has been talking, to stop --> keyboard nav related
                if (this.synth.speaking) {
                    this.synth.cancel(); 
                }

                // using our utterance object we created about we can execute speech, and set the settings for the voice 
                this.utterance = new SpeechSynthesisUtterance(text);
                this.utterance.rate = 1;
                this.utterance.lang = document.documentElement.lang || 'en-US';
                this.utterance.pitch = 1;
                

                // SPEAKKKKKKKK!
                this.synth.speak(this.utterance);
            }
        },


        // method that extract the labeling on an element on our website, --> usually this is for buttons or redirect elements --> we can read them
        readingAnElement: function(element) {
            // works by checking html semantics --> has fallback methods 
            const ttsText = element.getAttribute('aria-label') || element.alt || element.title || element.textContent || element.innerText || '';
            // read what we have extracted
            this.tts(ttsText);
        },



        // method that reads our website!
        // this is where the screen readers gets it texts that it will read
        readWebsite: function() {
            // depending on our website, ==> select the main content and selectors and assumiing the website is built using standard website semanitcs / labeling
            let websiteMainContent = document.querySelector(
                'main, [role="main"], .main-content, #main-content, #content, .content'
            );


            // however, if website doesntin abide by standard labels, we will use lasagna love specific selectors, since this is for lasagna love
            if (!websiteMainContent) {
                websiteMainContent = document.body;
            }

            // extract and set the content that will be read 
            const textToBeRead = websiteMainContent.innerText || websiteMainContent.textContent;
            // call our speak funciton 
            this.tts(textToBeRead);
        },



        // method that stops the screen reader from reading 
        stopReadingWebsite: function() {
            if (this.synth.speaking) {
                this.synth.cancel();
            }
        }
    };



    // method that ensures the screen reader will not continue reading if we navigate to another page on the site
    window.addEventListener('beforeunload', function() {
        screenReaderObject.stopReadingWebsite();
    });




    // keyboard nav logic
    const keyboardNavigationObject = {

        // want some elements that keep track of where we are!
        currentlyFocusedElement: null,
        previouslyFocusedElement: null,
        bindingHnadleKeyDown: null,


        init: function() {
            this.boundHandleKeyDown = this.handleKeyDown.bind(this);
            document.addEventListener('keydown', this.bindingHnadleKeyDown);
            // Add initial focus to the first focusable element
            const focusableElements = this.parseFocusableElems();
            if (focusableElements.length > 0) {
                this.currentElement(focusableElements[0]);
            }
        },



        disable: function() {
            document.removeEventListener('keydown', this.bindingHnadleKeyDown);
            if (this.currentlyFocusedElement) {
                this.currentlyFocusedElement.classList.remove('keyboard-focused');
            }
            this.currentFocusedElement = null;
            this.previousFocusedElement = null;
        },



        handleKeyDown: function(event) {
            // we want to use arrows for keyvoard nav so we must prevent their default behavior 
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
            }


            // keyvoard nav 
            switch (event.key)
             {
                case 'ArrowUp':
                case 'ArrowLeft':
                    this.navigate('previous');
                    break;

                    
                case 'ArrowDown':
                case 'ArrowRight':
                    this.navigate('next');
                    break;


                case 'Enter':
                    this.activateCurrElem();
                    break;

                case 'Escape':
                    this.closeCurrElem();
                    break;

                default:
                    break;
            }
        },



        parseFocusableElems: function() {
            return Array.from(document.querySelectorAll('a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]')).filter(el => el.offsetParent !== null);
        },



        currentElement: function(element) {
            if (this.currentlyFocusedElement) {
                this.currentlyFocusedElement.classList.remove('keyboard-focused');
            }
            this.previousFocusedElement = this.currentlyFocusedElement;
            this.currentFocusedElement = element;
            this.currentlyFocusedElement.focus();
            this.currentlyFocusedElement.classList.add('keyboard-focused');

            // Scroll element into view
            this.currentlyFocusedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Screen reader reads the focused element
            if (EnableScreenReader) {
                screenReaderObject.readingAnElement(this.currentlyFocusedElement);
            }
        },

        navigate: function(direction) {
            const focusableElements = this.parseFocusableElems();
            const currentIndex = focusableElements.indexOf(this.currentlyFocusedElement);
            let nextIndex;

            if (direction === 'previous') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            } else {
                nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            }

            this.currentElement(focusableElements[nextIndex]);
        },


        activateCurrElem: function() {
            if (this.currentlyFocusedElement && typeof this.currentlyFocusedElement.click === 'function') {
                this.currentlyFocusedElement.click();
            }
        },


        closeCurrElem: function() {
            const focusedElement = this.currentlyFocusedElement;

            if (focusedElement && focusedElement.classList.contains('modal')) {
                focusedElement.style.display = 'none';
            }
        },
    };

    // Voice Input Logic
    const voiceCommandObject = {

        // state variables
        voiceRecognition: null,
        isCurrentlyListening: false,



        init: function() {

            // handle the case where the browser does not support speech recognition api 
            if (!isSpeechRecognitionSupported) 
            {
                console.warn("Error: Voice recognition is not fully supported in the current browser.");
                return;
            }


            // voice settings --> default settings ::: potentially modify these future feat
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = document.documentElement.lang || 'en-US';
            this.voiceRecognition.onresult = this.voiceInputCommand.bind(this);


            // error 
            this.voiceRecognition.onerror = function(event) {
                console.error('Voice Recognition Error: ', event.error);
            };

            
            // update on our toolbar that voice input is being listened to. 
            this.voiceRecognition.onstart = () => {
                this.isListening = true;
                this.updateCurrentVoiceInputIndicatorStatus(true);
            };



            // stop listening 
            this.voiceRecognition.onend = () => {

                this.isListening = false;
                this.updateCurrentVoiceInputIndicatorStatus(false);

                // Automatically restart recognition if still enabled
                if (EnableVoiceInput) {
                    this.startListening();
                }
            };
        },


        // start listenign for input 
        startListening: function() {

            if (EnableVoiceInput && isSpeechRecognitionSupported && this.voiceRecognition && !this.isCurrentlyListening) 
            {
                // first try to begin voice recognition if not throw error
                try 
                {
                    this.voiceRecognition.start();
                } catch (error) 
                {
                    console.error("Voice Recognition Start Error: ", error);
                }
            }
        },



        // stop taking voice input
        stopListening: function()
         {
            // stop taking voice input
            if (this.voiceRecognition && this.isCurrentlyListening) {
                this.voiceRecognition.stop();
            }
        },



        voiceInputCommand: function(event) {
            // get the voice input from the user and extract it. 
            const voiceRecognitionInput = event.results;
            const EventTranscript = voiceRecognitionInput[voiceRecognitionInput.length - 1][0].transcript.trim().toLowerCase();

            // voice input command from user --> feedback of voice recognition input 
            console.log('Voice Input:', EventTranscript); 
            

            // based on our feedback from the voice input we can call the correct function 
            if (EventTranscript.includes('scroll down')) 
            {
                window.scrollBy(0, 175);
            } else if (EventTranscript.includes('scroll up')) 
            {
                window.scrollBy(0, -175);
            } else if (EventTranscript.includes('read website')) 
            {
                screenReaderObject.readWebsite();
            } else if (EventTranscript.includes('stop reading')) 
            {
                screenReaderObject.stopReadingWebsite();
            } else if (EventTranscript.includes('increase font size')) 
            {
                adjustFontSizeObject.increaseFontSize();
            } else if (EventTranscript.includes('decrease font size')) 
            {
                adjustFontSizeObject.decreaseFontSize();
            } else if (EventTranscript.includes('increase spacing')) 
            {
                adjustSpacingObject.increaseSpacing();
            } else if (EventTranscript.includes('decrease spacing')) 
            {
                adjustSpacingObject.decreaseSpacing();
            } else if (EventTranscript.includes('toggle dyslexia font')) 
            {
                OpenDyslexiaFontObject.toggleDyslexicFontMode();
            } else if (EventTranscript.includes('enable keyboard navigation')) 
            {
                if (!EnableKeyboardNavigation) {
                    EnableKeyboardNavigation = true;
                    keyboardNavigationObject.init();
                    localStorage.setItem('keyboard-navigation', 'true');
                }

            } else if (EventTranscript.includes('disable keyboard navigation')) 
            {
                if (EnableKeyboardNavigation) {
                    EnableKeyboardNavigation = false;
                    keyboardNavigationObject.disable();
                    localStorage.setItem('keyboard-navigation', 'false');
                }

            } else if (EventTranscript.includes('activate element') || EventTranscript.includes('enter element')) 
            {
                keyboardNavigationObject.activateCurrElem();
            } else if (EventTranscript.includes('next')) 
            {
                keyboardNavigationObject.navigate('next');
            } else if (EventTranscript.includes('previous')) 
            {
                keyboardNavigationObject.navigate('previous');
            } else if (EventTranscript.includes('set color mode to')) 
            {
                const colorModes = ['default', 'protanopia', 'deuteranopia', 'tritanopia', 'high contrast'];
                for (let mode of colorModes) {
                    if (EventTranscript.includes(mode)) {
                        const className = mode.replace(' ', '-');
                        colorModeObject.setColorBlindnessMode(className);
                        break;
                    }
                }
            }
        },



        // function that updates our toolbar voice input status 
        updateCurrentVoiceInputIndicatorStatus: function(isListening) 
        {
            // get the current status --> are we taking input or not ?
            const currentVoiceInputState = document.getElementById('voice-input-status');
            // we can update this status on our toolbar 
            if (currentVoiceInputState) 
            {
                currentVoiceInputState.textContent = isListening ? 'Listening...' : 'Voice Input OFF';
            }
        }

        
    };




    // Adjust foint size function 
    const adjustFontSizeObject = {


        // increase funct: increased size by 10% --> max size if 150
        increaseFontSize: function() {

            fontSize += 10;
            // check to see if the font size has reached our limit
            if (fontSize > 150) fontSize = 150;

            // apply our changes to the website 
            document.body.style.fontSize = fontSize + '%';
            localStorage.setItem('adjust-text-size', fontSize);
        },


        // decrease ffont size --> decreased by 10% --> max is 80
        decreaseFontSize: function() {

            fontSize -= 10;
            if (fontSize < 80) fontSize = 80;


            // apply
            document.body.style.fontSize = fontSize + '%';
            localStorage.setItem('adjust-text-size', fontSize);
        },


        // load the font size so that we cann see the changes
        loadFontSize: function() {

            // loading 
            const savedFontSize = localStorage.getItem('adjust-text-size');
            fontSize = savedFontSize ? parseInt(savedFontSize, 10) : 100;
            document.body.style.fontSize = fontSize + '%';
        }
    };




    // Adjust Spacing Logic fuicntion : increase the letter spacing and line height together 
    const adjustSpacingObject = {

        increaseSpacing: function() {

            // increase
            letterSpac+=0.5;
            lineHeight += 0.1;


            // appliyng
            document.body.style.letterSpacing = letterSpac + 'px';
            document.body.style.lineHeight = lineHeight;


            // setting it to our website
            localStorage.setItem('adjust-letter-spacing', letterSpac);
            localStorage.setItem('adjust-line-spacing', lineHeight);

        }, 



        decreaseSpacing: function() {
            // decerqse : checking to see if the decrease amount does not go below 0 & 1.0
            letterSpac = Math.max(0, letterSpac - 0.5);
            lineHeight = Math.max(1.0, lineHeight - 0.1);
            

            // applying
            document.body.style.letterSpacing = letterSpac + 'px';
            document.body.style.lineHeight = lineHeight;


            // setting
            localStorage.setItem('adjust-letter-spacing', letterSpac);
            localStorage.setItem('adjust-line-spacing', lineHeight);

        }, 



        // load in 
        loadSpacing: function() {

            // get the current state
            const savedLetter = localStorage.getItem('adjust-letter-spacing');
            const savedHeight = localStorage.getItem('adjust-line-spacing');
            
            // apppoying 
            if(savedLetter) 
            {
                letterSpac = parseFloat(savedLetter);
                document.body.style.letterSpacing = letterSpac;
            }

            if(savedHeight) 
            {
                lineHeight = parseFloat(savedHeight);
                document.body.style.lineHeight  = lineHeight;
            }
        }

    }; 



    // Open Dyslexia Font object 
    const OpenDyslexiaFontObject = {


        // toggling fucniton : will toggle the button on our toolabr 
        toggleDyslexicFontMode: function() 
        {
            // if toggle we will do the inverse of the current state it is in
            EnableOpenDyslexiaFont = !EnableOpenDyslexiaFont;


            if (EnableOpenDyslexiaFont) 
            {
                // applying if enabled
                document.body.classList.add('accessibility-dyslexia-fonts');
                localStorage.setItem('Open-Dyslexia-Font', 'true');
                console.log('OpenDyslexic font enabled.');


            } else 
            {
                // settign to not be enabled
                document.body.classList.remove('accessibility-dyslexia-fonts');
                localStorage.setItem('Open-Dyslexia-Font', 'false');
                console.log('OpenDyslexic font disabled.');
            }
        },


        // load the font on website 
        loadDyslexiaFontMode: function() {
            // get current state 
            const currFont = localStorage.getItem('Open-Dyslexia-Font') === 'true';
            EnableOpenDyslexiaFont = currFont;

            // apply
            if (EnableOpenDyslexiaFont) {
                document.body.classList.add('accessibility-dyslexia-fonts');
                console.log('OpenDyslexic font loaded from localStorage.');
            }
        }
    };

    // Color Mode Logic
    const colorModeObject = {


        setColorBlindnessMode: function(mode) {

            // set to default 
            document.body.classList.remove(
                'color-mode-tritanopia',
                'color-mode-high-contrast',
                'color-mode-protanopia',
                'color-mode-deuteranopia',
                'color-mode-default'
            );

            
            // set the color mode if it not default 
            if (mode !== 'default') 
            {
                document.body.classList.add(`color-mode-${mode}`);
            }

            // save the current color mode --> this will save for user 
            localStorage.setItem('color-mode', mode);
        },

        loadCurrColorMode: function() {

            const savedColorBlindnessMode = localStorage.getItem('color-mode') || 'default';
            this.setColorBlindnessMode(savedColorBlindnessMode);

            const selectColorBlindnessMode = document.getElementById('color-mode-select');
            if (selectColorBlindnessMode) 
            {
                selectColorBlindnessMode.value = savedColorBlindnessMode;
            }
        }
    };


    // DOMs for our method --> this is how we will load our method 
    document.addEventListener('DOMContentLoaded', function() {


        // load in the current setting --> this should be default until changed; when changed they will get loaded in
        adjustFontSizeObject.loadFontSize();
        adjustSpacingObject.loadSpacing();
        OpenDyslexiaFontObject.loadDyslexiaFontMode();
        colorModeObject.loadCurrColorMode();



        // Keyboard Navigation Toggle
        const keyboardNavigationToggler = document.getElementById('keyboard-navigation-toggle');
        if (keyboardNavigationToggler) {
            keyboardNavigationToggler.addEventListener('click', function() 
            {
                // enable
                EnableKeyboardNavigation = !EnableKeyboardNavigation;

                // enabled --> apply and update toolbar
                if (EnableKeyboardNavigation) 
                {
                    keyboardNavigationObject.init();
                    this.textContent = 'Keyboard Navigation ON';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('keyboard-navigation', 'true');
                    
                } else { // not enable update toolbar and turn off 
                    keyboardNavigationObject.disable();
                    this.textContent = 'Keyboard Navigation OFF';
                    this.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('keyboard-navigation', 'false');
                }
            });


            const savedcurrentKeyboardMode = localStorage.getItem('keyboard-navigation') === 'true';
            EnableKeyboardNavigation = savedcurrentKeyboardMode;
            if (EnableKeyboardNavigation) {
                keyboardNavigationObject.init();
            }


            keyboardNavigationToggler.textContent = EnableKeyboardNavigation ? 'Keyboard Navigation ON' : 'Keyboard Navigation OFF';
            keyboardNavigationToggler.setAttribute('aria-pressed', EnableKeyboardNavigation.toString());

        }

        // Screen Reader Toggle
        const screenReaderToggler = document.getElementById('screen-reader-toggle');
        if (screenReaderToggler) {
            screenReaderToggler.addEventListener('click', function() {

                EnableScreenReader = !EnableScreenReader;

                if (EnableScreenReader) 
                {
                    this.textContent = 'Screen Reader ON';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('screen-reader', 'true');
                    // Start reading if keyboard navigation is active
                    if (EnableKeyboardNavigation && keyboardNavigationObject.currentlyFocusedElement) {
                        screenReaderObject.readingAnElement(keyboardNavigationObject.currentlyFocusedElement);
                    } else {
                        screenReaderObject.readWebsite();
                    }
                } else {
                    screenReaderObject.stopReadingWebsite();
                    this.textContent = 'Screen Reader OFF';
                    this.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('screen-reader', 'false');
                }
            });



            const screenReaderState = localStorage.getItem('screen-reader') === 'true';
            EnableScreenReader = screenReaderState;


            screenReaderToggler.textContent = EnableScreenReader ? 'Screen Reader ON' : 'Screen Reader OFF';
            screenReaderToggler.setAttribute('aria-pressed', EnableScreenReader.toString());
        }


        // Voice Input Toggle
        const voiceInputToggler = document.getElementById('voice-input-toggle');
        if (voiceInputToggler) {
            voiceInputToggler.addEventListener('click', function() {


                EnableVoiceInput = !EnableVoiceInput;
                
                if (EnableVoiceInput) 
                {
                    voiceCommandObject.init();
                    voiceCommandObject.startListening();
                    this.textContent = 'Voice Input ON';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('voice-input', 'true');
                } else {
                    voiceCommandObject.stopListening();
                    this.textContent = 'Voice Input OFF';
                    this.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('voice-input', 'false');
                }
            });


            const voiceInputState = localStorage.getItem('voice-input') === 'true';
            EnableVoiceInput = voiceInputState;
            if (EnableVoiceInput) {
                voiceCommandObject.init();
                voiceCommandObject.startListening();
            }


            voiceInputToggler.textContent = EnableVoiceInput ? 'Voice Input ON' : 'Voice Input OFF';
            voiceInputToggler.setAttribute('aria-pressed', EnableVoiceInput.toString());
        }

        

        const colorModeSelecter = document.getElementById('color-mode-select');
        if (colorModeSelecter) {
            colorModeSelecter.addEventListener('change', function() {
                colorModeObject.setColorBlindnessMode(this.value);
            });
        }



        const increaseFontSizeButton = document.getElementById('increase-text-size');
        if (increaseFontSizeButton) {
            increaseFontSizeButton.addEventListener('click', function() {
                adjustFontSizeObject.increaseFontSize();
            });
        }


        const decreaseFontSizeButton = document.getElementById('decrease-text-size');
        if (decreaseFontSizeButton) {
            decreaseFontSizeButton.addEventListener('click', function() {
                adjustFontSizeObject.decreaseFontSize();
            });
        }


        // Spacing Toggles
        const increaseSpacingButton = document.getElementById('increase-spacing');
        if (increaseSpacingButton) {
            increaseSpacingButton.addEventListener('click', function() {
                adjustSpacingObject.increaseSpacing();
            });
        }


        const decreaseSpacingButton = document.getElementById('decrease-spacing');
        if (decreaseSpacingButton) {
            decreaseSpacingButton.addEventListener('click', function() {
                adjustSpacingObject.decreaseSpacing();
            });
        }


        // Dyslexia Font Toggle
        const dyslexiaFontToggler = document.getElementById('dyslexia-font-toggle');
        if (dyslexiaFontToggler) {
            dyslexiaFontToggler.addEventListener('click', function() {
                OpenDyslexiaFontObject.toggleDyslexicFontMode();
                this.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
                this.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
            });
    
            // Load saved state
            OpenDyslexiaFontObject.loadDyslexiaFontMode();
    
            dyslexiaFontToggler.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
            dyslexiaFontToggler.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
        }
    });
})(); // end of IIFE
