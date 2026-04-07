// A11y Companion — content script
// Injects an accessibility toolbar into a Shadow DOM on every page,
// and applies user settings synced via chrome.storage.sync.

(function () {
  'use strict';
  if (window.__a11yCompanionLoaded) return;
  window.__a11yCompanionLoaded = true;

  const STORAGE_KEYS = [
    'toolbarVisible',
    'fontSize',
    'letterSpacing',
    'lineHeight',
    'dyslexiaFont',
    'colorMode',
    'screenReader',
    'voiceInput',
    'keyboardNav',
    'readingMode',
  ];

  const DEFAULTS = {
    toolbarVisible: true,
    fontSize: 100,
    letterSpacing: 0,
    lineHeight: 1.5,
    dyslexiaFont: false,
    colorMode: 'default',
    screenReader: false,
    voiceInput: false,
    keyboardNav: false,
    readingMode: false,
  };

  let settings = { ...DEFAULTS };
  let host, shadow;

  // ─── Storage helpers ────────────────────────────────────────────────
  async function loadSettings() {
    const stored = await chrome.storage.sync.get(STORAGE_KEYS);
    settings = { ...DEFAULTS, ...stored };
  }
  function saveSetting(key, value) {
    settings[key] = value;
    chrome.storage.sync.set({ [key]: value });
  }

  // ─── Style application (uses html element + !important to beat sites) ──
  const STYLE_ID = '__a11y-companion-style';
  function applyAllStyles() {
    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    const fontFaces = `
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('${chrome.runtime.getURL('fonts/OpenDyslexic-Regular.woff2')}') format('woff2');
        font-weight: normal; font-style: normal; font-display: swap;
      }
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('${chrome.runtime.getURL('fonts/OpenDyslexic-Bold.woff2')}') format('woff2');
        font-weight: bold; font-style: normal; font-display: swap;
      }
    `;

    const fontSize = `html { font-size: ${settings.fontSize}% !important; }`;
    // Apply spacing to inheritable parents only — letter-spacing and line-height
    // both inherit, so this avoids breaking icon fonts and flex layouts.
    const spacing = `html, body, p, li, h1, h2, h3, h4, h5, h6, span, a, div, td, th, label, button, input, textarea {
      letter-spacing: ${settings.letterSpacing}px !important;
      line-height: ${settings.lineHeight} !important;
    }`;
    const dyslexia = settings.dyslexiaFont
      ? `html, body, p, li, h1, h2, h3, h4, h5, h6, span, a, div, td, th, label, button, input, textarea, blockquote, figcaption {
           font-family: 'OpenDyslexic', sans-serif !important;
         }
         /* Don't override icon fonts */
         [class*="icon"], [class*="fa-"], i.fa, i.material-icons, .material-icons {
           font-family: inherit !important;
         }`
      : '';

    let colorFilter = '';
    if (settings.colorMode === 'protanopia') {
      colorFilter = `html { filter: url('#__a11y-protanopia') !important; }`;
    } else if (settings.colorMode === 'deuteranopia') {
      colorFilter = `html { filter: url('#__a11y-deuteranopia') !important; }`;
    } else if (settings.colorMode === 'tritanopia') {
      colorFilter = `html { filter: url('#__a11y-tritanopia') !important; }`;
    } else if (settings.colorMode === 'invert') {
      colorFilter = `html { filter: invert(1) hue-rotate(180deg) !important; }
                     img, video, picture, [style*="background-image"] { filter: invert(1) hue-rotate(180deg) !important; }`;
    } else if (settings.colorMode === 'high-contrast') {
      colorFilter = `
        html, body { background: #000 !important; color: #fff !important; }
        body *:not(#__a11y-companion-host):not(#__a11y-companion-host *) {
          background-color: transparent !important;
          color: #fff !important;
          border-color: #fff !important;
        }
        a, a * { color: #00ffff !important; }
        button:not(#__a11y-companion-host *),
        input:not(#__a11y-companion-host *),
        select:not(#__a11y-companion-host *),
        textarea:not(#__a11y-companion-host *) {
          background: #222 !important; color: #fff !important; border: 1px solid #fff !important;
        }
        img, video, svg { filter: brightness(0.85) contrast(1.1) !important; }
      `;
    } else if (settings.colorMode === 'grayscale') {
      colorFilter = `html { filter: grayscale(1) !important; }`;
    }

    // Reading mode is applied imperatively (see applyReadingMode) so we only
    // emit the styling rules here. The "main" element gets a marker class.
    const readingMode = settings.readingMode
      ? `.__a11y-reading-dim { opacity: 0.08 !important; pointer-events: none !important; }
         .__a11y-reading-main, .__a11y-reading-main * {
           max-width: none !important;
         }
         .__a11y-reading-main {
           max-width: 720px !important;
           margin: 2em auto !important;
           font-size: 1.15em !important;
           line-height: 1.75 !important;
           background: #fafaf7 !important;
           color: #1a1a1a !important;
           padding: 2.5em !important;
           border-radius: 8px !important;
           box-shadow: 0 2px 20px rgba(0,0,0,0.06) !important;
           font-family: Georgia, 'Times New Roman', serif !important;
         }
         .__a11y-reading-main img { max-width: 100% !important; height: auto !important; }`
      : '';

    styleEl.textContent = fontFaces + fontSize + spacing + dyslexia + colorFilter + readingMode;
    ensureColorFilterSVG();
    applyReadingMode();
  }

  // Reading mode: find the main content element, then walk up to <body>,
  // dimming each sibling along the way. This works on nested layouts where
  // <main> isn't a direct child of <body> (most modern sites).
  function applyReadingMode() {
    // Clean up any previous state first
    document.querySelectorAll('.__a11y-reading-dim').forEach((el) =>
      el.classList.remove('__a11y-reading-dim')
    );
    document.querySelectorAll('.__a11y-reading-main').forEach((el) =>
      el.classList.remove('__a11y-reading-main')
    );
    if (!settings.readingMode) return;

    const main =
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('article') ||
      pickLargestTextBlock();
    if (!main) return;

    main.classList.add('__a11y-reading-main');

    // Walk up to body, dimming siblings at each level
    let node = main;
    while (node && node.parentElement && node !== document.body) {
      const parent = node.parentElement;
      for (const sibling of parent.children) {
        if (
          sibling !== node &&
          sibling.id !== '__a11y-companion-host' &&
          sibling.id !== '__a11y-color-filters'
        ) {
          sibling.classList.add('__a11y-reading-dim');
        }
      }
      node = parent;
    }
  }

  // Heuristic fallback: pick the element with the most direct text content.
  function pickLargestTextBlock() {
    const candidates = document.querySelectorAll('div, section');
    let best = null;
    let bestScore = 0;
    for (const el of candidates) {
      const text = el.innerText || '';
      const score = text.length;
      if (score > bestScore && score > 500) {
        bestScore = score;
        best = el;
      }
    }
    return best;
  }

  function ensureColorFilterSVG() {
    if (document.getElementById('__a11y-color-filters')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = '__a11y-color-filters';
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;';
    svg.innerHTML = `
      <defs>
        <filter id="__a11y-protanopia"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/></filter>
        <filter id="__a11y-deuteranopia"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/></filter>
        <filter id="__a11y-tritanopia"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/></filter>
      </defs>
    `;
    (document.body || document.documentElement).appendChild(svg);
  }

  // ─── Screen reader (Web Speech API) ─────────────────────────────────
  const screenReader = {
    synth: window.speechSynthesis,
    speak(text) {
      if (!text || !this.synth) return;
      this.synth.cancel();
      const u = new SpeechSynthesisUtterance(String(text).slice(0, 32000));
      u.lang = document.documentElement.lang || 'en-US';
      u.rate = 1;
      this.synth.speak(u);
    },
    readEl(el) {
      if (!el) return;
      const text =
        el.getAttribute?.('aria-label') ||
        el.alt ||
        el.title ||
        el.innerText ||
        el.textContent ||
        '';
      this.speak(text);
    },
    readPage() {
      const main =
        document.querySelector('main, [role="main"], article, #content, .content') ||
        document.body;
      this.speak(main.innerText || main.textContent || '');
    },
    stop() {
      this.synth?.cancel();
    },
  };
  window.addEventListener('beforeunload', () => screenReader.stop());

  // ─── Keyboard navigation ────────────────────────────────────────────
  const kbd = {
    current: null,
    bound: null,
    focusables() {
      return Array.from(
        document.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null && !host?.contains(el));
    },
    init() {
      if (this.bound) return;
      this.bound = this.onKey.bind(this);
      document.addEventListener('keydown', this.bound, true);
      const els = this.focusables();
      if (els.length) this.focus(els[0]);
    },
    disable() {
      if (this.bound) document.removeEventListener('keydown', this.bound, true);
      this.bound = null;
      if (this.current) this.current.classList.remove('__a11y-focused');
      this.current = null;
    },
    onKey(e) {
      // Don't hijack typing inside form fields
      const tag = (e.target?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') this.move(1);
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') this.move(-1);
      else if (e.key === 'Enter' && this.current && !host?.contains(this.current)) this.current.click?.();
    },
    move(dir) {
      const els = this.focusables();
      if (!els.length) return;
      const idx = els.indexOf(this.current);
      const next = els[(idx + dir + els.length) % els.length] || els[0];
      this.focus(next);
    },
    focus(el) {
      if (!el) return;
      if (this.current) this.current.classList.remove('__a11y-focused');
      this.current = el;
      el.classList.add('__a11y-focused');
      try { el.focus({ preventScroll: true }); } catch {}
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (settings.screenReader) screenReader.readEl(el);
    },
  };

  // Inject keyboard-focus outline once
  (function injectFocusStyle() {
    const s = document.createElement('style');
    s.textContent = `.__a11y-focused { outline: 3px solid #ff3860 !important; outline-offset: 2px !important; }`;
    (document.head || document.documentElement).appendChild(s);
  })();

  // ─── Voice commands ─────────────────────────────────────────────────
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voice = {
    rec: null,
    listening: false,
    init() {
      if (!SR || this.rec) return;
      this.rec = new SR();
      this.rec.continuous = true;
      this.rec.interimResults = false;
      this.rec.lang = document.documentElement.lang || 'en-US';
      this.rec.onresult = (e) => {
        const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
        this.handle(transcript);
      };
      this.rec.onerror = (e) => {
        console.warn('[a11y] voice error:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          saveSetting('voiceInput', false);
          updateUI();
        }
      };
      this.rec.onend = () => {
        this.listening = false;
        if (settings.voiceInput) {
          try { this.rec.start(); this.listening = true; } catch {}
        }
      };
    },
    start() {
      this.init();
      if (!this.rec || this.listening) return;
      try { this.rec.start(); this.listening = true; } catch {}
    },
    stop() {
      if (this.rec && this.listening) {
        try { this.rec.stop(); } catch {}
      }
      this.listening = false;
    },
    handle(t) {
      console.log('[a11y] heard:', t);
      // "click <something>" — find a link/button whose text matches and click it
      const clickMatch = t.match(/^(?:click|press|tap|open) (.+)$/);
      if (clickMatch) return this.clickByText(clickMatch[1]);

      const cmd = (sub, fn) => t.includes(sub) && (fn(), true);
      cmd('scroll down', () => window.scrollBy(0, 400)) ||
      cmd('scroll up', () => window.scrollBy(0, -400)) ||
      cmd('top of page', () => window.scrollTo(0, 0)) ||
      cmd('bottom of page', () => window.scrollTo(0, document.body.scrollHeight)) ||
      cmd('go back', () => history.back()) ||
      cmd('go forward', () => history.forward()) ||
      cmd('reload', () => location.reload()) ||
      cmd('read page', () => screenReader.readPage()) ||
      cmd('stop reading', () => screenReader.stop()) ||
      cmd('bigger text', () => actions.fontSize(10)) ||
      cmd('smaller text', () => actions.fontSize(-10)) ||
      cmd('reading mode', () => actions.toggle('readingMode')) ||
      cmd('dark mode', () => actions.setColor('invert')) ||
      cmd('high contrast', () => actions.setColor('high-contrast')) ||
      cmd('default colors', () => actions.setColor('default')) ||
      cmd('next', () => kbd.move(1)) ||
      cmd('previous', () => kbd.move(-1));
    },
    clickByText(query) {
      const q = query.toLowerCase().trim();
      const candidates = document.querySelectorAll('a, button, [role="button"], [role="link"], input[type="submit"], input[type="button"]');
      let best = null;
      for (const el of candidates) {
        if (host?.contains(el)) continue;
        const label = (
          el.getAttribute('aria-label') ||
          el.innerText ||
          el.value ||
          el.title ||
          ''
        ).toLowerCase().trim();
        if (!label) continue;
        if (label === q) { best = el; break; }
        if (!best && label.includes(q)) best = el;
      }
      if (best) {
        best.scrollIntoView({ behavior: 'smooth', block: 'center' });
        best.click();
      } else {
        screenReader.speak(`Could not find ${query}`);
      }
    },
  };

  // ─── Actions ────────────────────────────────────────────────────────
  const actions = {
    fontSize(delta) {
      const next = Math.max(80, Math.min(200, settings.fontSize + delta));
      saveSetting('fontSize', next);
      applyAllStyles();
      updateUI();
    },
    spacing(delta) {
      saveSetting('letterSpacing', Math.max(0, settings.letterSpacing + delta * 0.5));
      saveSetting('lineHeight', Math.max(1, settings.lineHeight + delta * 0.1));
      applyAllStyles();
    },
    toggle(key) {
      saveSetting(key, !settings[key]);
      onToggle(key);
      applyAllStyles();
      updateUI();
    },
    setColor(mode) {
      saveSetting('colorMode', mode);
      applyAllStyles();
    },
    reset() {
      Object.entries(DEFAULTS).forEach(([k, v]) => saveSetting(k, v));
      kbd.disable();
      voice.stop();
      screenReader.stop();
      applyAllStyles();
      updateUI();
    },
  };

  function onToggle(key) {
    if (key === 'keyboardNav') settings.keyboardNav ? kbd.init() : kbd.disable();
    if (key === 'voiceInput') settings.voiceInput ? voice.start() : voice.stop();
    if (key === 'screenReader' && settings.screenReader) screenReader.readPage();
    if (key === 'screenReader' && !settings.screenReader) screenReader.stop();
  }

  // ─── Toolbar UI (Shadow DOM, isolated from page CSS) ────────────────
  function buildToolbar() {
    if (host) return;
    host = document.createElement('div');
    host.id = '__a11y-companion-host';
    host.style.cssText = 'all: initial; position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;';
    shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        .panel {
          font-family: -apple-system, system-ui, sans-serif;
          background: #ffffff;
          color: #111;
          border-radius: 14px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.25);
          width: 280px;
          padding: 14px;
          font-size: 14px;
        }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .title { font-weight: 600; font-size: 15px; }
        .close { background: none; border: none; font-size: 18px; cursor: pointer; color: #666; }
        button.btn {
          all: unset;
          display: block;
          box-sizing: border-box;
          width: 100%;
          padding: 9px 12px;
          margin: 5px 0;
          background: #f1f5f9;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          font-size: 13px;
        }
        button.btn:hover { background: #e2e8f0; }
        button.btn[aria-pressed="true"] { background: #2563eb; color: #fff; }
        .row { display: flex; gap: 6px; }
        .row .btn { text-align: center; }
        select {
          width: 100%; padding: 8px; margin: 6px 0; border-radius: 8px;
          border: 1px solid #cbd5e1; background: #fff; font-size: 13px;
        }
        label { font-size: 12px; color: #475569; margin-top: 8px; display: block; }
        .reset { color: #dc2626; text-align: center !important; margin-top: 10px; }
        .fab {
          width: 48px; height: 48px; border-radius: 50%;
          background: #2563eb; color: #fff; border: none;
          font-size: 22px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }
        .hidden { display: none; }
      </style>
      <div class="panel" id="panel">
        <div class="header">
          <div class="title">A11y Companion</div>
          <button class="close" id="close" aria-label="Hide toolbar">×</button>
        </div>

        <label>Text size</label>
        <div class="row">
          <button class="btn" data-act="font-">A−</button>
          <button class="btn" id="fontval" disabled>100%</button>
          <button class="btn" data-act="font+">A+</button>
        </div>

        <label>Spacing</label>
        <div class="row">
          <button class="btn" data-act="space-">−</button>
          <button class="btn" data-act="space+">+</button>
        </div>

        <button class="btn" id="t-dyslexiaFont">Dyslexia-friendly font</button>
        <button class="btn" id="t-readingMode">Reading mode</button>
        <button class="btn" id="t-keyboardNav">Keyboard navigation</button>
        <button class="btn" id="t-screenReader">Screen reader</button>
        <button class="btn" id="t-voiceInput">Voice commands</button>

        <label>Color mode</label>
        <select id="colorMode">
          <option value="default">Default</option>
          <option value="grayscale">Grayscale</option>
          <option value="invert">Invert / Dark</option>
          <option value="high-contrast">High contrast</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </select>

        <details style="margin-top:10px;">
          <summary style="cursor:pointer;font-size:12px;color:#475569;">Voice commands</summary>
          <div style="font-size:11px;color:#475569;line-height:1.6;padding:6px 0;">
            "scroll down/up", "top/bottom of page",<br>
            "read page", "stop reading",<br>
            "bigger/smaller text", "reading mode",<br>
            "dark mode", "high contrast", "default colors",<br>
            "go back/forward", "reload",<br>
            "next", "previous",<br>
            <strong>"click [link text]"</strong> — e.g. "click sign in"
          </div>
        </details>

        <button class="btn reset" id="reset">Reset all</button>
      </div>
      <button class="fab hidden" id="fab" aria-label="Show accessibility toolbar">♿</button>
    `;
    document.documentElement.appendChild(host);

    const $ = (sel) => shadow.querySelector(sel);

    $('#close').onclick = () => { saveSetting('toolbarVisible', false); updateUI(); };
    $('#fab').onclick = () => { saveSetting('toolbarVisible', true); updateUI(); };
    $('#reset').onclick = () => actions.reset();

    shadow.querySelectorAll('[data-act]').forEach((b) => {
      b.onclick = () => {
        const a = b.dataset.act;
        if (a === 'font+') actions.fontSize(10);
        if (a === 'font-') actions.fontSize(-10);
        if (a === 'space+') actions.spacing(1);
        if (a === 'space-') actions.spacing(-1);
      };
    });

    ['dyslexiaFont', 'readingMode', 'keyboardNav', 'screenReader', 'voiceInput'].forEach((k) => {
      $('#t-' + k).onclick = () => actions.toggle(k);
    });

    $('#colorMode').onchange = (e) => actions.setColor(e.target.value);
  }

  function updateUI() {
    if (!shadow) return;
    const $ = (s) => shadow.querySelector(s);
    $('#panel').classList.toggle('hidden', !settings.toolbarVisible);
    $('#fab').classList.toggle('hidden', settings.toolbarVisible);
    $('#fontval').textContent = settings.fontSize + '%';
    $('#colorMode').value = settings.colorMode;
    ['dyslexiaFont', 'readingMode', 'keyboardNav', 'screenReader', 'voiceInput'].forEach((k) => {
      $('#t-' + k).setAttribute('aria-pressed', String(!!settings[k]));
    });
  }

  // ─── Init & live sync ───────────────────────────────────────────────
  async function init() {
    await loadSettings();
    buildToolbar();
    applyAllStyles();
    updateUI();
    if (settings.keyboardNav) kbd.init();
    if (settings.voiceInput) voice.start();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    let touched = false;
    for (const k of Object.keys(changes)) {
      if (k in settings) {
        settings[k] = changes[k].newValue;
        touched = true;
      }
    }
    if (touched) {
      applyAllStyles();
      updateUI();
    }
  });

  // SPA support:
  // 1. Re-inject toolbar if removed by client routing
  // 2. Re-apply reading mode on DOM mutations (debounced)
  // 3. Re-apply on URL change (history pushState/replaceState)
  let readingDebounce;
  const observer = new MutationObserver(() => {
    if (host && !document.documentElement.contains(host)) {
      document.documentElement.appendChild(host);
    }
    if (settings.readingMode) {
      clearTimeout(readingDebounce);
      readingDebounce = setTimeout(applyReadingMode, 400);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Patch history APIs to detect SPA navigation
  const fireUrlChange = () => {
    setTimeout(() => {
      if (settings.readingMode) applyReadingMode();
      if (settings.keyboardNav) {
        const els = kbd.focusables();
        if (els.length && !els.includes(kbd.current)) kbd.focus(els[0]);
      }
    }, 500);
  };
  ['pushState', 'replaceState'].forEach((m) => {
    const orig = history[m];
    history[m] = function () {
      const r = orig.apply(this, arguments);
      fireUrlChange();
      return r;
    };
  });
  window.addEventListener('popstate', fireUrlChange);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
