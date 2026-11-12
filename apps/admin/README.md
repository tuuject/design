# Koi Admin Template

A production-shaped admin application built on **Koi React components** — the integration example and the starting point for real admin systems, in the spirit of vue-element-admin but on Koi's design language. Not a component of the library: an app under `apps/`.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite (`vite` + `@vitejs/plugin-react`) |
| Routing | TanStack Router, file-based, via `@tanstack/router-plugin/vite` in `vite.config.ts` |
| State | Zustand (`stores/auth.ts` session, `stores/ui.ts` shell state) |
| Server data | TanStack Query (`useQuery` in the routes; `invalidateQueries` after writes) |
| Forms | `react-hook-form` — `register` for native inputs, `Controller` for Base UI controls (`Checkbox`, `Switch`, `RadioGroup`) |
| Styling | Panda CSS through the repo-wide root `panda.config.ts` (`postcss.config.cjs`, same as Storybook) |
| UI | `@tuuject/koi-react` + `@tuuject/koi-tokens` only — no other component library |

## Run

```sh
pnpm dev:admin        # codegen (tokens + panda) then vite on :3000, also logged to .temp/dev-admin.log
pnpm dev:admin:status # is this checkout's server running? (0 + URL and log path; 3 if another checkout's holds the port)
pnpm check            # static checks + typecheck (includes this app)
pnpm --filter admin build

pnpm dev:admin:electron                 # Electron window on the running dev server (start pnpm dev:admin first)
pnpm --filter admin electron:preview    # vite build, then Electron on the built app (served as app://admin/)
```

The Electron shell (`electron/main.ts`) hides the title bar and keeps only the window controls on the header's first row: the traffic lights on macOS, the caption buttons on Windows (their glyphs follow the page's theme through `electron/preload.cjs`). The page reads the controls' footprint from the Window Controls Overlay `env()` variables and marks drag regions with `data-app-region="drag"`. Linux keeps the system frame for now, and there is no packaging step yet.

Demo account: `admin` / `123456`. All data is mock (`src/mock/api.ts`), generated deterministically so screenshots are stable.

Nothing is sent to a server. On `settings`, the nickname and email go into the signed-in session and survive a reload; the other fields reset when you leave the page. `assistant-settings` keeps its saves in mock memory until a reload, and its 「模拟保存失败」 switch makes saves fail so you can walk the failure path. `integration-settings` is page state and resets when you leave the page. These notes live here rather than on the pages: page copy only helps the user act (see the koi-design skill, Page text).

## What's inside

- **App shell** (`src/components/app-shell/`): two desktop navigation layouts — a collapsible sidebar, or a horizontal bar under the topbar — both persisted, with a sticky header, breadcrumb, user menu, light/dark toggle and a responsive drawer below 768px.
- **Routes** (`src/routes/`): `login`, `_authed` (guard + shell) → `dashboard`, `orders` (filters, paging, CRUD and CSV import/export; URL state via `validateSearch`), `settings` (validation + submit), `assistant-settings` (a long sectioned form, below), `integration-settings` (MapEditor and SetEditor on a plain page state form), `$.tsx` 404.
- **Navigation config** (`src/nav.ts`): single source for both desktop layouts — `NAV_GROUPS` is a two-level tree whose first level *is* the category (概览 / 业务 / 智能助手 / 账户), each group expanding into its pages in place (sidebar, drawer) or in a `Menu` flyout (horizontal bar, collapsed rail). Page titles still come from each route's `staticData.title` (breadcrumb + `document.title`).
- **Theming**: `theme-init.js` inlined into `<head>` by `vite.config.ts` (`transformIndexHtml`) — no flash of the wrong theme. The toggle calls `koiSetTheme`, exactly like any Koi consumer.
- **Sectioned forms** (`src/components/sectioned-form/`): `SectionedForm` + `FormSection` + `FormField` for long react-hook-form forms: sticky section list with scrollspy (a dropdown in narrow containers), a sticky action bar that counts unsaved fields, lists them by name (never their values, so a changed API key stays hidden) and jumps to each one, and a save flow that keeps edits on failure and rebases on the server's copy on success. Example: `routes/_authed.assistant-settings.tsx`.
- **Business pieces built here, not in the library**: sidebar nav, breadcrumbs, user menu (Base UI `Menu` directly), admin icons. See `agent-doc/admin.md` for what should move into `@tuuject/koi-react` once specced (Menu, NavMenu, Breadcrumb). Tables come from the library (`@tuuject/koi-react/data-table`, plus the `@tuuject/koi-react/table` parts where row selection is needed).

## Copying this template into another repo

This is a Vite app, not a component you add to an existing bundler setup. Tailwind, shadcn and Rsbuild are not part of it. Copy `src/`, `index.html`, `vite.config.ts` and the layer line from `src/index.css`, then make four changes:

1. **`panda.config.ts`** in the app root (not the repo root):
   ```ts
   import { defineConfig } from '@pandacss/dev';

   export default defineConfig({
     preflight: true,
     designSystem: '@tuuject/koi-react',
     include: ['./src/**/*.{ts,tsx}'],
   });
   ```
   Do not add `presets`, `staticCss` or recipes; `designSystem` already provides the preset and build info.
2. **`postcss.config.cjs`** points at that config with absolute paths:
   ```js
   const path = require('node:path');

   module.exports = {
     plugins: {
       '@pandacss/dev/postcss': { configPath: path.join(__dirname, 'panda.config.ts'), cwd: __dirname },
     },
   };
   ```
3. **`tsconfig.json`** stands on its own: no `extends: "../../tsconfig.base.json"`, no `paths` into `packages/react/styled-system`. Package imports resolve through `@tuuject/koi-react`'s exports.
4. **`package.json`** renames the package, replaces the workspace deps with published versions (`@tuuject/koi-react`, `@tuuject/koi-tokens`) and adds `@pandacss/dev` as a dev dependency. Then replace `src/mock/api.ts`, the demo account and the mock data with your own API.

The full checklist, local tarball workflow before the packages are on npm, theme / i18n caveats and the Tailwind / Rsbuild migration boundary are in [`agent-doc/consuming-koi.md`](../../agent-doc/consuming-koi.md).
