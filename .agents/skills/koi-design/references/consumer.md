# Koi in a consumer project (npm)

Use this when the project installs `@tuuject/koi-*` from npm and does not contain koi-ui's `packages/` or `docs/spec/`. To use the skill in the consumer, put this directory in the consumer's own skill source (a repo like surowan expects `skills/koi-design`, then its `pnpm skills:sync` links it into `.agents/skills` and `.claude/skills`); do not rely on an absolute symlink or a copy that the consumer's sync script does not own. The full Chinese playbook is `agent-doc/consuming-koi.md` in <https://github.com/tuuject/design>.

## Wiring

```sh
pnpm add @tuuject/koi-react @tuuject/koi-tokens react react-dom
pnpm add -D @pandacss/dev
```

```ts
// panda.config.ts (the app's own, not koi-ui's root config)
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  designSystem: '@tuuject/koi-react',
  include: ['./src/**/*.{ts,tsx}'],
});
```

```css
/* the app CSS entry */
@layer reset, base, tokens, recipes, utilities;
```

```js
// postcss.config.cjs
const path = require('node:path');

module.exports = {
  plugins: {
    '@pandacss/dev/postcss': { configPath: path.join(__dirname, 'panda.config.ts'), cwd: __dirname },
  },
};
```

- `designSystem` already supplies the preset, recipes, every variant and global styles. Do not add `@tuuject/koi-tokens/panda` to `presets`, do not add `staticCss`, and do not put `node_modules` in `include`.
- Import `@tuuject/koi-tokens/theme-init.js` before the CSS, or inline it in `<head>` at build time. It sets `<html data-theme="light|dark">`; `data-palette="rose"` picks another built-in palette. Do not mix in a `.dark` class.
- Styles: `css()` / `cx()` from `@tuuject/koi-react/styled-system/css` (or the app's generated `styled-system`, which re-exports it). Tokens come from the same names; sizes from `@tuuject/koi-tokens/dimensions`.
- Public component imports only: `@tuuject/koi-react`, `@tuuject/koi-react/button`, `@tuuject/koi-react/field`, `@tuuject/koi-react/table`, and so on. Never `@tuuject/koi-react/src/...` or a relative path into another repo.
- The package is built with Panda 2.1.x (`peerDependencies: @pandacss/dev ~2.1.2`). A newer Panda re-extracts the published JS and warns; see koi-ui's `agent-doc/publishing.md`.

## Copying the Admin template

`apps/admin` is a Vite app, not a component for an existing bundler. Copy `src/`, `index.html`, `vite.config.ts`, and the `@layer` line from `src/index.css`. Then:

1. Add the app's own `panda.config.ts` (above).
2. Replace `postcss.config.cjs` with the one above; the template's version points at koi-ui's repo root.
3. Give the app a standalone `tsconfig.json`; no `extends: "../../tsconfig.base.json"` and no `paths` into `packages/react/styled-system`.
4. In `package.json`, replace `workspace:*` with published versions and add `@pandacss/dev`.
5. Replace `src/mock/api.ts`, the demo account and demo data with the product's API. Keep the route, component and store structure.
6. Delete `public/theme-boot.js` / `.dark` class logic; the template inlines `theme-init` from `vite.config.ts`.

`src/shared.ts` mirrors Koi's `focusRing` because the library does not export it yet; keep the mirror until it does. `src/routeTree.gen.ts` is runtime code; keep it and let the Vite plugin regenerate it.

## Migrating from Tailwind / shadcn / Rsbuild

- New Vite app first (`apps/admin-koi` or similar), old app stays until parity, then switch the entry. Do not run Tailwind and Panda resets on the same page.
- Carry over the API proxy (`server.proxy`), router conventions, auth guard, and e2e login / theme cases.
- Koi's built-in `strings` are Simplified Chinese. For an English/i18n product, pass explicit labels where the props allow and report the remaining built-in strings as a gap; do not half-translate around them.
- Koi has no NavMenu, Menu or Breadcrumb component yet; the template implements sidebar, user menu and breadcrumbs locally. Read `agent-doc/admin.md` for what should move into the library.

## Verification

- App's own `tsc`, build and e2e pass. No `design_system_buildinfo_stale` warning (or a deliberate fallback).
- Light and dark, `data-palette="rose"`, desktop and phone widths.
- Login, guard redirect, list filters, form validation, dialog, toast.
- `pnpm check`, `pnpm shots` and `pnpm dev:admin` are koi-ui commands; they are not a substitute for the consumer's checks.
