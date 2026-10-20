# Koi Admin Template

A production-shaped admin application built on **Koi React components** — the integration example and the starting point for real admin systems, in the spirit of vue-element-admin but on Koi's design language. Not a component of the library: an app under `apps/`.

## Stack

| Concern | Choice |
| --- | --- |
| Build | Rsbuild (`@rsbuild/core` + `@rsbuild/plugin-react`) |
| Routing | TanStack Router, file-based, via `@tanstack/router-plugin` (`tools.rspack.plugins` in `rsbuild.config.ts`) |
| State | Zustand (`stores/auth.ts` session, `stores/ui.ts` shell state) |
| Server data | TanStack Query (`useQuery` in the routes; `invalidateQueries` after writes) |
| Forms | `react-hook-form` — `register` for native inputs, `Controller` for Base UI controls (`Checkbox`, `Switch`, `RadioGroup`) |
| Styling | Panda CSS through the repo-wide root `panda.config.ts` (`postcss.config.cjs`, same as Storybook) |
| UI | `@koi/react` + `@koi/tokens` only — no other component library |

## Run

```sh
pnpm dev:admin        # codegen (tokens + panda) then rsbuild dev on :3000, also logged to .temp/dev-admin.log
pnpm dev:admin:status # is it already running? (exit 0 + URL and log path)
pnpm check            # static checks + typecheck (includes this app)
pnpm --filter admin build
```

Demo account: `admin` / `123456`. All data is mock (`src/mock/api.ts`), generated deterministically so screenshots are stable.

## What's inside

- **App shell** (`src/components/app-shell/`): collapsible sidebar (persisted), sticky topbar, breadcrumb, user menu, light/dark toggle, responsive drawer below 768px.
- **Routes** (`src/routes/`): `login`, `_authed` (guard + shell) → `dashboard`, `orders` (filters, paging, CRUD and CSV import/export; URL state via `validateSearch`), `settings` (validation + submit), `$.tsx` 404.
- **Navigation config** (`src/nav.ts`): single source for the sidebar; titles come from each route's `staticData.title` (breadcrumb + `document.title`).
- **Theming**: `theme-init.js` inlined into `<head>` by `rsbuild.config.ts` (`html.tags`) — no flash of the wrong theme. The toggle calls `koiSetTheme`, exactly like any Koi consumer.
- **Business pieces built here, not in the library**: sidebar nav, breadcrumbs, user menu (Base UI `Menu` directly), admin icons. See `agent-doc/admin.md` for what should move into `@koi/react` once specced (Menu, NavMenu, Breadcrumb). Tables come from the library (`@koi/react/data-table`, plus the `@koi/react/table` parts where row selection is needed).

## Copying this template

The app has no hidden coupling: workspace deps (`@koi/react`, `@koi/tokens`), one PostCSS config pointing at the root `panda.config.ts`, and one bundler config. Copy `apps/admin`, rename the package, adjust `nav.ts` and the routes, and add `your-app/src` to `include` in the root `panda.config.ts` if you style your own UI with `css()`.
