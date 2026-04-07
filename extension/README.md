# A11y Companion (Chrome Extension)

A personal accessibility toolbar that works on **any** website. Built from the original WordPress plugin and rewritten as a browser extension so users can install it once and have it follow them across the web.

## Features

- **Text size & spacing** — adjust font size, letter spacing, line height
- **Dyslexia-friendly font** (OpenDyslexic)
- **Reading mode** — strips a page down to its main content
- **Color modes** — grayscale, invert/dark, high contrast, protanopia, deuteranopia, tritanopia (real SVG color matrices, not hue-rotate hacks)
- **Screen reader** (Web Speech API)
- **Voice commands** — "scroll down", "read page", "bigger text", "next", "click", etc.
- **Keyboard navigation** — arrow keys to walk focusable elements
- **Settings sync** across every site you visit via `chrome.storage.sync`
- **Shadow DOM toolbar** — host-site CSS can never break or restyle the toolbar

## Load the extension (development)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this `extension/` directory

## Keyboard shortcut

`Alt + Shift + A` — toggle the toolbar.

## Before publishing to the Chrome Web Store

- Add real PNG icons at `icons/icon16.png`, `icon48.png`, `icon128.png` (currently only an SVG placeholder is included).
- Add a privacy policy (extension uses no remote servers; all storage is `chrome.storage.sync`).
- Test on Firefox via `web-ext` if you want a cross-browser release — the manifest is mostly compatible.

## Architecture

```
manifest.json    MV3 manifest
background.js    Service worker — install defaults, command handler
content.js       Injected on every page — toolbar + all features
popup.html/.js   Browser-action popup
fonts/           OpenDyslexic woff2 files
icons/           Extension icons
```

All UI lives in a Shadow DOM (`#__a11y-companion-host`) so the page's CSS can't bleed in.

## Bugs fixed from the original WordPress plugin

- Keyboard navigation focus tracking (typo'd `currentFocusedElement` vs `currentlyFocusedElement` broke index lookups).
- Voice recognition restart loop on permission errors.
- `DOMContentLoaded`-only init (broke when injected after load).
- Color filters were applied to `body`, which also filtered the toolbar itself.
- High-contrast mode used CSS variables that any site stylesheet could override.
- Settings stored in `localStorage` (per-origin); now sync globally.
