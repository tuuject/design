# Koi

Koi is a soft, rounded design system (pill controls, frosted glass, sky-blue actions, amber links) that started as tcdw's Koi Astro blog theme. This repo rebuilds it as packages:

- `packages/tokens`: the single source of truth, `src/tokens.json`. `scripts/build.mjs` generates `dist/tokens.css`, `dist/panda-preset.js`, `dist/theme-init.js` and `dist/native.ts`.
- `packages/react`: React web components. **Base UI** (`@base-ui/react`) for behavior and accessibility, **Panda CSS v2** for styling (recipes in `src/recipes/`).
- `packages/native`: React Native, not started; the stack isn't chosen (see `docs/plan.md`).
- `apps/storybook`: Storybook 10 (`@storybook/react-vite`). `src/Introduction.mdx` is the landing page (an overview of Koi); `src/components/<Name>.stories.tsx` has each component's stories. The toolbar switches theme and font. `pnpm shots` screenshots every story.
- `docs/spec/`: the design spec. `README.md` is the brand book; `components/<Name>.md` says how each component looks and behaves. **Read the relevant spec file before touching a component.**
- `reference/legacy-web/`: the previous implementation (React 18 + hand-written CSS). Frozen. Port from it; never import from it.

The current plan and status are in `docs/plan.md`. Update it as phases complete.

## Commands

- `pnpm tokens`: rebuild token outputs after editing `packages/tokens/src/tokens.json`.
- `pnpm codegen`: regenerate `packages/react/styled-system` after changing tokens, recipes or `panda.config.ts`.
- `pnpm dev`: tokens + codegen + Storybook on port 6006.
- `pnpm shots`: screenshot every story in light and dark into `apps/storybook/shots/<Component>-<Story>_<theme>.png` (`pnpm shots Button` for one component). Stories tagged `shot-viewport` (an open Dialog) are shot as the whole viewport. Look at the PNGs after any visual change.
- `pnpm check`: contrast pairs, raw-color scan and typecheck. Must pass before a commit.

## Rules

- **Tokens only.** Components use role tokens (`bg: 'surface'`, `color: 'text-muted'`, `borderColor: 'border-control'`), never palette steps (`primary.500`) and never literal colors. `scripts/check-raw-colors.mjs` enforces the second part.
- **Contrast:** text pairs ≥ 4.5:1 and control edges / focus rings / icons ≥ 3:1, in both themes. When a component puts a token on a new background, add the pair to `packages/tokens/src/contrast-pairs.json` and run `pnpm contrast`.
- **Generated files are never edited:** `packages/tokens/dist/`, `packages/react/styled-system/`. Change the source and rebuild.
- **Sizes:** 14px base (`body`). Controls `control-sm` 28 / `control-md` 36 / `control-lg` 44; components in one row share a size. `prose` (16px) is only for long-form reading.
- **Shape:** anything pressable is a pill (`radius-full`) except `shape="rounded"` (`radius-lg`, 8px). Dialog footers default to rounded through `ShapeProvider`; the dialog's 32px radius is that 8px plus its 24px padding (concentric). Cards and toasts `radius-panel` 24px, fields and alerts `radius-xl` 12px.
- **Depth:** no shadows on buttons, ever. `shadow-raised` only on the active tab and switch thumbs; `shadow-float` only on things floating over the page (Dialog, Toast).
- **Motion:** color changes 150ms; moving things use the `spring` easing. Everything respects `prefers-reduced-motion`.
- **Copy** in components (labels, aria-labels) is Simplified Chinese ("关闭", "加载中"). No emoji.
- **Dark mode** is `<html data-theme="dark">`; `theme-init.js` sets it from the OS. In Panda it's the `_dark` condition.
- **Font** is the system stack by default; `<html data-font="chill">` makes `sans` ChillRoundF (the `_fontChill` condition, `koiSetFont()` in `theme-init.js`). The faces are in `packages/tokens/fonts/` (`@koi/tokens/fonts.css`, copied from legacy). Components always use `fontFamily: 'sans'`, never the font name.
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
- The reduced-motion kill switch in `global-css.ts` uses `!important` in `@layer base`. With `!important` the layer order flips (earlier layers win), so a recipe can't override it, not even with its own `!important`. A component that has to keep moving gets left out in that rule's selector (as `.koi-spinner__svg` is).
- `pnpm cssgen` isn't a script; to read the full generated CSS run `npx panda cssgen --outfile <somewhere outside the repo>`.
- Recipe keys share a namespace with preset-base's patterns (`divider`, `stack`, `grid`, `circle`, `float`…). A clash only warns (`config_artifact_name_conflict`), so key the recipe differently (Divider's is `separator`) and keep the `className`.
- Recipe keys also can't be JS reserved words: Panda would emit `export const switch`. Switch's recipe is keyed `switchRecipe` (class stays `koi-switch`).
- `'full'` is not a size token in this preset: `width: 'full'` comes out as the invalid `width: full`, silently. Write `'100%'`.
- A pair in `contrast-pairs.json` takes an optional third item, the ground a translucent color is composited over (`["info-text", "divider", "info-surface"]`); the default is `page-bg`.
- A hover or state rule that changes a variant's fill goes inside that variant, not in `base`: variants come out in a later layer, so even a more specific `base` hover loses to the variant's plain `bg`.
- Base UI `Tabs.Indicator` hides itself with the `hidden` attribute until it has measured the tab (that's what stops the slide-in on first paint), so its recipe must never set `display`.
- Base UI Toast: call `Toast.useToastManager()` inside the provider, not a `createToastManager()` instance; the instance only hears calls after the provider's effect subscribes, so a toast fired from a child's mount effect is lost.
