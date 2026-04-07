# Testing the Accessibility Plugin

## Quick Test (Browser)
1. Open `test.html` in your browser
2. Test each button in the toolbar (bottom-right corner)
3. Check browser console (F12) for any errors

## WordPress Testing
1. Copy plugin folder to `/wp-content/plugins/`
2. Activate in WordPress admin
3. Visit any page - toolbar should appear bottom-right

## Feature Testing Checklist

### ✅ Screen Reader
- [ ] Button toggles ON/OFF
- [ ] Reads page content when enabled
- [ ] Works with keyboard navigation

### ✅ Voice Commands
- [ ] Button shows "Listening..." when active
- [ ] Voice commands work:
  - "scroll down" / "scroll up"
  - "read website" / "stop reading"
  - "increase font size" / "decrease font size"
  - "toggle dyslexia font"
  - "enable keyboard navigation"

### ✅ Keyboard Navigation
- [ ] Arrow keys navigate between focusable elements
- [ ] Red outline shows current focus
- [ ] Enter key activates focused element
- [ ] Combines with screen reader

### ✅ Font Size
- [ ] Increase button makes text larger
- [ ] Decrease button makes text smaller
- [ ] Settings persist after page reload

### ✅ Letter Spacing
- [ ] Increase button adds spacing
- [ ] Decrease button reduces spacing
- [ ] Settings persist after page reload

### ✅ Dyslexia Font
- [ ] Button toggles OpenDyslexic font
- [ ] Font applies to entire page
- [ ] Setting persists after reload

### ✅ Color Modes
- [ ] Default - normal colors
- [ ] High Contrast - black/white
- [ ] Protanopia/Deuteranopia/Tritanopia - color filters
- [ ] Setting persists after reload

## Browser Compatibility
Test in:
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari
- [ ] Edge

## Common Issues
- **Voice Input**: Requires HTTPS or localhost
- **Fonts**: May not load if paths are incorrect
- **Screen Reader**: Needs browser speech synthesis support