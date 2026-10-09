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
| Button, IconButton | plain `<button>` | **Done**, checked against legacy in both themes. `loading` shows a Spinner (sm, md on lg buttons), as in legacy. `href` renders an `<a>` with the anchor attributes (`target`, `rel`, `download`…) and an anchor `ref`; a disabled or loading link falls back to a disabled `<button>`, as in legacy. IconButton takes `href` too (legacy's didn't). No `render`/`asChild` for router links yet. |
| Spinner | plain element | **Done**, checked against legacy. Same props. Under reduced motion it turns at half speed (`spin-slow`, 1.6s) instead of stopping; legacy didn't handle reduced motion for it. New durations `spin` / `spin-slow` in `motion.mjs`. |
| Skeleton | plain element | **Done**, checked in both themes (shimmer frozen mid-sweep: one band crosses every skeleton). Same props (`as`, `children`, HTML attributes). Synced shimmer via `background-attachment: fixed`; reduced motion drops the band and keeps the flat fill. Change from legacy: bare text children are hidden too (`color: transparent`); legacy's `> * { visibility: hidden }` only hid element children, so `<Skeleton>示例标题</Skeleton>` showed its text. The fill uses `backgroundColor`, not `bg`: Panda turns `bg` into the `background` shorthand, which would reset the gradient if it ever sorted after it. |
| Badge | plain element | **Done**, checked in both themes. Same props (`tone`, `dot`, `children`, `className`), plus HTML span attributes. Slot recipe (`root`, `dot`); all six tone pairs were already in `contrast-pairs.json`. |
| Divider | Base UI `Separator` | **Done**, checked in both themes. Same props. Horizontal is now a `<div role="separator">` (was `<hr>`); vertical is still an inline `<span>` (`render`). Change from legacy: a labeled divider is named by its label (`aria-labelledby`), since a separator's children are presentational and legacy's label text never reached screen readers. The recipe is keyed `separator` (class stays `koi-divider`) because preset-base already has a `divider` pattern; codegen warns `config_artifact_name_conflict` otherwise. |
| Card | plain element | **Done**, checked in both themes. Same props (`variant`, `title`, `description`, `media`, `footer`, `padding`), plus div attributes. Slot recipe (`root`, `media`, `head`, `title`, `description`, `body`, `footer`). New contrast pairs: `text-muted` on `surface-muted` (filled card description), `text` and `text-muted` on `surface-glass` (composited over `page-bg`; over imagery the consumer has to check). |
| Alert | plain element | **Done**, checked in both themes. Same props (`tone`, `title`, `children`, `icon`, `action`, `onClose`, `className`), plus div attributes (a passed `role` overrides the default). Slot recipe (`root`, `icon`, `content`, `title`, `body`, `action`, `close`); the close button is the legacy 24px round button in the tone color (hover `divider`), not an IconButton. Change from legacy: the 40px right padding for the close button is only added when `onClose` is set (`closable` variant); legacy reserved it always. New icons `InfoIcon`, `WarningIcon`, `ErrorIcon`. New contrast pairs: `text` on the three tone surfaces (body), `focus-ring` and `<tone>-text` over `divider` (hovered close) on them, and `<color>-fg` / `<color>-edge` on them for outline/ghost action buttons. Soft and solid buttons aren't checked there (soft fills sink into the dark tone surfaces), so stories use outline/ghost in the alert's color. |
| Link | plain element | **Done**, checked in both themes, hover and focus included. Same props (`external` plus every anchor attribute; `ref` reaches the `<a>`). Slot recipe (`root`, `external`, `srOnly`): dashed 2px `link-border` bottom border, `link-hover-bg` + `link-hover-border` on hover, the shared 2px `focus-ring` outline. The 2px corner radius of the hover tint stays a literal (`[2px]`); no radius token is that small. `external` sets `target`/`rel` before the passed props, so a passed `target` or `rel` still wins, as in legacy; the screen-reader note is legacy's "（在新窗口打开）". New contrast pair: `link` on `surface-muted` (links in a filled Card). |
| Field, Input, Textarea | Base UI `Field` (+ `Input`) | **Done**, checked in both themes, hover and focus included. Base UI's `Field.Root` / `Label` / `Error` / `Description` replace the hand-written wiring: the label points at the control, `aria-describedby` lists the error then the help, and `aria-invalid` is set while `error` is non-empty. Same props: Field (`label`, `help`, `error`, `required`, `optional`, `id`, `children`, `className`, plus div attributes; `id` is still the control's id, carried with `required` through a small Koi context since Base UI has no slot for either), Input (`size`, `invalid`, `iconStart`, `iconEnd` plus input attributes; `className` and the edge are on the wrapper `<span>`, `ref` reaches the `<input>`), Textarea (`invalid`, `rows` default 4, plus textarea attributes). Both work standalone too (give them an `aria-label`). Textarea is `Field.Control` rendering a `<textarea>` (Base UI has no textarea part). Slot recipes `field`, `input`; plain recipe `textarea`. Focus is legacy's 2px edge (1px border + 1px `box-shadow` in `focus-ring`); focused and invalid, both are `error-control`. States are read off the control (`:has(> input[aria-invalid=true])`, `:has(> input:disabled)`), so the `invalid` prop, a Field error and Base UI's own native validation all style the same, and the selectors are written not to overlap so Panda's emit order can't matter. Changes from legacy: the error is `Field.Error` (a `<p>`, as before) and its icon is 12px as the spec says; disabled placeholders and icons fade to `text-disabled` with the value (legacy left them `text-muted`, darker than the disabled value). Behavior Base UI adds: inside a Field, pressing Enter (or blurring with `validationMode`) runs native constraint validation, so e.g. `type="email"` with a bad value gets the red edge and `aria-invalid` even without an `error` message (`required` only counts once the value was edited). The 6px gap between the parts stays a literal (`[6px]`); no spacing token is 6px. New icon `SearchIcon` (used in the Input stories). New contrast pairs: `error-text` on `surface-muted`, and `error-control` on `page-bg`, `border-control` / `error-control` / `focus-ring` on `surface-muted` (fields in a filled Card). |
| Checkbox, RadioGroup, Switch | Base UI `Checkbox`, `RadioGroup`+`Radio`, `Switch` | Springy check/dot/thumb motion on `spring` easing. |
| Select | Base UI `Select` | Behavior change from the legacy native `<select>`: a custom listbox. Decide whether that's wanted. |
| Tabs | Base UI `Tabs` | `Tabs.Indicator` could animate the active pill, which the legacy version can't. 36px tabs, 44px track. |
| Tooltip, Avatar, Progress | Base UI `Tooltip`, `Avatar`, `Progress` | |
| Toast | Base UI `Toast` (toast manager) | Keep the legacy API shape (`useToast().toast({ tone, title, description })`) as a thin wrapper. No border, keep `shadow-float`, `radius-panel`. |
| Dialog | Base UI `Dialog` | **Done**, checked against legacy in both themes. Change from legacy: the popup scales from 96% around its center over 300ms (new `dialog` duration in `motion.mjs`) instead of rising 8px over 400ms, and the backdrop fades over the same 300ms (was `overlay`, 200ms). Add the alert-dialog variant (`@base-ui/react/alert-dialog`) and a "can't dismiss by clicking outside" option. |
| Pagination, Tag | plain | |
| NavMenu | vertical: Base UI `Collapsible`; horizontal: Base UI `Navigation Menu`, or `Menubar` + `Menu` for the cascading flyouts | The hardest one. Three levels deep, flyouts flip near the window edge. Base UI's positioning should replace the hand-written flip logic. |

New components that Base UI makes cheap and the spec lists as "not included": Menu (dropdown), Combobox, Popover. Add them only after the port.

## Phase 2: package and document

- Publish setup: Panda v2's `panda lib` / `designSystem` config, or ship source plus the preset. Decide which.
- ~~Keep the playground as the visual test bed; add Storybook only if it earns its keep.~~ **Done 2026-10-10:** the playground is replaced by Storybook 10.6 (`apps/storybook`). The landing page `Introduction.mdx` introduces Koi; each component has autodocs and stories; the toolbar switches theme and font, and docs pages follow it. `pnpm shots` now screenshots every story (`<Component>-<Story>_<theme>.png`). Still open: publishing the static build (`pnpm --filter storybook build` → `apps/storybook/dist`).
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

- Font: ChillRoundF (web subsets exist; native needs a full font file) or the system stack currently in `tokens.json`. Both work now: `<html data-font="chill">` (or `koiSetFont('chill')`, saved in localStorage `koi-font`) switches `sans` to ChillRoundF, and Storybook's toolbar has a switch. `KOI_FONT=chill pnpm shots` screenshots with it. Default stays system until this is decided. Things to weigh:
  - ChillRoundF's 700 is only a little heavier than its 400, so headings, labels and buttons read much less bold than with the system font.
  - The system font costs nothing: with it, no woff2 is fetched. The old playground page with ChillRoundF fetched 13 subsets.
  - The legacy `--font-sans` never included ChillRoundF (fonts.css declared the face but nothing used it), so `reference/legacy-web/example.html` renders in the system font too. It's not a ChillRoundF reference.
- Select: custom listbox (Base UI) or keep the native `<select>`.
- Native stack (Phase 3).
