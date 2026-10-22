# Foundations: type, shape, depth, space, motion, icons

## Type

- One family: `sans`. Components and pages always write `fontFamily: 'sans'` (or nothing), never a font name. `<html data-font="chill">` swaps it to ChillRoundF; the default is the system stack.
- **14px is the base.** `body` (14/20) is all UI text. Use the named text styles, never a raw `fontSize`:

  | Style | Size | For |
  | --- | --- | --- |
  | `display` | 30 | One per page at most: hero / product name |
  | `heading-1` | 24 | Page titles |
  | `heading-2` | 20 | Section titles, Dialog titles |
  | `heading-3` | 16 | Card titles, sub-sections |
  | `body` | 14 | Everything by default |
  | `label` | 14 bold | Field labels, table headers, alert titles |
  | `small` | 12 | Help, descriptions, tooltips, chart text |
  | `caption` | 12 bold | Badges only |
  | `prose` | 16 / 1.75 | Long-form reading only (articles, docs) |

- Two weights exist: 400 and 700. Asking for 600 renders 700.
- `text-autospace: normal` is on the body. Don't type spaces between Chinese and Latin by hand.
- Font smoothing stays `auto`. Never `antialiased`: it thins ChillRoundF on macOS.
- Koi has no logo. A product name is set in `display` (or `heading-3` in a NavMenu brand slot).

## Shape

Roundness is the identity. The vocabulary is fixed:

| Radius | Px | Used by |
| --- | --- | --- |
| `sm` | 6 | Checkbox boxes only |
| `lg` | 8 | Buttons / IconButtons (default `rounded`), tooltips, options in a panel, images in text |
| `xl` | 12 | Inputs, selects, textareas, alerts, nav items, square avatars, popover panels |
| `panel` | 24 | Cards, toasts |
| `dialog` | 32 | Dialogs (8px button + 24px padding: concentric) |
| `bar` | 36 | Floating bars (the blog's nav pill) |
| `full` | — | Tabs, tags, badges, switches, round avatars, pill buttons |

- Buttons are **rounded (8px) by default**. `shape="pill"`, or a `<ShapeProvider shape="pill">` around a page, gives the blog's softer voice. Dialog footers and table cells re-provide `rounded` even inside a pill page.
- **One shape per group of buttons.** Different groups may differ (rounded row actions above a pill Pagination is fine).
- Tabs, tags, badges and Switch are **always** pills.
- Nested corners are concentric: outer radius = inner radius + padding between them. If you change a panel's padding or its buttons' shape, change its radius with it.
- No hairline radii, no radius invented between the steps. `radius-2xl` (16) exists as a spare; prefer a named use above.

## Surface and depth

- **Depth comes from translucency, not shadows.** Cards have no shadow.
- Shadows exist in three places only: `raised` (active tab, switch thumb), `float` (Dialog, Toast, popover panels: things over the page), `float-soft` (docked floating chrome). **Buttons never have a shadow**; the press ripple fades to nothing and doesn't count.
- Glass: `surface-glass` + `blur-panel` for a content panel **over imagery or color** (the glass Card). `surface-glass-tint` + `blur-float` for floating chrome (Toast, nav pill). Never glass on a flat background as decoration.
- Card variants: `outlined` (default; `surface` + `border`), `filled` (`surface-muted`), `glass`. **Never nest cards**, and never put a card around something that brings its own frame.
- Prefer whitespace to a Divider. Add a divider only when space alone doesn't separate the groups.

## Size and space

- Controls come in three heights: `control-sm` 28, `control-md` 36 (default), `control-lg` 44. **Everything sharing a row uses the same size.**
- Icons: `icon` 16 beside 14px text, `icon-sm` 14 in small controls and tags, `icon-xs` 12 beside 12px text, `icon-lg` 18 beside 16px titles.
- Spacing is the 4px scale, `space-1`…`space-16`. Meanings:
  - `2` inside controls, icon-to-label
  - `4` between fields
  - `5` content padding on mobile, card padding
  - `6` content padding from `md` up, dialog padding
  - `8` between groups and between cards on content pages
  - `10` / `12` between list items (mobile / `md`), `16` between page sections
- Page padding is uniform on all sides and pairs by breakpoint: `4` → `md: 6` in dense apps (Admin), `5` → `md: 6` on content pages. Gaps between sibling panels match the gutter.
- A reading column is at most `content-max` (56rem).
- When in doubt, go one step looser.

## Motion

- Color and border changes: 150ms (`fast`). Every interactive color change transitions.
- Things that move use the **spring** curve `cubic-bezier(.47,1.64,.41,.8)`: switch thumbs and progress over 400ms, check marks and radio dots 250ms, dialogs scaling in from 96% around their center over 300ms, toasts rising in, chevrons turning over.
- Things anchored to a viewport edge (drawer, side sheet) slide on `out` over 200ms instead: the spring's overshoot would expose the gap behind them.
- Overlays fade over 150–200ms; the Dialog backdrop fades 300ms with its panel.
- Everything stops under `prefers-reduced-motion`. The web global switch covers components; your own animations must respect it too.
- Durations and easings are named in Panda (`transitionDuration: 'fast'`, `transitionTimingFunction: 'spring'`); the values live in `packages/tokens/scripts/motion.mjs` for now. Don't write raw ms or bezier values.

## Icons

- Icons are **Font Awesome Free Solid**, as Iconify data (`{ body, width, height }`) rendered by `Icon` from `@koi/react/icons`, drawn in `currentColor`. Import from `@iconify-icons/fa7-solid/<name>`; see `apps/admin/src/components/icons.tsx`.
- A missing icon may come from another Iconify set or be hand-drawn in the same format. **Pick a filled one** so a row keeps one weight. Brand marks come from a brand set (e.g. Simple Icons), which is filled too.
- Components' own icons (close, check, chevrons, sort, search, external, info / warning / error / success) are exported by name; reuse them.
- Size with the icon tokens, not `em`.
- No emoji, no icon fonts. Icon-only controls need an accessible name (IconButton's `label`, plus a Tooltip when the meaning isn't obvious).

## Focus

Every interactive element shows a 2px `focus-ring` outline at a 2px offset. Fields draw the ring on their edge; NavMenu items draw it just inside.
