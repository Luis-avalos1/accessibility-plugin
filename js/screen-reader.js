    
    // [LIST OF WHAT NEEDS TO BE DONE] ---> more below in code.
    
    // TODO: need a func that stops the read, we cant read all website at once
    // TODO: implement keyboard navigation
    // TODO: implement voice nav , need a function to stopp gettng input
    // TODO: handling errors
    // TODO: FEATURE: color mode funct for color blindness
    // TODO: FEATURES : adjusting text size , line spacing, dyslexia friendly font
    // TODO: --> animation for pausing  POTENTIALLY
    // TODO: event listeners
        // TODO: toggling screen reader 
        // TODO: toggle key board nav 
        // TODO: toggel voice nav
        // TODO: toggel color mode 
        // TODO: font size, line spacing, dyslexia font , animatations

    // TODO: Im sure there is more func and stuff I havent thought of --> add what you think what else needs to be done 
    
// screen reader logic 

// IIFE function, so we can reduce global scope pollution
(function(){

    // current state variable --> is feature: enabled or disabled?
    let EnableKeyboardNav =     false;
    let EnableVoiceInput =      false;
    let EnableScreenReader =    false;
    let EnableDyslexiaFont =    false;
    let EnableAnimatiosPause =  false;

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
            

            // if we still have content, we will try and get it from body
            // TODO: finsih code, that reads body of website if we cannot get main cont above\

            // CODE HERE, ---> NOT DONE
            // TODO: finish this --> way more to be added 
            
        }

        // TODO: more functions go below here!


    } // end of screen reader 



})

