# A11y Companion

A personal accessibility toolbar that works on **any** website. Originally built as a WordPress plugin (capstone project), now also available as a Chrome extension so users can install it once and have it follow them across the web.

> **Reframe:** this is not just for blind users. It's for anyone with dyslexia, ADHD, low vision, color blindness, light sensitivity, aging eyes, or anyone who just wants the web to be easier to read.

---

## Two ways to use it

### 1. Chrome Extension (recommended)
Works on every website. Settings sync across all your sites and devices. See [`extension/README.md`](extension/README.md) for install and dev instructions.

### 2. WordPress Plugin (original)
Drop into any WordPress site to give visitors an embedded accessibility toolbar. See **WordPress Plugin** section below.

---

## Features

- 📏 **Text size & spacing** — adjust font size, letter spacing, line height
- 🔤 **Dyslexia-friendly font** — OpenDyslexic
- 📖 **Reading mode** — strips a page down to its main content (walks up the DOM from `<main>` and dims siblings)
- 🎨 **Color modes** — grayscale, invert/dark, high contrast, and real `feColorMatrix` simulations of protanopia, deuteranopia, and tritanopia
- 🔊 **Screen reader** — Web Speech API
- 🎤 **Voice commands** — "scroll down", "read page", "bigger text", "dark mode", "click sign in", etc.
- ⌨️ **Keyboard navigation** — arrow keys to walk focusable elements with a visible focus ring
- 🔄 **Cross-site sync** (extension only) — change a setting once, it follows you everywhere

---

## Chrome Extension

### Install (development)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` directory

### Use it

- The toolbar appears in the bottom-right of every page
- Press **Alt + Shift + A** to toggle the toolbar
- Click the puzzle-piece icon → A11y Companion → popup for global controls

### Architecture

```
extension/
├── manifest.json   # MV3, runs on <all_urls>
├── content.js      # Toolbar + all features in a Shadow DOM
├── background.js   # Service worker — install defaults, command handler
├── popup.html/.js  # Browser action popup
├── fonts/          # OpenDyslexic woff2
└── icons/          # 16/48/128 PNGs
```

The toolbar lives in a **Shadow DOM** so host-page CSS can't break it. Settings persist via `chrome.storage.sync` so they follow the user across sites and Chrome installs.

### SPA support

Most modern sites are single-page apps. The content script:
- Patches `history.pushState` / `replaceState` to detect client-side navigation
- Uses a `MutationObserver` to re-apply reading mode and re-attach the toolbar if a route change removes it

---

## WordPress Plugin

### Prerequisites
- WordPress 5.0+
- PHP 7.4+
- A modern browser with Web Speech API support

### Installation

1. Upload the plugin folder to `wp-content/plugins/accessibility-plugin/`
2. Activate from **Plugins** in the WordPress admin
3. The toolbar appears automatically on every page

### File structure

```
accessibility-plugin/
├── script-enqueue.php          # Plugin entry & script enqueuing
├── js/accessibility-plugin.js  # Core functionality
├── templates/toolbar.php       # Toolbar UI + CSS
├── fonts/                      # OpenDyslexic font files
└── images/                     # Toolbar icons
```

---

## Project history

This started as a college capstone project: a WordPress accessibility plugin built for [Lasagna Love](https://lasagnalove.org/). It has since been rebuilt as a Chrome extension with:

- Several bug fixes from the original (keyboard nav focus tracking, voice recognition error loops, post-load init)
- A Shadow-DOM toolbar that can't be broken by host-page CSS
- Real colorblind filters using SVG `feColorMatrix` instead of `hue-rotate` hacks
- A reworked reading mode that handles nested modern layouts
- New voice commands including `click <text>` for hands-free element activation
- Cross-site settings sync via `chrome.storage.sync`

---

## Roadmap

- [ ] Real PNG icons in the Chrome Web Store listing
- [ ] Firefox build (manifest is mostly compatible)
- [ ] AI-powered alt text for images (Claude/GPT vision)
- [ ] AI page summarization for cognitive accessibility
- [ ] More voice languages

---

## License

MIT
