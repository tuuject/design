# Koi

Koi is a soft, rounded design system (pill controls, frosted glass, sky-blue actions, amber links) that started as tcdw's Koi Astro blog theme. This repo rebuilds it as packages:

- `packages/tokens`: the single source of truth, `src/tokens.json`. `scripts/build.mjs` generates `dist/tokens.css`, `dist/panda-preset.js`, `dist/theme-init.js`, `dist/dimensions.ts` (every size as a number, components' own included), `dist/native.ts` and `dist/palette.ts`.
- `packages/core`: `@koi/core`, the platform-neutral layer: each component's props contract (`<Name>OwnProps`), `ChangeDetails<E>`, the UI copy (`strings`) and pure helpers. Plain TypeScript, no DOM. Rules in `docs/core.md`.
- `packages/react`: React web components. **Base UI** (`@base-ui/react`) for behavior and accessibility, **Panda CSS v2** for styling (recipes in `src/recipes/`).
- `packages/native`: `@koi/native`, Koi for Expo apps (iOS, Android, Expo web) on **Tamagui** 2.4.x. So far `createKoiConfig()`, a Tamagui config built entirely from `@koi/tokens` (tokens, a light/dark theme per palette, Koi's text styles as a font); components next. See its README.
- `apps/storybook`: Storybook 10 (`@storybook/react-vite`). `src/Introduction.mdx` is the landing page (an overview of Koi); `src/components/<Name>.stories.tsx` has each component's stories. The toolbar switches theme, font and palette. `pnpm shots` screenshots every story.
- `docs/spec/`: the design spec. `README.md` is the brand book; `components/<Name>.md` says how each component looks and behaves. **Read the relevant spec file before touching a component.**
- `reference/legacy-web/`: the previous implementation (React 18 + hand-written CSS). Frozen. Port from it; never import from it.

The current plan and status are in `docs/plan.md`. Update it as phases complete.

## Commands

- `pnpm tokens`: rebuild token outputs after editing `packages/tokens/src/tokens.json`.
- `pnpm codegen`: regenerate `packages/react/styled-system` after changing tokens, recipes or `panda.config.ts`.
- `pnpm dev`: tokens + codegen + Storybook on port 6006.
- `pnpm shots`: screenshot every story in light and dark into `apps/storybook/shots/<Component>-<Story>_<theme>.png` (`pnpm shots Button` for one component). Stories tagged `shot-viewport` (an open Dialog) are shot as the whole viewport. Look at the PNGs after any visual change. `KOI_PALETTE=rose pnpm shots` shoots another palette (files end in `_rose`).
- `pnpm build:storybook`: codegen + static Storybook in `apps/storybook/dist`; `pnpm deploy:storybook` publishes it to Cloudflare Workers (`apps/storybook/wrangler.jsonc`).
- `pnpm check`: contrast pairs, raw-color and raw-size scans, headless-leak scan, core-boundary scan and typecheck. Must pass before a commit.

## Rules

- **Tokens only.** Components use role tokens (`bg: 'surface'`, `color: 'text-muted'`, `borderColor: 'border-control'`), never palette steps (`primary.500`) and never literal colors. `scripts/check-raw-colors.mjs` enforces the second part.
- **Headless stays swappable.** Recipes never name the headless library's DOM: no `[data-…]` selectors, no `--anchor-width`-style variables, no preset conditions that also match `data-*` (`_active`, `_selected`, `_open`…). Use `state.*` / `vars.*` from `packages/react/src/recipes/headless.ts`, the only file that knows it's Base UI. Public props never expose Base UI types (change callbacks take Koi's `ChangeDetails` from `src/types.ts`). Full rules in `docs/headless.md`; `scripts/check-headless.mjs` enforces both parts.
- **Props start in core.** Every component's `<Name>Props` in `@koi/react` is `<Name>OwnProps` from `@koi/core` plus DOM attributes; a prop a native version would also need goes in core. Callbacks with a platform event take it as a type parameter (`ChangeDetails<E>`). Copy comes from `strings` in core, never a literal. `scripts/check-core.mjs` enforces it; details in `docs/core.md`.
- **Contrast:** text pairs ≥ 4.5:1 and control edges / focus rings / icons ≥ 3:1, in both themes. When a component puts a token on a new background, add the pair to `packages/tokens/src/contrast-pairs.json` and run `pnpm contrast`.
- **Generated files are never edited:** `packages/tokens/dist/`, `packages/react/styled-system/`. Change the source and rebuild.
- **Sizes:** 14px base (`body`). Controls `control-sm` 28 / `control-md` 36 / `control-lg` 44; components in one row share a size. `prose` (16px) is only for long-form reading.
- **No literal sizes.** Every size a component uses comes from tokens.json, because native builds the same components from the same numbers. Shared ones by token name (`height: 'control-md'`, `px: '3'`, `width: 'icon'`); a component's own from the `component` group via `@koi/tokens/dimensions` (`toPx(c.switch.trackWidth)` in recipes, `components.tooltip.offset` in TSX; `focusRing` in `recipes/dimensions.ts` for the focus outline). Add a missing one to tokens.json with a usage note. Only a web-only detail (a pseudo-element hit area, a baseline nudge, the press ripple) keeps a literal, marked `// koi-web-only: <why>`. `scripts/check-raw-sizes.mjs` enforces it.
- **Shape:** anything pressable is a pill (`radius-full`) except `shape="rounded"` (`radius-lg`, 8px). Dialog footers default to rounded through `ShapeProvider`; the dialog's 32px radius is that 8px plus its 24px padding (concentric). Cards and toasts `radius-panel` 24px, fields and alerts `radius-xl` 12px.
- **Depth:** no shadows on buttons, ever (the press ripple is a box-shadow that fades to nothing; it isn't depth). `shadow-raised` only on the active tab and switch thumbs; `shadow-float` only on things floating over the page (Dialog, Toast).
- **Motion:** color changes 150ms; moving things use the `spring` easing. Everything respects `prefers-reduced-motion`.
- **Copy** in components (labels, aria-labels) is Simplified Chinese ("关闭", "加载中"), from `strings` in `packages/core/src/strings.ts`. No emoji.
- **Dark mode** is `<html data-theme="dark">`; `theme-init.js` sets it from the OS. In Panda it's the `_dark` condition.
- **Palettes** swap `primary-*` and `accent-*` (tokens.json `color.palettes`; built-in `koi`, the default, and `rose`). On the web: `<html data-palette="rose">` or `koiSetPalette()` from `theme-init.js` (a built-in id, or a custom `{ primary, accent }` set as inline variables). Anywhere else: `createColors(palette, theme)` and `checkPalette(palette)` from `@koi/tokens/palette`. `pnpm contrast` checks every built-in palette; a user-made one must pass `checkPalette()` before it's applied. A role that should follow the palette points at a step (`{primary-950 / 0.8}` for one at an alpha), never at a literal color.
- **Font** is the system stack by default; `<html data-font="chill">` makes `sans` ChillRoundF (the `_fontChill` condition, `koiSetFont()` in `theme-init.js`). The faces are in `packages/tokens/fonts/` (`@koi/tokens/fonts.css`, copied from legacy). Components always use `fontFamily: 'sans'`, never the font name.
- **Font smoothing** stays `auto`. Never set `-webkit-font-smoothing: antialiased` / `-moz-osx-font-smoothing: grayscale`: on macOS it turns off the stroke thickening and leaves ChillRoundF thin and weak. Panda's preflight sets both on `html`, so `global-css.ts` puts them back to `auto`; `apps/storybook/src/index.css` does the same for Storybook's docs styles.
- Keep each component's public props compatible with the legacy API in `reference/legacy-web/components/index.d.ts` unless the spec says otherwise; note any break in `docs/plan.md`.

## Porting a component

Use `/port-component <Name>`. In short: read `docs/spec/components/<Name>.md` and the legacy CSS/JS → write the recipe in `packages/react/src/recipes/` and register it in `recipes/index.ts` → write the component on the matching Base UI part → add `apps/storybook/src/components/<Name>.stories.tsx` → `pnpm codegen && pnpm shots` and compare light and dark against the legacy example → `pnpm check` → update `docs/plan.md`.

## Gotchas

- Panda v2: ESM only, Node 22+. Presets are no longer added automatically (that's why `@pandacss/preset-base` is listed). After upgrades run `pnpm codegen` (it uses `--clean`) so stale `.mjs` files don't shadow the new `.js`.
- Library and Storybook import generated code as `@koi/react/styled-system/...` (aliased in `packages/react/tsconfig.json`, `apps/storybook/tsconfig.json` and `viteFinal` in `apps/storybook/.storybook/main.ts`). Don't use relative imports into `styled-system`, or Panda's `importMap` won't see them.
- React Native can't read `oklch()`; `dist/native.ts` already converts every color to hex/rgba.
- `@pandacss/preset-base` is its own package and is not a dependency of `@pandacss/dev`; without it in the root `devDependencies`, codegen fails with `preset_resolution_failed`.
- The Panda PostCSS plugin resolves `configPath` against `cwd`, not against the PostCSS config file. `apps/storybook/postcss.config.cjs` builds both from `__dirname`; keep them absolute.
- Panda doesn't extract `css()` from `.mdx`. Styled blocks on docs pages live in a `.tsx` file (`Showcase.tsx`) and are wrapped in `<Unstyled>`, or Storybook's docs styles leak into them.
- Docs pages follow the toolbar theme through `KoiDocsContainer` in `.storybook/preview.tsx`; `src/index.css` puts Koi's `page-bg` behind the docs and story previews.
- Recipe variants all land in one `@layer recipes.variants` sorted **alphabetically by variant name**, not in declaration order. When two variants set the same property (`iconOnly` and `size` both set padding), the later name wins. Put the override in `compoundVariants` (a later layer), even for a single-key condition: `{ iconOnly: true, css: {...} }`.
- Same inside `base`: condition selectors aren't emitted in the order you write them (`_disabled` came out after `&[aria-busy=true]`). Win by specificity (`&[aria-busy=true]:disabled`), not by order.
- The `dark` condition in the preset (`[data-theme=dark] &`) comes out as `[data-theme=dark] { --colors-… }` for semantic tokens, as intended.
- Panda's `globalCss` lands in `@layer base`, which loses to the token variables in `@layer tokens` whatever the specificity. That's why palettes are conditions on semantic tokens (`primary.*` and `accent.*` are semantic, with `_paletteRose`…), not global CSS.
- A palette has to sit on `<html>`, where the role variables are declared: a custom property is computed where it's declared, so `--colors-action: var(--colors-primary-700)` is already resolved before a nested `data-palette` could change `primary-700`.
- `build.mjs` loads `src/palette-kit.ts` with Node's `stripTypeScriptTypes` to cross-check the runtime against the build, so the kit must stay import-free and use erasable TypeScript only (no enums, no namespaces).
- The reduced-motion kill switch in `global-css.ts` uses `!important` in `@layer base`. With `!important` the layer order flips (earlier layers win), so a recipe can't override it, not even with its own `!important`. A component that has to keep moving gets left out in that rule's selector (as `.koi-spinner__svg` is).
- `pnpm cssgen` isn't a script; to read the full generated CSS run `npx panda cssgen --outfile <somewhere outside the repo>`.
- Recipe keys share a namespace with preset-base's patterns (`divider`, `stack`, `grid`, `circle`, `float`…). A clash only warns (`config_artifact_name_conflict`), so key the recipe differently (Divider's is `separator`) and keep the `className`.
- Recipe keys also can't be JS reserved words: Panda would emit `export const switch`. Switch's recipe is keyed `switchRecipe` (class stays `koi-switch`).
- A computed style key built from a template (`` [`&${state.checked}`] ``) needs `as const` (`` [`&${state.checked}` as const] ``); otherwise TypeScript widens it to `string`, which clashes with Panda's template-literal index signatures and fails typecheck.
- `'full'` is not a size token in this preset: `width: 'full'` comes out as the invalid `width: full`, silently. Write `'100%'`.
- A pair in `contrast-pairs.json` takes an optional third item, the ground a translucent color is composited over (`["info-text", "divider", "info-surface"]`); the default is `page-bg`.
- A hover or state rule that changes a variant's fill goes inside that variant, not in `base`: variants come out in a later layer, so even a more specific `base` hover loses to the variant's plain `bg`.
- Base UI `Tabs.Indicator` hides itself with the `hidden` attribute until it has measured the tab (that's what stops the slide-in on first paint), so its recipe must never set `display`.
- Base UI Toast: call `Toast.useToastManager()` inside the provider, not a `createToastManager()` instance; the instance only hears calls after the provider's effect subscribes, so a toast fired from a child's mount effect is lost.
