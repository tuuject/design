# IconButton

A round, icon-only button, like the RSS and menu buttons in Koi's nav.

**When to use:** compact, familiar actions where an icon is unambiguous: close, subscribe, menu, next. If the meaning isn't obvious, use a Button with a label, or wrap the IconButton in a Tooltip.

**The consumer supplies:** `label`, which is required and becomes both the accessible name and the native title, and `icon`, an SVG drawn in `currentColor` (usually `<Icon icon={…} />`). Optionally `color` and `variant` (the same five colors and four variants as Button; default `secondary` `ghost`), `shape` (`pill` or `rounded`), `size` (`sm`/`md`/`lg`) and `onClick`.

**Styling:**
- Shape: `radius-lg` (8px) corners by default, like Button. `shape="pill"` makes it a circle, to sit beside pill Buttons. Square at `control-sm` 28px, `control-md` 36px or `control-lg` 44px.
- Icons: `icon` (16px), or `icon-sm` (14px) at `sm`.
- Default `secondary` `ghost`: a gray icon that gains a soft gray fill on hover.
- Colors and variants use the same tokens as Button.
