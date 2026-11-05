// Electron shell for the admin template. The window hides its title bar and keeps only the window controls,
// drawn over the header's first row: the traffic lights on the left on macOS, the caption buttons on the right on
// Windows. The page learns their footprint from the Window Controls Overlay env() variables (src/index.css) and
// keeps its content out of their way. Linux keeps the system frame for now.
//
// Electron runs this file as TypeScript directly (Node's type stripping), so it uses erasable syntax only.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sizes, space } from '@tuuject/koi-tokens/dimensions';
import { colors } from '@tuuject/koi-tokens/native';
import { app, BrowserWindow, ipcMain, nativeTheme, net, protocol, shell } from 'electron';

type Theme = 'light' | 'dark';

const dev = process.argv.includes('--dev');
const DEV_URL = 'http://localhost:3000/';
// The router uses browser history, so the built app needs a real origin that answers every route with
// index.html: under file:// a reload or a deep link would miss.
const SCHEME = 'app';
const APP_URL = `${SCHEME}://admin/`;
const START_URL = dev ? DEV_URL : APP_URL;
const DIST = join(import.meta.dirname, '..', 'dist');

const mac = process.platform === 'darwin';
const windows = process.platform === 'win32';
// HEADER_HEIGHT in src/components/app-shell/shared.ts: one control-md row with 8px above and below.
const HEADER_HEIGHT = sizes['control-md'] + space['2'] * 2;
// macOS draws the three buttons as a 60 x 14 group. Centered on the header's first row they sit 19px from the
// top; the same 19px from the left keeps the margin even. The overlay then reports a 98 x 52 area.
const LIGHTS_HEIGHT = 14;
const LIGHTS_INSET = (HEADER_HEIGHT - LIGHTS_HEIGHT) / 2;

protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

function serveDist() {
  protocol.handle(SCHEME, (request) => {
    const path = decodeURIComponent(new URL(request.url).pathname);
    const file = join(DIST, path);
    // join() resolves "..", so a decoded "%2e%2e/" can't reach outside dist.
    if (file.startsWith(DIST + sep) && existsSync(file) && statSync(file).isFile()) {
      return net.fetch(pathToFileURL(file).href);
    }
    // A missing file is a 404; any other path is a client-side route and gets the app shell.
    if (extname(path)) {
      return new Response('Not found', { status: 404 });
    }
    return net.fetch(pathToFileURL(join(DIST, 'index.html')).href);
  });
}

function openExternal(url: string) {
  if (/^(https?|mailto):/.test(url)) {
    void shell.openExternal(url);
  }
}

/**
 * Windows caption buttons in the page's theme. They have no fill of their own, so the header (the page
 * background on the login page) shows through, and only the glyphs take a color. The hover and pressed tint
 * doesn't come from the fill: Electron derives it from the app's theme (black in light mode, white in dark),
 * which follows the page's choice (see the koi:theme handler).
 */
function captionColors(theme: Theme) {
  return { color: '#00000000', symbolColor: colors[theme].text };
}

// Kept out of the caption buttons' way (see the file).
const SCROLLBAR_CSS = readFileSync(join(import.meta.dirname, 'scrollbar.css'), 'utf8');
// In fullscreen Windows hides the caption buttons, but Electron keeps reporting the overlay area, so the header
// would still step aside for buttons that aren't there. The page reads only these variables (src/index.css),
// which a host may override.
const NO_TITLEBAR_CSS =
  ':root { --app-titlebar-height: 0px !important; --app-titlebar-inset-left: 0px !important; --app-titlebar-inset-right: 0px !important; }';

/** The page styles that only the Windows window needs, kept in place across fullscreen and reloads. */
function styleForWindows(win: BrowserWindow) {
  let fullscreenCss: Promise<string> | undefined;
  const syncFullscreen = () => {
    if (win.isFullScreen() && !fullscreenCss) {
      fullscreenCss = win.webContents.insertCSS(NO_TITLEBAR_CSS);
    } else if (!win.isFullScreen() && fullscreenCss) {
      void fullscreenCss.then((key) => win.webContents.removeInsertedCSS(key));
      fullscreenCss = undefined;
    }
  };
  win.on('enter-full-screen', syncFullscreen);
  win.on('leave-full-screen', syncFullscreen);
  // Inserted CSS lasts for one document, so every load needs it again.
  win.webContents.on('dom-ready', () => {
    void win.webContents.insertCSS(SCROLLBAR_CSS);
    fullscreenCss = undefined;
    syncFullscreen();
  });
}

/** Repaints what the window draws itself to match the page's theme, which can differ from the system's. */
function applyTheme(win: BrowserWindow, theme: Theme) {
  // Shows wherever the page hasn't painted yet, as on a resize.
  win.setBackgroundColor(colors[theme]['page-bg']);
  if (windows) {
    win.setTitleBarOverlay(captionColors(theme));
  }
}

function createWindow() {
  // Until the preload reports the page's own choice, the system theme is the best guess.
  const theme: Theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: 'Koi Admin',
    // Shown once the first frame is ready, so the window never flashes an unpainted page.
    show: false,
    backgroundColor: colors[theme]['page-bg'],
    webPreferences: { preload: join(import.meta.dirname, 'preload.cjs') },
    ...(mac && {
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: LIGHTS_INSET, y: LIGHTS_INSET },
      // Exposes the buttons' footprint to CSS as env(titlebar-area-*). The height pins that strip to the header
      // even if a macOS release draws the buttons at another size.
      titleBarOverlay: { height: HEADER_HEIGHT },
    }),
    ...(windows && {
      titleBarStyle: 'hidden',
      // The buttons take the overlay's height, so they fill the header's first row edge to edge.
      titleBarOverlay: { ...captionColors(theme), height: HEADER_HEIGHT },
    }),
  });
  win.once('ready-to-show', () => win.show());
  if (windows) {
    styleForWindows(win);
  }

  // Anything that leaves the app opens in the browser: a bare second window or a navigated-away shell is never
  // what a link meant.
  win.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith(START_URL)) {
      return;
    }
    event.preventDefault();
    openExternal(url);
  });
  win.webContents.on('did-fail-load', (_event, _code, description, url, isMainFrame) => {
    if (dev && isMainFrame) {
      console.error(`Could not load ${url} (${description}). Start the admin dev server first: pnpm dev:admin`);
    }
  });

  void win.loadURL(START_URL);
}

// preload.cjs reports the page's theme and the user's own choice (null while the page follows the OS), on load and
// whenever either changes.
ipcMain.on('koi:theme', (event, theme: unknown, choice: unknown) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || (theme !== 'light' && theme !== 'dark')) {
    return;
  }
  // The user's choice becomes the app's theme, so what Electron draws from it (the caption buttons' hover tint,
  // context menus) agrees with the page. Only the choice, never the theme the page shows: forcing a theme the page
  // merely follows would pin prefers-color-scheme, and the page could never follow the OS again.
  nativeTheme.themeSource = choice === 'light' || choice === 'dark' ? choice : 'system';
  applyTheme(win, theme);
});

app.whenReady().then(() => {
  if (!dev) {
    serveDist();
  }
  createWindow();
  // macOS: clicking the Dock icon with no window open brings one back.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOS apps stay running with no windows; elsewhere closing the last window quits.
app.on('window-all-closed', () => {
  if (!mac) {
    app.quit();
  }
});
