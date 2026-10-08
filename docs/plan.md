# Plan

## Phase 0: make the toolchain run (done 2026-10-08)

Result: tokens, codegen, dev server, shots and `pnpm check` all run. Button and Dialog match the legacy example in both themes, except the system font (see Open decisions) and the missing loading Spinner.

- `pnpm up -r --latest`: Vite 7.3 → 8.3, `@vitejs/plugin-react` 5.2 → 6.1, TypeScript 6.0 → 7.0 (native `tsc`, no config changes needed), Panda 2.1.2, Base UI 1.8.0, React 19.3, Playwright 1.63 (1.64 exists; pnpm held it back, probably its minimum-release-age policy).
- Added `@pandacss/preset-base` to the root devDependencies (it was missing; codegen failed without it).
- `apps/playground/postcss.config.cjs`: absolute `configPath`/`cwd` (the plugin resolved the relative path against `cwd` and couldn't find the config).
- Button recipe: icon-only padding moved to `compoundVariants` (IconButton was 40px wide instead of square), and the loading opacity now beats the disabled one (0.85, as in legacy).
- Dark mode output checked: `[data-theme=dark] { --colors-surface: … }`. No change to `build.mjs` needed.

Original checklist:

1. `pnpm install`, then `pnpm up -r --latest` and note what changed (Panda v2, Base UI, Vite, plugin-react, Playwright).
2. `pnpm tokens && pnpm codegen`. Open `packages/react/styled-system/styles.css` (or the generated tokens CSS) and confirm dark mode came out as `[data-theme=dark] { --colors-surface: … }`. If Panda emitted something else for the `dark` condition, fix the `conditions` block in `packages/tokens/scripts/build.mjs`, not the generated file.
3. `pnpm dev`: the playground should show the Button matrix and open the Dialog.
4. `pnpm shots`, then look at `apps/playground/shots/*.png` in both themes and compare with `reference/legacy-web/example.html` (open it in a browser, or screenshot it the same way).
5. `pnpm check` (contrast, raw colors, typecheck) passes.
6. Commit. Write anything surprising about Panda v2 or Base UI into CLAUDE.md under "Gotchas".

## Phase 1: port the web components

Order: simple and self-contained first, then the Base UI ones, then the composites. One component per PR or commit.

| Component | Behavior from | Notes |
| --- | --- | --- |
| Button, IconButton | plain `<button>` | **Done**, checked against legacy in both themes. `loading` shows a Spinner (sm, md on lg buttons), as in legacy. |
| Spinner | plain element | **Done**, checked against legacy. Same props. Under reduced motion it turns at half speed (`spin-slow`, 1.6s) instead of stopping; legacy didn't handle reduced motion for it. New durations `spin` / `spin-slow` in `motion.mjs`. |
| Skeleton, Badge, Divider, Card, Alert, Link | plain elements | Skeleton: keep the synced shimmer (`background-attachment: fixed`) and the reduced-motion fallback. Divider can use Base UI `Separator`. |
| Field, Input, Textarea | Base UI `Field` (+ `Input`) | Field replaces the hand-written id / `aria-describedby` / `aria-invalid` wiring. |
| Checkbox, RadioGroup, Switch | Base UI `Checkbox`, `RadioGroup`+`Radio`, `Switch` | Springy check/dot/thumb motion on `spring` easing. |
| Select | Base UI `Select` | Behavior change from the legacy native `<select>`: a custom listbox. Decide whether that's wanted. |
| Tabs | Base UI `Tabs` | `Tabs.Indicator` could animate the active pill, which the legacy version can't. 36px tabs, 44px track. |
| Tooltip, Avatar, Progress | Base UI `Tooltip`, `Avatar`, `Progress` | |
| Toast | Base UI `Toast` (toast manager) | Keep the legacy API shape (`useToast().toast({ tone, title, description })`) as a thin wrapper. No border, keep `shadow-float`, `radius-panel`. |
| Dialog | Base UI `Dialog` | **Done**, checked against legacy in both themes. Add the alert-dialog variant (`@base-ui/react/alert-dialog`) and a "can't dismiss by clicking outside" option. |
| Pagination, Tag | plain | |
| NavMenu | vertical: Base UI `Collapsible`; horizontal: Base UI `Navigation Menu`, or `Menubar` + `Menu` for the cascading flyouts | The hardest one. Three levels deep, flyouts flip near the window edge. Base UI's positioning should replace the hand-written flip logic. |

New components that Base UI makes cheap and the spec lists as "not included": Menu (dropdown), Combobox, Popover. Add them only after the port.

## Phase 2: package and document

- Publish setup: Panda v2's `panda lib` / `designSystem` config, or ship source plus the preset. Decide which.
- Keep the playground as the visual test bed; add Storybook only if it earns its keep.
- Move motion values from `packages/tokens/scripts/motion.mjs` into `src/tokens.json`.

## Phase 3: React Native

Decide the stack first; tokens are already there (`@koi/tokens/native`). See `packages/native/README.md` for what doesn't translate.

| Option | For | Against |
| --- | --- | --- |
| rn-primitives (the layer under React Native Reusables) + NativeWind | Radix-like headless API; NativeWind's Tailwind classes fit Koi's Tailwind origins | Two different headless libraries across web (Base UI) and native |
| Tamagui | One component set for web and native, its own compiler | Would compete with Panda + Base UI on web rather than sit beside them |
| Plain RN + a styling layer (e.g. Unistyles) | Fewest moving parts | Hand-roll accessibility and behavior |

Whatever the choice: match the web **props API** (Button `color` × `variant` × `size` × `shape`, Dialog `footer`, etc.), not the implementation.

## Phase 4: sync back

When the repo is on GitHub, the Koi design-system artifact in Claude can sync from it, so the visual spec there stays current.

## Open decisions

- Font: ChillRoundF (web subsets exist; native needs a full font file) or the system stack currently in `tokens.json`.
- Select: custom listbox (Base UI) or keep the native `<select>`.
- Native stack (Phase 3).
