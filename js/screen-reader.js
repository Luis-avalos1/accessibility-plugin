    
    // [LIST OF WHAT NEEDS TO BE DONE] ---> more below in code.
    // TODO: webspeech API broweser support --> there may be a few browsers that dont support this api, we may need to think of a work around this edge case.
    // TODO: need a func that stops the read, we cant read all website at once
    // TODO: implement keyboard navigation
    // TODO: implement voice nav -> requires audio input, need a function to stopp gettng audio input
    // TODO: handling errors --> this needs to be more thought out.
    // TODO: FEATURE: toolbar to navigate features --> could be done in PHP with CSS styling, this may be the easiest way. 
    // TODO: FEATURE: color mode funct for color blindness
    // TODO: FEATURES : adjusting text size , line spacing, dyslexia friendly font
    // TODO: --> animation for pausing  POTENTIAL FEATURE: 
    
    // TODO: event listeners [FEATURES]
        // TODO: toggling screen reader 
        // TODO: toggle key board nav 
        // TODO: toggel voice nav
        // TODO: toggel color mode 
        // TODO: font size
        // TODO: line spacing
        // TODO: dyslexia font 
        // TODO: animatations

    // TODO: Im sure there is more func and stuff I havent thought of --> add what you think what else needs to be done 
    
    // other docs -- more detail located within their respected files!
    // TODO: CSS stlyes page 
    // TODO: php enque script 
    // TODO: php template for toolbar --> located in templates directory 

// screen reader logic 
// IIFE function, so we can reduce global scope pollution
(function(){

    'use strict';

    // current state variable --> is feature: enabled or disabled?
    let EnableKeyboardNav =     false;
    let EnableVoiceInput =      false;
    let EnableScreenReader =    false;
    let EnableOpenDyslexiaFont =false;
    let EnableAnimatiosPause =  false;

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
            document.querySelector('#content')
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

        // initializer funciton 
        init: function(){
            // TODO: finish this, --> needs research! 
            document.addEventListener('keydown', FINISHMEEEE)
        }
    };

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
                
        }, 

        start: function(){
            if(EnableVoiceInput && speechRecognitionSuppot && this.voiceRecognition){
                // TODO: FINISH LOGIC --> Needs to be more thought out, so many edge cases to consider
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

        }





    }; // end of voice input obk 

    const adjustTextSize = {

        // TODO: TEST THIS CODE, finished as of now --> but we will see after testing if any revision are needed. 
        increase: function() {
            fontSize+= 10;

            // check if font, hasnt and will not exceed our limit font size 
            if(fontSize > 200){
                fontSize = 200;
            }
            // set font size 
            document.documentElement.style.fontSize = fontSize + '%';
            localStorage.setItem("change-font-size", fontSize);
        },

        // decreas font size function 
        decrease: function() {
            // limiting the amount we can decrease the font
            fontSize = Math.max(40, fontSize - 10);
            document.documentElement.style.fontSize = fontSize + '%';
            localStorage.setItem("change-font-size", fontSize);

        }, 

        // load font size 
        loadFontSize: function() {
            // we want a field that wil save the current font size that will get displayed
            const savedFontSize = localStorage.getItem("change-font-size");

            if(savedFontSize){
                fontSize = parseInt(savedFontSize, 10);
                document.documentElement.style.fontSize = fontSize + '%';
            }
        }
    }; // end of adjust text size 

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

    // dyslexia font 
    const OpenDyslexiaFont = {

        toggle: function() {
            // enable O.D font --> inverse, since set to false;
            EnableOpenDyslexiaFont = !EnableOpenDyslexiaFont;

            if(EnableOpenDyslexiaFont){
                document.body.classList.add("Open-Dyslexia-Font");
                localStorage.setItem("Open-Dyslexia-Font", 'true');
            }else {
                document.body.classList.remove("Open-Dyslexia-Font");
                localStorage.setItem("Open-Dyslexia-Font", 'false');
            }
        }, 

        // load font 
        

    }



}) // end of function

