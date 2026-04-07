document.getElementById('toggle').addEventListener('click', async () => {
  const { toolbarVisible } = await chrome.storage.sync.get('toolbarVisible');
  await chrome.storage.sync.set({ toolbarVisible: !toolbarVisible });
  window.close();
});

document.getElementById('reset').addEventListener('click', async () => {
  await chrome.storage.sync.set({
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
  });
  window.close();
});
