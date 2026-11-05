// Electron shell for the admin template. On macOS the window hides its title bar but keeps the traffic lights,
// moved onto the header's first row; the page learns their footprint from the Window Controls Overlay env()
// variables (src/index.css) and keeps its content out of their way. Other platforms keep the system frame for now.
//
// Electron runs this file as TypeScript directly (Node's type stripping), so it uses erasable syntax only.
import { existsSync, statSync } from 'node:fs';
import { extname, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sizes, space } from '@tuuject/koi-tokens/dimensions';
import { colors } from '@tuuject/koi-tokens/native';
import { app, BrowserWindow, nativeTheme, net, protocol, shell } from 'electron';

const dev = process.argv.includes('--dev');
const DEV_URL = 'http://localhost:3000/';
// The router uses browser history, so the built app needs a real origin that answers every route with
// index.html: under file:// a reload or a deep link would miss.
const SCHEME = 'app';
const APP_URL = `${SCHEME}://admin/`;
const START_URL = dev ? DEV_URL : APP_URL;
const DIST = join(import.meta.dirname, '..', 'dist');

const mac = process.platform === 'darwin';
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

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: 'Koi Admin',
    // Shown once the first frame is ready, so the window never flashes an unpainted page.
    show: false,
    backgroundColor: colors[nativeTheme.shouldUseDarkColors ? 'dark' : 'light']['page-bg'],
    ...(mac && {
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: LIGHTS_INSET, y: LIGHTS_INSET },
      // Exposes the buttons' footprint to CSS as env(titlebar-area-*). The height pins that strip to the header
      // even if a macOS release draws the buttons at another size.
      titleBarOverlay: { height: HEADER_HEIGHT },
    }),
  });
  win.once('ready-to-show', () => win.show());

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
