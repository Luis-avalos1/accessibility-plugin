

# Accessibility Plug-In Logic 

### Breakdown 

We are creating a screen reader that should allow an individual with sight impairments to be able to navigate a website via the screen reader. 

**********

### Plug-in Breakdown 

The code logic of the screen reader will be written in JavaScript. This JavaScript file will be hooked up to a PHP file that will enqueu the JS file to the website (WordPress). Additionally, with JS we have the capability to potentially create an interface utililzing CSS/other frameworks. 

### JavaScript Screen Reader

Utilizing Web Speech API. 

Web Speech API is composed of two parts. 
**(i): SpeechSynthesis: Text-to-Speech. We can utilize this to parse a website and produce a speech output.**
**(ii): SpeechRecognition: Speech Recognition. We can utilize this to make a user be able to navigate a websiter via speech. This would require us to alter the existing Lasagna Love to make it compatible for this API.**



