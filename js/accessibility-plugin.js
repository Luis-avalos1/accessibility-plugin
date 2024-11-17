
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
    const screenReader = {

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
        readAnElement: function(element) {
            // works by checking html semantics --> has fallback methods 
            const textToRead = element.getAttribute('aria-label') || element.alt || element.title || element.textContent || element.innerText || '';
            // read what we have extracted
            this.tts(textToRead);
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
        stopReading: function() {
            if (this.synth.speaking) {
                this.synth.cancel();
            }
        }
    };

    // method that ensures the screen reader will not continue reading if we navigate to another page on the site
    window.addEventListener('beforeunload', function() {
        screenReader.stopReading();
    });



    // keyboard nav logic
    const keyboardNavigation = {
        currentFocusedElement: null,
        previousFocusedElement: null,
        boundHandleKeyDown: null,

        init: function() {
            this.boundHandleKeyDown = this.handleKeyDown.bind(this);
            document.addEventListener('keydown', this.boundHandleKeyDown);
            // Add initial focus to the first focusable element
            const focusableElements = this.getFocusableElements();
            if (focusableElements.length > 0) {
                this.focusElement(focusableElements[0]);
            }
        },

        destroy: function() {
            document.removeEventListener('keydown', this.boundHandleKeyDown);
            if (this.currentFocusedElement) {
                this.currentFocusedElement.classList.remove('keyboard-focused');
            }
            this.currentFocusedElement = null;
            this.previousFocusedElement = null;
        },

        handleKeyDown: function(event) {
            // Prevent default scrolling behavior for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    this.navigate('previous');
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
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

        getFocusableElements: function() {
            return Array.from(document.querySelectorAll(
                'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
            )).filter(el => el.offsetParent !== null);
        },

        focusElement: function(element) {
            if (this.currentFocusedElement) {
                this.currentFocusedElement.classList.remove('keyboard-focused');
            }
            this.previousFocusedElement = this.currentFocusedElement;
            this.currentFocusedElement = element;
            this.currentFocusedElement.focus();
            this.currentFocusedElement.classList.add('keyboard-focused');

            // Scroll element into view
            this.currentFocusedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Screen reader reads the focused element
            if (EnableScreenReader) {
                screenReader.readAnElement(this.currentFocusedElement);
            }
        },

        navigate: function(direction) {
            const focusableElements = this.getFocusableElements();
            const currentIndex = focusableElements.indexOf(this.currentFocusedElement);
            let nextIndex;

            if (direction === 'previous') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            } else {
                nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            }

            this.focusElement(focusableElements[nextIndex]);
        },

        activateCurrentElement: function() {
            if (this.currentFocusedElement && typeof this.currentFocusedElement.click === 'function') {
                this.currentFocusedElement.click();
            }
        },

        closeFocusedElement: function() {
            const focusedElement = this.currentFocusedElement;

            if (focusedElement && focusedElement.classList.contains('modal')) {
                focusedElement.style.display = 'none';
            }
        },
    };

    // Voice Input Logic
    const voiceCommandObject = {

        // 
        voiceRecognition: null,

        isCurrentlyListening: false,

        init: function() {


            if (!isSpeechRecognitionSupported) {
                console.warn("Error: Voice recognition is not supported on your current browser.");
                return;
            }


            // voice settings 
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = document.documentElement.lang || 'en-US';
            this.voiceRecognition.onresult = this.voiceInputCommand.bind(this);

            this.voiceRecognition.onerror = function(event) {

                console.error('Voice Recognition Error: ', event.error);
            };

            
            this.voiceRecognition.onstart = () => {

                this.isListening = true;
                this.updateVoiceInputIndicatorStatus(true);
            };



            this.voiceRecognition.onend = () => {

                this.isListening = false;
                this.updateVoiceInputIndicatorStatus(false);

                // Automatically restart recognition if still enabled
                if (EnableVoiceInput) {
                    this.start();
                }
            };
        },

        start: function() {

            if (EnableVoiceInput && isSpeechRecognitionSupported && this.voiceRecognition && !this.isCurrentlyListening) {
                try {
                    this.voiceRecognition.start();
                } catch (error) {
                    console.error("Voice Recognition Start Error: ", error);
                }
            }
        },

        stop: function() {

            if (this.voiceRecognition && this.isCurrentlyListening) {
                this.voiceRecognition.stop();
            }
        },

        voiceInputCommand: function(event) {


            const resultFromEvent = event.results;
            const transcript = resultFromEvent[resultFromEvent.length - 1][0].transcript.trim().toLowerCase();

            console.log('Voice Input:', transcript); // Feedback of recognized speech

            if (transcript.includes('scroll down')) {
                window.scrollBy(0, 150);
            } else if (transcript.includes('scroll up')) {
                window.scrollBy(0, -150);
            } else if (transcript.includes('read website')) {
                screenReader.readWebsite();
            } else if (transcript.includes('stop reading')) {
                screenReader.stopReading();
            } else if (transcript.includes('increase font size')) {
                adjustTextSize.increase();
            } else if (transcript.includes('decrease font size')) {
                adjustTextSize.decrease();
            } else if (transcript.includes('increase spacing')) {
                adjustSpacing.increase();
            } else if (transcript.includes('decrease spacing')) {
                adjustSpacing.decrease();
            } else if (transcript.includes('toggle dyslexia font')) {
                OpenDyslexiaFont.toggle();
            } else if (transcript.includes('enable keyboard navigation')) {
                if (!EnableKeyboardNavigation) {
                    EnableKeyboardNavigation = true;
                    keyboardNavigation.init();
                    localStorage.setItem('keyboard-navigation', 'true');
                }
            } else if (transcript.includes('disable keyboard navigation')) {
                if (EnableKeyboardNavigation) {
                    EnableKeyboardNavigation = false;
                    keyboardNavigation.destroy();
                    localStorage.setItem('keyboard-navigation', 'false');
                }
            } else if (transcript.includes('activate element') || transcript.includes('enter element')) {
                keyboardNavigation.activateCurrentElement();
            } else if (transcript.includes('next element')) {
                keyboardNavigation.navigate('next');
            } else if (transcript.includes('previous element')) {
                keyboardNavigation.navigate('previous');
            } else if (transcript.includes('set color mode to')) {
                const modes = ['default', 'protanopia', 'deuteranopia', 'tritanopia', 'high contrast'];
                for (let mode of modes) {
                    if (transcript.includes(mode)) {
                        const className = mode.replace(' ', '-');
                        colorMode.setColorMode(className);
                        break;
                    }
                }
            }
        },

        updateVoiceInputIndicatorStatus: function(isListening) {

            
            const voiceInputStatus = document.getElementById('voice-input-status');
            if (voiceInputStatus) {
                voiceInputStatus.textContent = isListening ? 'Listening...' : 'Voice Input OFF';
            }
        }
    };

    // Adjust foint size
    const adjustTextSize = {


        increase: function() {

            fontSize += 10;
            if (fontSize > 150) fontSize = 150;
            document.body.style.fontSize = fontSize + '%';
            localStorage.setItem('adjust-text-size', fontSize);
        },

        decrease: function() {

            fontSize -= 10;
            if (fontSize < 80) fontSize = 80;
            document.body.style.fontSize = fontSize + '%';
            localStorage.setItem('adjust-text-size', fontSize);
        },

        loadFontSize: function() {
            const savedFontSize = localStorage.getItem('adjust-text-size');
            fontSize = savedFontSize ? parseInt(savedFontSize, 10) : 100;
            document.body.style.fontSize = fontSize + '%';
        }
    };

    // Adjust Spacing Logic
    const adjustSpacing = {

        increase: function() {


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

    // Open Dyslexia Font Logic
    const OpenDyslexiaFont = {


        toggle: function() {
            EnableOpenDyslexiaFont = !EnableOpenDyslexiaFont;

            if (EnableOpenDyslexiaFont) {

                document.body.classList.add('accessibility-dyslexia-fonts');
                localStorage.setItem('Open-Dyslexia-Font', 'true');
                console.log('OpenDyslexic font enabled.');
            } else {

                document.body.classList.remove('accessibility-dyslexia-fonts');
                localStorage.setItem('Open-Dyslexia-Font', 'false');
                console.log('OpenDyslexic font disabled.');
            }
        },

        loadDyslexiaFont: function() {

            const savedFont = localStorage.getItem('Open-Dyslexia-Font') === 'true';
            EnableOpenDyslexiaFont = savedFont;

            if (EnableOpenDyslexiaFont) {
                document.body.classList.add('accessibility-dyslexia-fonts');
                console.log('OpenDyslexic font loaded from localStorage.');
            }
        }
    };

    // Color Mode Logic
    const colorMode = {


        setColorMode: function(mode) {

            document.body.classList.remove(
                'color-mode-tritanopia',
                'color-mode-high-contrast',
                'color-mode-protanopia',
                'color-mode-deuteranopia',
                'color-mode-default'
            );

            if (mode !== 'default') {
                document.body.classList.add(`color-mode-${mode}`);
            }

            localStorage.setItem('color-mode', mode);
        },

        loadColorMode: function() {

            const savedColorMode = localStorage.getItem('color-mode') || 'default';
            this.setColorMode(savedColorMode);

            const selectColorMode = document.getElementById('color-mode-select');
            if (selectColorMode) {
                selectColorMode.value = savedColorMode;
            }
        }
    };

    // Event Listeners for Toggling Features
    document.addEventListener('DOMContentLoaded', function() {


        // load in current settings
        adjustTextSize.loadFontSize();
        adjustSpacing.loadSpacing();
        OpenDyslexiaFont.loadDyslexiaFont();
        colorMode.loadColorMode();

        // Keyboard Navigation Toggle
        const keyboardNavigationToggler = document.getElementById('keyboard-navigation-toggle');
        if (keyboardNavigationToggler) {
            keyboardNavigationToggler.addEventListener('click', function() {
                EnableKeyboardNavigation = !EnableKeyboardNavigation;
                if (EnableKeyboardNavigation) {
                    keyboardNavigation.init();
                    this.textContent = 'Keyboard Navigation ON';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('keyboard-navigation', 'true');
                } else {
                    keyboardNavigation.destroy();
                    this.textContent = 'Keyboard Navigation OFF';
                    this.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('keyboard-navigation', 'false');
                }
            });


            const savedKeyboardMode = localStorage.getItem('keyboard-navigation') === 'true';
            EnableKeyboardNavigation = savedKeyboardMode;
            if (EnableKeyboardNavigation) {
                keyboardNavigation.init();
            }

            keyboardNavigationToggler.textContent = EnableKeyboardNavigation ? 'Keyboard Navigation ON' : 'Keyboard Navigation OFF';
            keyboardNavigationToggler.setAttribute('aria-pressed', EnableKeyboardNavigation.toString());
        }

        // Screen Reader Toggle
        const screenReaderToggler = document.getElementById('screen-reader-toggle');
        if (screenReaderToggler) {
            screenReaderToggler.addEventListener('click', function() {
                EnableScreenReader = !EnableScreenReader;
                if (EnableScreenReader) {
                    this.textContent = 'Screen Reader ON';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('screen-reader', 'true');
                    // Start reading if keyboard navigation is active
                    if (EnableKeyboardNavigation && keyboardNavigation.currentFocusedElement) {
                        screenReader.readAnElement(keyboardNavigation.currentFocusedElement);
                    } else {
                        screenReader.readWebsite();
                    }
                } else {
                    screenReader.stopReading();
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
                if (EnableVoiceInput) {
                    voiceCommandObject.init();
                    voiceCommandObject.start();
                    this.textContent = 'Voice Input ON';
                    this.setAttribute('aria-pressed', 'true');
                    localStorage.setItem('voice-input', 'true');
                } else {
                    voiceCommandObject.stop();
                    this.textContent = 'Voice Input OFF';
                    this.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('voice-input', 'false');
                }
            });

            const voiceInputState = localStorage.getItem('voice-input') === 'true';
            EnableVoiceInput = voiceInputState;
            if (EnableVoiceInput) {
                voiceCommandObject.init();
                voiceCommandObject.start();
            }

            voiceInputToggler.textContent = EnableVoiceInput ? 'Voice Input ON' : 'Voice Input OFF';
            voiceInputToggler.setAttribute('aria-pressed', EnableVoiceInput.toString());
        }

        
        const colorModeSelecter = document.getElementById('color-mode-select');
        if (colorModeSelecter) {
            colorModeSelecter.addEventListener('change', function() {
                colorMode.setColorMode(this.value);
            });
        }


        const increaseFontSizeButton = document.getElementById('increase-text-size');
        if (increaseFontSizeButton) {
            increaseFontSizeButton.addEventListener('click', function() {
                adjustTextSize.increase();
            });
        }

        const decreaseFontSizeButton = document.getElementById('decrease-text-size');
        if (decreaseFontSizeButton) {
            decreaseFontSizeButton.addEventListener('click', function() {
                adjustTextSize.decrease();
            });
        }

        // Spacing Toggles
        const increaseSpacingButton = document.getElementById('increase-spacing');
        if (increaseSpacingButton) {
            increaseSpacingButton.addEventListener('click', function() {
                adjustSpacing.increase();
            });
        }

        const decreaseSpacingButton = document.getElementById('decrease-spacing');
        if (decreaseSpacingButton) {
            decreaseSpacingButton.addEventListener('click', function() {
                adjustSpacing.decrease();
            });
        }

        // Dyslexia Font Toggle
        const dyslexiaFontToggler = document.getElementById('dyslexia-font-toggle');
        if (dyslexiaFontToggler) {
            dyslexiaFontToggler.addEventListener('click', function() {
                OpenDyslexiaFont.toggle();
                this.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
                this.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
            });
    
            // Load saved state
            OpenDyslexiaFont.loadDyslexiaFont();
    
            dyslexiaFontToggler.textContent = EnableOpenDyslexiaFont ? 'Dyslexia Font (On)' : 'Dyslexia Font';
            dyslexiaFontToggler.setAttribute('aria-pressed', EnableOpenDyslexiaFont.toString());
        }
    });
})(); // end of IIFE
