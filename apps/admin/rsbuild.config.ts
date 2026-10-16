// Rsbuild + TanStack Router file-based routing. Panda styles come through the shared root
// panda.config.ts via the PostCSS plugin (see postcss.config.cjs), exactly like the Storybook app.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';

const require = createRequire(import.meta.url);
// Inline theme-init into <head> before any CSS so the first paint already has the right theme
// (same advice as the file's own header comment; see apps/storybook/.storybook/preview.tsx).
const themeInit = readFileSync(require.resolve('@koi/tokens/theme-init.js'), 'utf8');

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: 'Koi Admin',
    tags: [{ tag: 'script', head: true, append: false, children: themeInit }],
  },
  tools: {
    rspack: {
      plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true })],
    },
  },
});
