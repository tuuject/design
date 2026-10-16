Koi (こい, 恋) is a soft, rounded interface system grown out of tcdw's Koi blog theme: pill-shaped controls, frosted glass over color, sky-blue actions and amber links, all set in the rounded ChillRoundF. Every component works in light and dark, following the reader's system setting.

## Using it

- Load `components/fonts.css` (ChillRoundF), the tokens, `components/bundle.css`, React 18 and `components/bundle.js`. Components are then on `window.Koi`: `Koi.Button`, `Koi.Field`… Props are typed in `components/index.d.ts`.
- Wrap the app once in `Koi.ToastProvider` if you use toasts.
- Style your own UI with the role tokens (`surface`, `text-muted`, `action`, `border-control`…), not the raw scales. Use the scales (`primary-*`, `accent-*`, `secondary-*`, `warning-*`, `error-*`) only for illustration and charts.

## Content fundamentals

- Write UI copy in Simplified Chinese, short and plain. Buttons are verbs ("保存", "发布文章", "删除"); navigation is nouns ("首页", "归档").
- Mixed Chinese/English copy is normal. `text-autospace: normal` is on the body, so let the browser add the CJK/Latin spacing; don't type spaces by hand.
- The tone is casual and warm, a little playful (Koi's own README signs off "好康！！！" and "谢谢w"), but never at the expense of clarity in errors. Write errors as the fix: "邮箱格式不太对，请检查一下。"
- No emoji in the UI. Dates are short, like "Oct 7, 2026". Mark optional fields with "（选填）" rather than marking every required one, unless most fields are optional.

## Color

- **Grounds:** `page-bg` (white / `secondary-950`), with objects on `surface` and quiet fills on `surface-muted`. Text is `text`, secondary text `text-muted`, disabled text `text-disabled`.
- **Sky primary = action.** `action` (`primary-700`) fills primary buttons, the current page and checked controls (`control-checked`). Tinted actions use `action-subtle`. Brand-colored text uses `text-brand`.
- **Amber accent = links and highlights.** Inline links are `link` with a dashed `link-border` underline; small highlights are `highlight`. An `accent` Button is allowed for one highlight action per view, never beside a solid `primary`. Don't use amber for status.
- **Status:** use `info-*` (sky), `warning-*` (yellow) and `error-*` (red) as surface/border/text triples for alerts, badges and field errors. Always pair a status color with an icon or a word.
- **Buttons:** color and variant are separate choices. `color` (`primary`, `accent`, `secondary`, `warning`, `error`) says what the action means; `variant` (`solid`, `soft`, `outline`, `ghost`) says how loud it is. Each color has its own `<color>-solid`, `-soft`, `-fg` and `-edge` tokens, with matching `on-` text colors.
- **Borders:** `border` is decorative (cards, tags). Control edges use `border-control`, which keeps 3:1 against `surface`, and hairline separators use `divider`.
- **Palettes:** sky and amber are the default palette, not the only one. A palette swaps the `primary-*` and `accent-*` scales and every role follows; Koi stays recognizable through its shapes, glass, roundness and motion, which a palette doesn't touch. `secondary`, `warning` and `error` never change. Pick an accent that's bright at its 400 step, like amber: `accent-solid` is the 400 step with 950-step text, so a dark accent (violet) still passes contrast but loses the light, warm highlight. Built-in palettes: `koi` (default) and `rose`.
- **Contrast:** every text pair meets 4.5:1 in both themes, and every control edge and focus ring meets 3:1. To get there, links and hover states use one step darker than the blog in light mode: `link` is `accent-700` and `action-hover` is `primary-800`. White check marks on the dark `control-checked` are 4.0:1, which is fine for an icon.

## Type

- One family, `sans`: ChillRoundF (寒蝉全圆体, SIL OFL; Latin from Varela Round), falling back to `-apple-system` and "Microsoft YaHei". It has two weights, 400 and 700; anything asking for 600 renders at 700.
- The font ships as 121 unicode-range subsets in `fonts/`, declared by `components/fonts.css`. The browser fetches only the subsets a page uses.
- **14px is the base.** `body` (14px / 20px) is the default for all UI text, and every component is sized around it.
- Headings: `display` 30px (one per page), `heading-1` 24px, `heading-2` 20px (also dialog titles), `heading-3` 16px (also card titles and the NavMenu product name). All are bold.
- Text: `small` (12px / 16px) for help, descriptions and tooltips; `caption` (12px bold) only for badges. `prose` (16px / 1.75) is the one exception to the 14px base, for long-form reading such as articles and docs.
- Controls: `label` (14px bold) for field labels and alert titles, `button` (14px) and `button-sm` (12px) for buttons.

## Shape, space and depth

- **Roundness is the identity.** Anything you press is a pill (`radius-full`): buttons, icon buttons, tabs, tags, badges, switches. The one exception is Button and IconButton's `shape="rounded"` (`radius-lg`, 8px), for dense toolbars, tables and forms, and the default inside Dialog footers and table cells. Use one shape per group of buttons: a table's rounded row actions can sit above a pill Pagination. Fields and alerts are `radius-xl` (12px), cards and toasts `radius-panel` (24px), dialogs `radius-dialog` (32px, concentric with their 8px buttons). Only checkboxes (`radius-sm`), and tooltips and rounded buttons (`radius-lg`), are tighter.
- **Sizes:** controls come in three heights, `control-sm` 28, `control-md` 36 (default) and `control-lg` 44, and components sharing a row use the same size. Checkboxes and radios are 16px, switches 36 × 20px.
- **Spacing:** use the 4px steps, `space-1`…`space-16`: `space-2` inside controls, `space-4` between fields, `space-6` inside cards and dialogs, `space-8` between groups. A reading column is at most `content-max` (56rem).
- **Depth comes from translucency, not shadows.** Use `surface-glass` with `blur-panel` over imagery or color (the glass Card), and `surface-glass-tint` with `blur-float` for floating chrome (Toast). Shadows: never on buttons, which stay flat (the press ripple fades to nothing); `shadow-raised` on the active tab and switch thumbs; `shadow-float` only for things floating over the page (Dialog, Toast). Cards have no shadow.

## Motion

- Color and border changes take 150ms.
- Things that move use Koi's springy curve, `cubic-bezier(.47,1.64,.41,.8)`, taken from the blog's mobile menu: switch thumbs and progress bars over 400ms, check marks and radio dots over 250ms, dialogs scaling in from their center over 300ms, and toasts popping in.
- Overlays fade in over 150–200ms. The Dialog backdrop is the exception: it fades over 300ms, in step with the panel.
- All motion stops under `prefers-reduced-motion`.

## Iconography

- Icons are inline SVG line icons drawn in `currentColor`: a 24px grid, 2.25px stroke, round caps and joins, which matches ChillRoundF's rounded strokes. `Koi.Icons` has the set the components use (check, close, chevrons, info, warning, error, success, external).
- Sizes: `icon` (16px) beside 14px text, in md/lg controls, alerts, toasts and menus; `icon-sm` (14px) in small controls and tags.
- No emoji or icon fonts. An icon-only control needs an accessible name (IconButton's `label`).
- Koi has no logo of its own. Set the product name in `display` type.

## Accessibility

- **Focus:** every interactive element shows a 2px `focus-ring` outline at a 2px offset. Fields draw the ring on their edge.
- **Forms:** use Field around every form control so the label, help text and error message are wired to it (`id`, `aria-describedby`, `aria-invalid`).
- **Keyboard:** Dialog traps focus, closes on Esc and returns focus when it closes. Tabs move with the arrow keys and Home/End. Tooltip opens on keyboard focus.
- **Status:** warning and error Alerts use `role="alert"`, and info Alerts and Toasts use `role="status"`.

## Not synced

- **Source:** colors, type sizes, radii, shadows, blur and the font come from tcdw/koi at `main@87c7d4f`, with palette values from Tailwind 4.3.3. `secondary-*`, `warning-*` and `error-*` and all role tokens were added here.
- **Components:** all components are hand-written for this system. The repository's Astro/Svelte components were not imported.
- **Typography specimens:** the Typography view's specimens use the fallback stack. The font's subsets can't be listed as single font files, so `type.fonts` is empty, but the components load the real face through `components/fonts.css`.
- **Not included:** success colors, a date picker, free-text autocomplete, dropdown menus. (Searchable choice from a fixed list is SelectPanel.) App navigation is NavMenu, vertical or horizontal. Tables are plain Table parts and DataTable; sorting, filtering and selection logic come from the app or a headless table library.
