---
name: koi-design
description: Koi's visual design language for anything built on or inside the Koi design system — pages, screens and dashboards composed from @koi/react (Panda CSS) or @koi/native (Tamagui), the Admin template, the blog, Bilisound screens, and new components in this repo. Covers role tokens over raw scales, sky action / amber link color semantics, the 14px base and type styles, rounded-vs-pill shape rules, translucency instead of shadows, spring motion, Font Awesome Solid icons, component selection, dashboard composition, Chinese UI copy, and a pre-delivery review checklist. Use when designing, styling, restyling or reviewing any UI that uses Koi, or when the user mentions Koi design, Koi 风格, or Koi tokens. Takes precedence over the generic web-design-taste skill wherever the two disagree. Do NOT use for porting a legacy component (use port-component) or for copywriting beyond UI strings.
---

# Koi Design

> Soft, rounded, roomy. Sky means action, amber means link. Depth comes from translucency, not shadows. Roundness and springy motion are the identity; a palette swap never touches them.

## Ground rules

- **This skill is a map, not the source of truth.** The sources, in precedence order:
  1. Explicit instructions in the current conversation.
  2. `docs/spec/components/<Name>.md` for the component in question.
  3. `docs/spec/README.md` (the brand book).
  4. The `usage` line of each token in `packages/tokens/src/tokens.json`.
  5. AGENTS.md's Design Invariants.
  6. This file.

  Read 2 and 3 before designing anything non-trivial. If this file disagrees with a source above it, the source wins; fix this file in the same change.
- **Koi outranks `web-design-taste`.** That skill is the general taste Koi grew out of. Where it agrees with Koi it still applies (see [Carried over](#carried-over-from-web-design-taste)); where it conflicts, Koi wins (see [Overridden](#overridden-from-web-design-taste)). Don't load both and average them.
- **Use a component before styling a `div`.** Koi already decided how buttons, fields, cards, tables and overlays look. A hand-styled lookalike drifts the moment the component changes.
- When the user overrides a rule here, that is new evidence: offer to update the spec (if it's a system rule) or this skill (if it's composition taste).

## Color

### Role tokens only

Every color in app or component code is a **role token** — `surface`, `text-muted`, `action`, `border-control`. Never a scale step (`primary.500`, `secondary-200`), never a literal (`#fff`, `rgba(...)`, `white`). `pnpm check` enforces this inside the repo; apply the same rule in consuming apps.

Scales (`primary-*`, `accent-*`, `secondary-*`, `warning-*`, `error-*`) are allowed in exactly two places: **illustration** and **chart series**.

Pick the role by what the thing *is*, not by what color you want:

| You're coloring… | Role |
| --- | --- |
| The page | `page-bg` |
| An object on the page (card, input, dialog, active tab) | `surface` |
| A quiet fill (track, ghost hover, disabled field) | `surface-muted` |
| Body / heading text | `text` |
| Secondary text (help, dates, descriptions) | `text-muted` — not `opacity`, not a lighter gray |
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

Every fill has a paired `on-*` text color. Use the pair; don't put `text` on `action-subtle` or white on `accent-solid`.

### What the hues mean

- **Sky primary = action.** Primary buttons, current page, checked controls, tinted selection.
- **Amber accent = links and small highlights.** Inline links are amber with a dashed underline; nothing else clickable is amber. An `accent` Button is allowed **once per view**, never beside a solid `primary`. Amber never signals status.
- **Gray secondary = neutral.** Cancel, back, close; all neutral text and edges.
- **Status:** `info` (sky), `warning` (yellow), `error` (red). Always paired with an icon or a word — never color alone. There is no success color: success toasts use `text-brand`.

### Themes and palettes come for free

- Every role token already carries light and dark values. **Never write a per-theme override** (`_dark: {...}`, `dark:` classes, `useColorScheme` branches for colors). If a color looks wrong in one theme, the role is wrong.
- A palette swaps `primary-*` and `accent-*`; every role follows. Built-ins: `koi` (sky + amber, default) and `rose`. Koi must stay recognizable under any palette through shape, glass, roundness and motion — so don't lean on "it's blue" to make a design work.
- Putting a role on a background it wasn't designed for (e.g. `text-muted` on `action-subtle`) needs a contrast pair in `packages/tokens/src/contrast-pairs.json`: text 4.5:1, UI edges and icons 3:1, both themes, every palette.

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
- Font smoothing stays `auto`. Never `antialiased`.
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
- Shadows exist in three places only: `raised` (active tab, switch thumb), `float` (Dialog, Toast, popover panels — things over the page), `float-soft` (docked floating chrome). **Buttons never have a shadow**; the press ripple fades to nothing and doesn't count.
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
- The only breakpoint today is `md` (768px), in `panda.config.ts`. Design the phone layout as its own composition: elements may move between breakpoints, not just stack.

## Motion

- Color and border changes: 150ms (`fast`). Every interactive color change transitions.
- Things that move use the **spring** curve `cubic-bezier(.47,1.64,.41,.8)`: switch thumbs and progress over 400ms, check marks and radio dots 250ms, dialogs scaling in from 96% around their center over 300ms, toasts rising in, chevrons turning over.
- Things anchored to a viewport edge (drawer, side sheet) slide on `out` over 200ms instead — the spring's overshoot would expose the gap behind them.
- Overlays fade over 150–200ms; the Dialog backdrop fades 300ms with its panel.
- Everything stops under `prefers-reduced-motion` (the web global switch handles components; your own animations must respect it too).
- Durations and easings are named in Panda (`transitionDuration: 'fast'`, `transitionTimingFunction: 'spring'`). Don't write raw ms or bezier values.

## Icons

- Icons are **Font Awesome Free Solid**, as Iconify data (`{ body, width, height }`) rendered by `Icon` from `@koi/react/icons`, drawn in `currentColor`. Import from `@iconify-icons/fa7-solid/<name>`.
- A missing icon may come from another Iconify set or be hand-drawn in the same format. **Pick a filled one** so a row keeps one weight. Brand marks come from a brand set (e.g. Simple Icons), which is filled too.
- Components' own icons (close, check, chevrons, sort, search, external, info / warning / error / success) are exported by name; reuse them.
- Size with the icon tokens, not `em`.
- No emoji, no icon fonts. Icon-only controls need an accessible name (IconButton's `label`, plus a Tooltip when the meaning isn't obvious).

## Choosing components

| Need | Use | Not |
| --- | --- | --- |
| Any action | Button (`color` = meaning, `variant` = loudness) | a styled link |
| Link inside running text | Link (amber, dashed) | Button |
| Quiet standalone action | Button `ghost` | Link |
| Compact familiar action | IconButton (+ Tooltip if unclear) | an unlabeled icon |
| Status or count, not clickable | Badge | Tag |
| Keyword, filter chip, removable value | Tag | Badge |
| Persistent message tied to content | Alert | Toast |
| Quick confirmation that disappears | Toast | Alert |
| Decision needing full attention | Dialog (`role="alertdialog"` for confirms) | Toast, inline content |
| Field-level problem | Field `error` | Alert |
| Setting that applies immediately | Switch | Checkbox |
| Choice applied by a Save button | Checkbox | Switch |
| 2–5 visible exclusive options | RadioGroup | Select |
| Short list (≤ ~15) | Select (native) | SelectPanel |
| Groups, rich rows, search | SelectPanel | Select |
| 2–6 peer views of one content | Tabs | Tabs for page navigation |
| App navigation | NavMenu (not yet ported; Admin has a stopgap Sidebar) | Tabs |
| Known layout, unknown data | Skeleton | Spinner |
| Short unmeasured wait | Spinner | Progress |
| Measurable work | Progress | Spinner |
| Records to scan across columns | DataTable, or Table parts for sort / selection | a grid of cards |

### Buttons

- `color`: `primary` (main action), `accent` (one highlight per view), `secondary` (cancel / back / close), `warning` (consequences worth a second look), `error` (destructive, usually confirmed in a Dialog).
- `variant`: `solid` > `soft` > `outline` > `ghost`. **One solid per group.** Never two solids side by side.
- Labels are short Chinese verbs on one line. Don't signal danger by color alone — say it ("删除").
- Dialog footer order: cancel (`secondary ghost`), then the confirming solid (`primary`, or `error` when it destroys something).
- Table row actions: `sm ghost` Buttons with no gap between them, end-aligned, group pulled `-2` outward so the last label lines up with the header. Icon-only row actions are `md` IconButtons in a `paddingBlock="none"` cell.

## Dashboards and admin pages

The Admin template (`apps/admin`) is the reference composition. Read its routes before inventing a layout.

- **A list page puts its table straight on the page**, so a long list isn't boxed in. A table that shares the page with other panels (a dashboard's recent orders) goes in a Card.
- **One frame per area, never a frame in a frame.** No card of cards, no card around a component that brings its own border.
- Page header: `heading-1` title + optional `body` `text-muted` description, `space-6` below (`PageHeader`).
- **Siblings in a row line up.** Same header height, same body shape (label → value), same value size; don't give only one sibling a description line. Measure in a screenshot; don't eyeball.
- Filter bars lay out by their own width (container queries), not the viewport, so a collapsed sidebar doesn't break the columns. Search is manual (button / Enter), not per keystroke.
- URL is the state for filters and paging.
- **Charts**: series may use scale steps (the only place besides illustration). Axis ticks, legends and tooltips are `small` (12px) in `text-muted`; series color goes on a dot or the mark, never on label text. Tooltips look like Koi popovers: `surface`, `border`, `radius-xl`, `shadow-float`. Values use `tabular-nums` and thousands separators. Gridlines and cursor lines use `divider`.
- Loading: skeletons the shape of the real content; `layout="fixed"` tables with `skeletonRows` = page size so nothing jumps.
- App-shell chrome (sidebar width, topbar height, shell z-index) is the app's own constants, below Koi's overlay layers (`dialog` 900+). Overlays you portal yourself need `zIndex: 'popup'`.

## Copy

- UI copy is **Simplified Chinese**, short and plain. Buttons are verbs ("保存", "发布文章"); navigation is nouns ("首页", "归档"). Nav labels read best at two to four characters.
- Tone: casual and warm, a little playful, never at the expense of clarity. Errors are written as the fix: "邮箱格式不太对，请检查一下。"
- No emoji in the UI. Dates are short: "Oct 7, 2026".
- Mark optional fields "（选填）" rather than starring every required one, unless most fields are optional.
- A component's built-in copy comes from `strings` in `@koi/core`; don't hard-code it in the platform package.
- No decorative English: no bilingual headings, no `Overview` micro-labels beside a Chinese title, no `uppercase`, no wide letter-spacing as ornament.

## Writing it in code

### Web (`@koi/react`, Panda CSS)

- Styles go through `css({...})` or a recipe. JSX style props are off (`jsxStyleProps: 'none'`).
- Token names in `css()`:
  - colors by role name: `bg: 'surface'`, `color: 'text-muted'`, `borderColor: 'border-control'`
  - spacing as **bare numbers**: `padding: '6'`, `gap: '4'` — `'space-4'` silently generates an empty rule
  - radius / shadow / size by short name: `borderRadius: 'xl'`, `boxShadow: 'float'`, `height: 'control-md'`
  - type: `textStyle: 'body'`
  - motion: `transitionDuration: 'fast'`, `transitionTimingFunction: 'spring'`
  - responsive: `md: {...}` or `{ base: ..., md: ... }` (no underscore)
- `width: 'full'` isn't a token here; write `'100%'`.
- One-off styles stay inline on the JSX; hoist into a local `s` object only when used twice in the file.
- Component-specific sizes come from `@koi/tokens/dimensions` (`components.*`, `toPx()` in recipes). A size that only makes sense on the web carries `// koi-web-only: <reason>`.
- Focus: every interactive element gets the 2px `focus-ring` outline at 2px offset.
- Theme, palette and font are attributes on `<html>` set by `theme-init.js` (`koiSetTheme`, `koiSetPalette`, `koiSetFont`). Inline it in `<head>` to avoid a flash.

### Native (`@koi/native`, Tamagui)

- Colors are theme keys in camelCase: `$surface`, `$textMuted`, `$onPrimarySolid`. There are no color tokens.
- Sizes `$control-md`, `$icon`; space `$1`…`$16`; radii `$lg`, `$xl`, `$panel`, `$dialog`, `$full`; type `fontSize="$body" lineHeight="$body" fontWeight="$body"`.
- Component sizes: `import { components } from '@koi/tokens/dimensions'`.
- Glass is `expo-blur`'s `BlurView` under the translucent role color. Shadows are per platform (`shadow*` on iOS, `elevation` on Android). Press feedback is the platform's own, not the web ripple.
- Touch has no hover: no hover-only affordance (flyouts, tooltips) may carry essential function.

## Carried over from web-design-taste

These rules from the general skill still hold in Koi:

- **Subtract before styling.** A section that repeats information found elsewhere is deleted, not restyled, and its now-unused wrappers go with it.
- **No costume.** No glow, no exaggerated gradients, no SaaS-landing look, no editorial print pastiche, no serif display face to look "designed".
- No tinted zone backgrounds, no colored bar across a card's top, no colored rule under a heading. A section heading is a heading and nothing else.
- Recompose per breakpoint; on a phone, text is start-aligned and flows.
- Raster images go through the framework's image pipeline at their displayed size with 1x/2x densities; no borders on images.
- Decoration is allowed only when it carries identity (a persona illustration), and stays faint: inert (`alt=""`, `aria-hidden`, `pointer-events: none`), large, around 7% opacity, behind text.
- External links carry `target="_blank" rel="noopener noreferrer"` (Link's `external` does this).
- No in-page buttons that duplicate a browser feature; no unrequested theme switcher.
- A shipped site has its own favicon set and OG card, never the framework's.
- If a page has a print form, every interactive affordance needs a paper form.

## Overridden from web-design-taste

Where the general skill says one thing and Koi another, follow Koi:

| web-design-taste | Koi |
| --- | --- |
| Three roles `primary-*` / `accent-*` / `secondary-*` used directly | Role tokens only; scales only for illustration and charts |
| Links are primary; hover resolves to primary | Inline links are amber `link` with a dashed underline; amber means "link" |
| Accent is opt-in, often zero | Accent is the link color and small highlights; an accent Button at most once per view |
| Pair every color with `dark:` | Role tokens carry both themes; never write per-theme colors |
| De-emphasize with `opacity-60` | `text-muted` (it *is* the blog's 60%) |
| Tinted chip keeps neutral text | Use the fill's paired `on-*` token |
| Cards get a soft shadow at wide breakpoints | Cards never have a shadow; depth is translucency |
| `rounded-lg` / `rounded-2xl` freely | The fixed radius vocabulary above; cards 24, fields 12, buttons 8 |
| `transition-colors duration-200` | 150ms `fast`; moving things on `spring` |
| Touch targets `size-12` circles | Control heights 28 / 36 / 44; same height per row |
| Remix Icon for UI, sizes in `em` | Font Awesome Free Solid via Iconify data; icon size tokens |
| Tailwind spacing scale, `px-*` utilities | Koi `space-*` tokens via Panda (bare numbers) |
| System sans, no web font unless asked | Same default, but always through the `sans` token; ChillRoundF via `data-font="chill"` |
| KPIs share one card | Follow the Admin template's composition; the shared rule is "never nest frames" |
| A table inside a card goes flush to the edges | Follow the Table spec: list pages put the table on the page; elsewhere it sits inside the Card's padding |

## Review checklist

Before presenting a design or a diff:

1. Any scale step or literal color outside illustration / charts? → role token.
2. Any per-theme color override? → wrong role; pick the one that already handles dark.
3. Is amber used for anything clickable that isn't a link, or for status? More than one accent Button in the view?
4. Every status color paired with an icon or a word?
5. Any raw `fontSize`, or a weight other than 400 / 700? → text style.
6. Any radius off the vocabulary? Buttons in one group sharing a shape? Tabs / tags / badges / switches pills? Nested corners concentric?
7. Any shadow on a button or a card? Any glass on a flat background?
8. Controls in one row sharing one height? Icons sized by token?
9. Any spacing off the 4px scale, or uneven page padding? Does it look tight? → loosen one step. Does it look lost? → bring back one frame per area.
10. Any card in a card, or a card around a bordered component?
11. Color transitions 150ms; moving things on spring (or `out` for edge-anchored); reduced motion respected?
12. Icons Font Awesome Solid or filled lookalikes, `currentColor`, no emoji; icon-only controls named?
13. Copy in Chinese, verbs on buttons, errors as fixes, no decorative English?
14. Could a Koi component replace something hand-styled?
15. New role-on-background pair added to `contrast-pairs.json`?
16. Checked in **both themes** and under the `rose` palette?

## Verification

- `pnpm check` and `pnpm lint` must pass.
- For components: `pnpm shots <Name>` and open the light and dark PNGs; `KOI_PALETTE=rose` and `KOI_FONT=chill` for the other palette and font.
- For Admin pages: take over `pnpm dev:admin` if it's running (`pnpm dev:admin:status`), else start it in the background; screenshot light and dark, desktop and phone width.
- Details and how to report results: `agent-doc/verification.md`.
