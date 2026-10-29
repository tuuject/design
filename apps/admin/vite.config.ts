// Vite + TanStack Router file-based routing. Panda styles come through the shared root
// panda.config.ts via the PostCSS plugin (see postcss.config.cjs), exactly like the Storybook app.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const require = createRequire(import.meta.url);
// Inline theme-init into <head> before any CSS so the first paint already has the right theme
// (same advice as the file's own header comment; see apps/storybook/.storybook/preview.tsx).
const themeInit = readFileSync(require.resolve('@koi/tokens/theme-init.js'), 'utf8');

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
  server: { port: 3000, strictPort: true },
});
