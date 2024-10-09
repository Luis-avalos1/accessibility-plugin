

# Accessibility Plug-In Logic 

### Breakdown 

We are creating a screen reader that should allow an individual with sight impairments to be able to navigate a website via the screen reader. 

**********

## Plug-in Breakdown 

The code logic of the screen reader will be written in JavaScript. This JavaScript file will be hooked up to a PHP file that will enqueu the JS file to the website (WordPress). Additionally, with JS we have the capability to potentially create an interface utililzing CSS/other frameworks. 

### JavaScript Screen Reader

Utilizing Web Speech API to implement Screen Reader.

*WebSpeech API*: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API


Web Speech API is composed of two parts.

**(i): SpeechSynthesis: Text-to-Speech. We can utilize this to parse a website and produce a speech output.**\
**(ii): SpeechRecognition: Speech Recognition. We can utilize this to make a user be able to navigate a websiter via speech. This would require us to alter the existing Lasagna Love to make it compatible for this API.**

### SpeechRecongnition 


### Plug-in Architecture 

accessible-web-enhancements/

│
├── accessible-web-enhancements.php     # Main plugin file with initialization code

│
├── css/                                # Stylesheet directory

│   └── awe-styles.css                  # Main CSS file with styles for 
the toolbar and features

│
├── js/                                 # JavaScript directory

│   └── awe-scripts.js                  # Main JS file with all the 
accessibility features

│
├── templates/                          # Templates directory

│   └── toolbar.php                     # HTML template for the 
accessibility toolbar

│
└── README.txt                          # Optional documentation file



### Licensing 

OpenDyslexic font used under the SIL Open Font License (OFL).

OpenDyslexic by Abelardo Gonzalez
Website: https://opendyslexic.org/
License: https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL_web
