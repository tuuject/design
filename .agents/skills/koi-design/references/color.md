# Color

## Role tokens only

Every color in app or component code is a **role token**: `surface`, `text-muted`, `action`, `border-control`. Never a scale step (`primary.500`, `secondary-200`), never a literal (`#fff`, `rgba(...)`, `white`). `pnpm check` enforces this inside the repo; apply the same rule in consuming apps.

Scales (`primary-*`, `accent-*`, `secondary-*`, `warning-*`, `error-*`) are allowed in exactly two places: **illustration** and **chart series**.

Pick the role by what the thing *is*, not by what color you want:

| You're coloring… | Role |
| --- | --- |
| The page | `page-bg` |
| An object on the page (card, input, dialog, active tab) | `surface` |
| A quiet fill (track, ghost hover, disabled field) | `surface-muted` |
| Body / heading text | `text` |
| Secondary text (help, dates, descriptions) | `text-muted`, not `opacity`, not a lighter gray |
| Disabled text | `text-disabled` (never for content) |
| Brand-colored text or icon | `text-brand` |
| Card, tag, decorative outline | `border` |
| Input / checkbox / control edge | `border-control` (3:1 on `surface`), hover `border-control-hover` |
| Hairline separator | `divider` |
| Primary fill, current page, selected | `action` / `action-hover` + `on-action` |
| Tinted selection, avatar fallback | `action-subtle` + `on-action-subtle` |
| Checked control fill, progress bar | `control-checked` |
| Inline link | `link` + dashed `link-border` (use the Link component) |
| Small amber highlight | `highlight` + `on-highlight` |
| Status box | `<info|warning|error>-surface` / `-border` / `-text` triple |
| Hovered table row | `table-row-hover` |
| Nav item | `nav-item-text` / `nav-item-hover` / `nav-item-active` |
| Button fills | `<color>-solid` / `-soft` / `-fg` / `-edge` with their `on-` texts; use Button rather than these directly |

Every fill has a paired `on-*` text color. Use the pair; don't put `text` on `action-subtle` or white on `accent-solid`.

The full list, each with its `usage` line, is `color.tokens` in `packages/tokens/src/tokens.json`. When the table above doesn't cover a case, read the `usage` lines there instead of guessing.

## What the hues mean

- **Sky primary = action.** Primary buttons, current page, checked controls, tinted selection.
- **Amber accent = links and small highlights.** Inline links are amber with a dashed underline; nothing else clickable is amber. An `accent` Button is allowed **once per view**, never beside a solid `primary`. Amber never signals status.
- **Gray secondary = neutral.** Cancel, back, close; all neutral text and edges.
- **Status:** `info` (sky), `warning` (yellow), `error` (red). Always paired with an icon or a word, never color alone. There is no success color: success toasts use `text-brand`.

## Themes and palettes come for free

- Every role token already carries light and dark values. **Never write a per-theme override** (`_dark: {...}`, `dark:` classes, `useColorScheme` branches for colors). If a color looks wrong in one theme, the role is wrong.
- A palette swaps `primary-*` and `accent-*`; every role follows. Built-ins: `koi` (sky + amber, default) and `rose`. Koi must stay recognizable under any palette through shape, glass, roundness and motion, so don't lean on "it's blue" to make a design work.
- A user-supplied palette must pass `checkPalette()` before use; there's no auto-correction yet.

## Contrast

- Text 4.5:1; control edges, focus rings and icons 3:1; both themes, every built-in palette.
- Putting a role on a background it wasn't designed for (e.g. `text-muted` on `action-subtle`) needs a pair in `packages/tokens/src/contrast-pairs.json` (`text` group 4.5:1, `ui` group 3:1), then `pnpm contrast`.
- Details: `agent-doc/tokens.md`.
