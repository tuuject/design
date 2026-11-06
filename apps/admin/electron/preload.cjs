// Tells the main process which theme the page is showing, and whether the user chose it, so the window's own
// paint (the background behind the page, the Windows caption buttons) can follow it. It watches <html data-theme>
// like hooks/use-theme.ts: every writer is seen (koiSetTheme, theme-init following the OS) and the page never
// knows it runs in Electron.
//
// CommonJS, not TypeScript: a sandboxed preload is not loaded through Node's module loader, so neither ESM nor
// type stripping applies.
const { ipcRenderer } = require('electron');

// theme-init keeps an explicit choice in localStorage "koi-theme"; without one the page follows the OS.
function storedChoice() {
  try {
    const value = localStorage.getItem('koi-theme');
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

let reported;
function report() {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const choice = storedChoice();
  if (`${theme} ${choice}` !== reported) {
    reported = `${theme} ${choice}`;
    ipcRenderer.send('koi:theme', theme, choice);
  }
}

// theme-init is inlined in <head>, so the attribute is set by the time the document has parsed. It sets the
// attribute on every change of choice, even to the same value, so going back to the OS theme is reported too.
window.addEventListener('DOMContentLoaded', () => {
  report();
  new MutationObserver(report).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});
