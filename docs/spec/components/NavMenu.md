# NavMenu

App navigation that renders the same items as a vertical sidebar or a horizontal top bar, with up to three levels, so a product can let each user choose the layout they prefer.

**When to use:** the main navigation of an app or admin console. Switch layouts with `orientation`; the items, sections and current value stay the same. For switching views inside one page, use Tabs instead.

**The consumer supplies:**
- `sections`: groups of items, each with an optional `label` ("观察", "管理"). Use `items` instead for a single ungrouped list.
- Each item has `value`, `label`, an `icon` (a 24-grid line icon in `currentColor`) and optionally `href` (renders a link; otherwise a button), `badge` (e.g. a Badge with a count), `disabled` and `children`.
- `children` nests items up to three levels in all. A parent only opens and closes its children; give the destination its own child item ("全部记录") instead of an `href` on the parent.
- `value`/`onSelect` (or `defaultValue`) for the current item. `onSelect(value, item, event)` fires when a leaf is chosen; with client-side routing, call `event.preventDefault()` and navigate yourself.
- Optionally `brand` (`logo`, `title`, `subtitle`, `href`), `footer` (e.g. the signed-in user's Avatar), `orientation` (default `vertical`), `defaultExpanded` and `label` (the nav's accessible name, default "主导航").

**Vertical:** up to 280px wide. The brand sits on top with a 44px (`control-lg`) `radius-xl` logo box, a `heading-3` (16px) title and a `small` (12px) muted subtitle. Section labels are 12px `text-muted`, items stack with no gap between them (hover and active fills touch) and groups sit `space-6` apart, and `footer` pins to the bottom.
- A parent shows a chevron that turns over on Koi's spring curve; clicking it expands or collapses its children in place.
- Children are indented to line up with the parent's label (36px, level 2) and 16px further (level 3), without icons.
- The current item's parents open on their own and show in bold, so the current page is never hidden.

**Horizontal:** a single row with a smaller brand (36px logo, 14px title). Section labels are kept for screen readers only, and groups are separated by a 24px `divider` line. When items don't fit, the row scrolls sideways and its end fades out to hint at more, so put the most used items first.
- A parent shows a down chevron. Hovering with a mouse opens its panel below; moving away closes it after a short delay, so the pointer can travel into the panel. On touch, a tap opens it and another tap closes it.
- Level-3 children cascade into a second panel beside the first, like the Windows Start menu, opened the same way.
- A panel closes when an item is chosen, on Esc (focus returns to the parent), on a click outside, or when the page scrolls or resizes.
- Keyboard: ↓ on a parent opens its panel and focuses the first item; → or Enter on a level-2 parent opens its side panel, and ← closes it.
- Panels are `surface` with a `border` edge, `radius-xl` corners and `shadow-float`, and pop in on the spring curve. They render into `document.body`, so the scrolling bar never clips them.
- A top-level parent whose branch holds the current page shows the current fill.

**Styling:**
- Items are `control-md` (36px) tall with 16px icons, `radius-xl` corners, an 8px (`space-2`) gap between icon and label, and `small` type (14px / 20px) in `nav-item-text`; flyout panels use the same size.
- Hover fills `nav-item-hover`. The current item fills `nav-item-active` with bold `text`, and carries `aria-current="page"`.
- Text reaches at least 9:1 on every fill in both themes.
- The logo box defaults to `secondary-solid` with `on-secondary-solid` icons; pass an `<img>` as `logo` to use a picture instead.
- The component has no background of its own, so place it on `page-bg`, `surface` or `surface-muted`.
- Focus: a 2px `focus-ring` drawn just inside each item, so it isn't clipped when the horizontal bar scrolls.
- Parents are buttons with `aria-expanded`.

- Do keep labels short: two to four characters in Chinese reads best in both layouts.
- Don't go deeper than three levels; a fourth level is ignored. If a branch needs more, move it onto its own page.
