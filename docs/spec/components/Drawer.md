# Drawer

A panel that slides in from an edge of the viewport, on the dialog's backdrop.

**When to use:** navigation on small screens, filters, a help panel: content that belongs beside the page rather than in front of it. Use Dialog when the panel should sit in the middle of the screen and needs an answer, and Menu or Popover for a small panel anchored to a trigger.

**The consumer supplies:** `open` and `onOpenChange`, plus `title` (its heading and accessible name), optionally `description`, `children` and `footer`. Optionally `side` (`left`, `right`, `top`, `bottom`; default `left`), `label` (the accessible name when there's no title), `hideTitle` (keeps the heading for screen readers only), `dismissible={false}` and `hideClose`.

`left` and `right` are physical screen edges: a panel pinned to the left stays there in an RTL page. `start` and `end` are the inline edges, so `side="start"` opens on the right in RTL; use them for a navigation or filter drawer that should follow the reading direction. The default stays the physical `left`, which is what the prop meant before `start`/`end` existed. `className` lands on the panel; `classNames` (keyed `backdrop`, `viewport`, `title`, `description`, `body`, `footer`, `close`) adds classes to the other parts.

**Behavior:**
- It renders into `document.body`.
- Focus moves into the panel and is trapped while it's open.
- Esc and a click on the backdrop close it; focus returns to the element that opened it.
- The page behind it doesn't scroll.
- It's labelled by its title (or by `label`), and described by its description.

**Styling:**
- Backdrop: `backdrop`, the dialog's black 60% scrim with no blur. It fades in and out over 200ms.
- Panel: `surface` with `shadow-float`. From the left or right it is at most 280px wide and full height; from the top or bottom it spans the viewport width and is at most 80% tall, scrolling inside. The 1px `divider` edge sits on the inner edge, against the page.
- It slides in and out over 200ms on `out`, not the spring: the spring's overshoot would pull the panel off the edge it's anchored to and show a gap behind it.
- Title: `heading-3` (16px). Description and body: `body` (14px). Footer actions are rounded (`radius-lg`) and wrap onto a second row when they don't fit.
- Direction: the panel's inner edge is `borderInlineEnd`/`borderInlineStart` for the `start`/`end` sides, and a physical right/left border for `left`/`right`. The slide is a transform, so the logical sides carry a `:dir(rtl)` rule with the opposite sign. A long title wraps rather than pushing the close button off the panel.
- With `hideTitle`, the heading stays in the accessibility tree but isn't drawn: use it when the content already starts with its own header (a brand and a nav list, say).
