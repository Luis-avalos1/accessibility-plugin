// Accessibility Plugin Bookmarklet - Works on any website
(function() {
    // Check if already loaded
    if (document.getElementById('accessibility-toolbar-injected')) {
        return;
    }

    // Inject CSS
    const css = `
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/OpenDyslexic-Regular.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
        }
        
        body.accessibility-dyslexia-fonts * {
            font-family: 'OpenDyslexic' !important;
        }
        
        #accessibility-toolbar-injected {
            position: fixed !important;
            bottom: 25px !important;
            right: 25px !important;
            background-color: rgba(255, 255, 255, 0.98) !important;
            border-radius: 10px !important;
            padding: 20px !important;
            z-index: 999999 !important;
            box-shadow: 0 4px 15px rgba(0,0,0, 0.3) !important;
            width: 280px !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
            border: 2px solid #0066cc !important;
        }
        
        .acc-button {
            background-color: #0066cc !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            margin: 6px 0 !important;
            padding: 10px 15px !important;
            font-size: 14px !important;
            width: 100% !important;
            cursor: pointer !important;
            font-family: Arial, sans-serif !important;
        }
        
        .acc-button:hover {
            background-color: #0052a3 !important;
        }
        
        .acc-button.active {
            background-color: #28a745 !important;
        }
        
        .keyboard-focused {
            outline: 3px solid red !important;
            outline-offset: 2px !important;
        }
        
        body.color-mode-high-contrast {
            background-color: #000000 !important;
            color: #FFFFFF !important;
        }
        
        body.color-mode-high-contrast * {
            background-color: #000000 !important;
            color: #FFFFFF !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Inject HTML toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'accessibility-toolbar-injected';
    toolbar.innerHTML = `
        <h3 style="margin-top:0; color:#0066cc;">Accessibility Tools</h3>
        <button class="acc-button" id="acc-screen-reader">Screen Reader OFF</button>
        <button class="acc-button" id="acc-keyboard-nav">Keyboard Nav OFF</button>
        <button class="acc-button" id="acc-font-increase">Text Size +</button>
        <button class="acc-button" id="acc-font-decrease">Text Size -</button>
        <button class="acc-button" id="acc-spacing-increase">Spacing +</button>
        <button class="acc-button" id="acc-spacing-decrease">Spacing -</button>
        <button class="acc-button" id="acc-dyslexia-font">Dyslexia Font</button>
        <button class="acc-button" id="acc-high-contrast">High Contrast</button>
        <button class="acc-button" id="acc-close" style="background-color:#dc3545 !important;">Close</button>
    `;
    
    document.body.appendChild(toolbar);

    // Load the main accessibility script
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/luisavalos/accessibility-plugin/main/js/accessibility-plugin.js';
    script.onerror = function() {
        // Fallback: inject the script content directly
        loadAccessibilityScript();
    };
    document.head.appendChild(script);

    function loadAccessibilityScript() {
        // Insert your fixed accessibility-plugin.js content here
        // This is a simplified version that will work on any site
        
        let fontSize = 100;
        let letterSpacing = 0;
        let EnableKeyboardNavigation = false;
        let EnableScreenReader = false;
        let currentFocusedElement = null;
        let focusableElements = [];

        // Simple screen reader
        function speak(text) {
            if ('speechSynthesis' in window && EnableScreenReader) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
            }
        }

        // Keyboard navigation
        function initKeyboardNav() {
            if (EnableKeyboardNavigation) {
                document.addEventListener('keydown', handleKeyDown);
                updateFocusableElements();
                if (focusableElements.length > 0) {
                    setCurrentElement(focusableElements[0]);
                }
            } else {
                document.removeEventListener('keydown', handleKeyDown);
                if (currentFocusedElement) {
                    currentFocusedElement.classList.remove('keyboard-focused');
                    currentFocusedElement = null;
                }
            }
        }

        function handleKeyDown(event) {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(event.key)) {
                return;
            }
            
            event.preventDefault();
            
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    navigate('previous');
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    navigate('next');
                    break;
                case 'Enter':
                    if (currentFocusedElement) {
                        currentFocusedElement.click();
                    }
                    break;
            }
        }

        function updateFocusableElements() {
            focusableElements = Array.from(document.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(el => el.offsetParent !== null);
        }

        function setCurrentElement(element) {
            if (currentFocusedElement) {
                currentFocusedElement.classList.remove('keyboard-focused');
            }
            currentFocusedElement = element;
            if (element) {
                element.classList.add('keyboard-focused');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                if (EnableScreenReader) {
                    const text = element.textContent || element.getAttribute('aria-label') || element.alt || element.title || 'Interactive element';
                    speak(text);
                }
            }
        }

        function navigate(direction) {
            updateFocusableElements();
            if (focusableElements.length === 0) return;
            
            let currentIndex = focusableElements.indexOf(currentFocusedElement);
            if (currentIndex === -1) currentIndex = 0;
            
            let nextIndex;
            if (direction === 'previous') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            } else {
                nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            }
            
            setCurrentElement(focusableElements[nextIndex]);
        }

        // Event listeners
        document.getElementById('acc-screen-reader').addEventListener('click', function() {
            EnableScreenReader = !EnableScreenReader;
            this.textContent = EnableScreenReader ? 'Screen Reader ON' : 'Screen Reader OFF';
            this.classList.toggle('active', EnableScreenReader);
            
            if (EnableScreenReader) {
                speak('Screen reader enabled');
            }
        });

        document.getElementById('acc-keyboard-nav').addEventListener('click', function() {
            EnableKeyboardNavigation = !EnableKeyboardNavigation;
            this.textContent = EnableKeyboardNavigation ? 'Keyboard Nav ON' : 'Keyboard Nav OFF';
            this.classList.toggle('active', EnableKeyboardNavigation);
            
            initKeyboardNav();
            
            if (EnableScreenReader) {
                speak(EnableKeyboardNavigation ? 'Keyboard navigation enabled' : 'Keyboard navigation disabled');
            }
        });

        document.getElementById('acc-font-increase').addEventListener('click', function() {
            fontSize = Math.min(200, fontSize + 10);
            document.body.style.fontSize = fontSize + '%';
        });

        document.getElementById('acc-font-decrease').addEventListener('click', function() {
            fontSize = Math.max(80, fontSize - 10);
            document.body.style.fontSize = fontSize + '%';
        });

        document.getElementById('acc-spacing-increase').addEventListener('click', function() {
            letterSpacing += 0.5;
            document.body.style.letterSpacing = letterSpacing + 'px';
        });

        document.getElementById('acc-spacing-decrease').addEventListener('click', function() {
            letterSpacing = Math.max(0, letterSpacing - 0.5);
            document.body.style.letterSpacing = letterSpacing + 'px';
        });

        document.getElementById('acc-dyslexia-font').addEventListener('click', function() {
            document.body.classList.toggle('accessibility-dyslexia-fonts');
            const isActive = document.body.classList.contains('accessibility-dyslexia-fonts');
            this.textContent = isActive ? 'Dyslexia Font ON' : 'Dyslexia Font';
            this.classList.toggle('active', isActive);
        });

        document.getElementById('acc-high-contrast').addEventListener('click', function() {
            document.body.classList.toggle('color-mode-high-contrast');
            const isActive = document.body.classList.contains('color-mode-high-contrast');
            this.textContent = isActive ? 'High Contrast ON' : 'High Contrast';
            this.classList.toggle('active', isActive);
        });

        document.getElementById('acc-close').addEventListener('click', function() {
            document.getElementById('accessibility-toolbar-injected').remove();
        });
    }

    // Load the script immediately
    loadAccessibilityScript();
})();