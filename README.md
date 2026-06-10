# A11y Companion

A personal accessibility toolbar that works on **any** website. Install it once and it
follows you across the web, applying your reading and vision preferences on every page.

> This is not just for blind users. It is for anyone with dyslexia, ADHD, low vision,
> color blindness, light sensitivity, aging eyes, or anyone who simply wants the web to
> be easier to read.

---

## Features

- **Text size and spacing** — adjust font size, letter spacing, and line height.
- **Dyslexia-friendly font** — switch the whole page to OpenDyslexic.
- **Reading mode** — strips a page down to its main content. It finds the main article
  (`<main>`, `[role="main"]`, `<article>`, or the largest text block), dims everything
  else, and reflows the content into a clean, centered reading column.
- **Color modes** — grayscale, invert/dark, high contrast, plus real `feColorMatrix`
  simulations of protanopia, deuteranopia, and tritanopia.
- **Screen reader (hover to read)** — turn it on and point your mouse at anything; after a
  short pause it speaks the text under the cursor. It climbs to the nearest control so
  buttons read their accessible name (for example a "Subscribe" button), reads genuine
  text blocks in full, and stays quiet over empty layout containers. Reading stops when
  the pointer leaves the page or you switch tabs.
- **Read page info** — speak the current page title and site on demand, from a toolbar
  button or by voice ("where am I", "page info", "read url"). Browsers do not let an
  extension read the address bar directly, so the page reports its own location instead.
- **Voice commands** — control the page hands-free (see the list below).
- **Keyboard navigation** — walk focusable elements with the arrow keys and a visible
  focus ring; press Enter to activate.
- **Cross-site sync** — change a setting once and it follows you to every site and every
  Chrome install, via `chrome.storage.sync`.

### Voice commands

When voice commands are on, the toolbar listens for:

- "scroll down" / "scroll up", "top of page" / "bottom of page"
- "read page", "stop reading"
- "where am I", "page info", "read url"
- "bigger text" / "smaller text", "reading mode"
- "dark mode", "high contrast", "default colors"
- "go back" / "go forward", "reload"
- "next" / "previous" (move keyboard focus)
- "click [text]" — for example "click sign in" activates a matching link or button

---

## Install (development)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the `extension/` directory.

### Using it

- The toolbar appears as a horizontal bar along the bottom of every page.
- Press **Alt + Shift + A** to toggle the toolbar.
- Click the extensions (puzzle-piece) icon, then **A11y Companion**, for a popup with
  global show/hide and reset controls.

After changing any code, click the reload icon on the extension card in
`chrome://extensions`, then reload any open tabs so they pick up the new content script.

---

## Architecture

```
extension/
├── manifest.json   # Manifest V3, runs on <all_urls>
├── content.js      # Toolbar and all features, inside a Shadow DOM
├── background.js   # Service worker: install defaults and the toggle command
├── popup.html/.js  # Browser action popup
├── fonts/          # OpenDyslexic woff2
└── icons/          # 16 / 48 / 128 PNGs
```

The toolbar lives in a **Shadow DOM** so host-page CSS cannot break it. Settings persist
via `chrome.storage.sync`, so they follow the user across sites and Chrome installs.

### Single-page app support

Most modern sites are single-page apps. The content script:

- Patches `history.pushState` / `replaceState` to detect client-side navigation.
- Uses a `MutationObserver` to re-apply reading mode and re-attach the toolbar if a route
  change removes it.

### Resilience

When the extension is reloaded, updated, or disabled, content scripts already running in
open tabs become orphaned and their `chrome.*` APIs are severed. The content script detects
this ("Extension context invalidated") and goes quiet — it stops its observers and
listeners instead of throwing errors. The next fresh page load runs cleanly.

---

## Publishing to the Chrome Web Store

### 1. Package the extension

Create a zip of the **contents** of `extension/` (the `manifest.json` must sit at the root
of the zip, not inside a nested folder):

```sh
cd extension
zip -r ../a11y-companion.zip . -x "*.DS_Store"
```

### 2. Register as a developer

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Pay the one-time **$5** developer registration fee (covers the account, not per item).

### 3. Create the listing

1. Click **Add new item** and upload the zip.
2. Fill in the listing details:
   - Description (the manifest description is a good starting point).
   - Category: **Accessibility**.
   - At least one **screenshot** (1280x800 or 640x400).
   - The 128x128 store icon (included).
3. Complete the **Privacy practices** tab:
   - Declare data usage. This extension stores only user settings in
     `chrome.storage.sync` and collects no personal data.
   - Justify the broad permissions. The toolbar requests `<all_urls>` and `scripting`
     because it must run on every site the user visits to provide accessibility features.
   - Add a privacy policy URL (required when requesting broad host permissions).

### 4. Submit for review

Submit and wait for review. Extensions that request `<all_urls>` typically get extra
scrutiny, so the first review can take longer than usual and may include a clarification
request. Each new upload must use a higher `version` number in `manifest.json`.

---

## Permissions

| Permission        | Why it is needed                                                        |
| ----------------- | ----------------------------------------------------------------------- |
| `storage`         | Persist and sync the user's accessibility settings.                     |
| `activeTab`       | Act on the current tab when the toolbar is toggled.                     |
| `scripting`       | Inject and run the accessibility features in the page.                  |
| `<all_urls>`      | The toolbar must work on every website the user visits.                |

The extension also requests microphone access at runtime (via the Web Speech API) only
when voice commands are turned on.

---

## Project history

This started as a college capstone project: a WordPress accessibility plugin built for
[Lasagna Love](https://lasagnalove.org/). That organization is no longer using it, so the
project has been rebuilt and refocused as a standalone Chrome extension that works on any
site. Along the way it gained:

- A Shadow-DOM toolbar that host-page CSS cannot break.
- Real colorblind filters using SVG `feColorMatrix` instead of `hue-rotate` hacks.
- A reworked reading mode that handles nested modern layouts.
- Hover-to-read screen reading that follows the mouse.
- Voice commands, including "click [text]" for hands-free activation.
- Cross-site settings sync via `chrome.storage.sync`.
- Several fixes carried over from the original (keyboard-nav focus tracking, voice
  recognition error loops, post-load initialization).

---

## Roadmap

- Real, designed PNG icons and store screenshots.
- Firefox build (the manifest is largely compatible).
- AI-powered alt text for images.
- AI page summarization for cognitive accessibility.
- More voice languages.

---

## License

MIT
