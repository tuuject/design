// Vite + TanStack Router file-based routing. Panda styles come through the shared root
// panda.config.ts via the PostCSS plugin (see postcss.config.cjs), exactly like the Storybook app.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
// Inline theme-init into <head> before any CSS so the first paint already has the right theme
// (same advice as the file's own header comment; see apps/storybook/.storybook/preview.tsx).
const themeInit = readFileSync(require.resolve('@tuuject/koi-tokens/theme-init.js'), 'utf8');
// Worktrees share port 3000, so every response names the checkout it is served from (scripts/dev-server.mjs and
// the Electron shell check it). URI-encoded: a header value can't carry every character a path can.
const checkout = encodeURIComponent(fileURLToPath(new URL('../..', import.meta.url)));

export default defineConfig({
  plugins: [
    // Must come before react() so the generated route files are transformed by it.
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    {
      name: 'koi-theme-init',
      transformIndexHtml: () => [{ tag: 'script', children: themeInit, injectTo: 'head-prepend' }],
    },
  ],
  // A busy port must fail instead of moving to 3001: agents look for the user's server on 3000
  // (scripts/dev-server.mjs), and a silent second server would leave them checking the wrong one.
  server: { port: 3000, strictPort: true, headers: { 'X-Koi-Checkout': checkout } },
});
