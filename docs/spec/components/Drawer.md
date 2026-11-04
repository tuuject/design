# Drawer

A panel that slides in from an edge of the viewport, on the dialog's backdrop.

**When to use:** navigation on small screens, filters, a help panel: content that belongs beside the page rather than in front of it. Use Dialog when the panel should sit in the middle of the screen and needs an answer, and Menu or Popover for a small panel anchored to a trigger.

**The consumer supplies:** `open` and `onOpenChange`, plus `title` (its heading and accessible name), optionally `description`, `children` and `footer`. Optionally `side` (`left`, `right`, `top`, `bottom`; default `left`), `label` (the accessible name when there's no title), `hideTitle` (keeps the heading for screen readers only), `dismissible={false}` and `hideClose`. `className` lands on the panel; `classNames` (keyed `backdrop`, `viewport`, `title`, `description`, `body`, `footer`, `close`) adds classes to the other parts.

**Behavior:**
- It renders into `document.body`.
- Focus moves into the panel and is trapped while it's open.
- Esc and a click on the backdrop close it; focus returns to the element that opened it.
- The page behind it doesn't scroll.
- It's labelled by its title (or by `label`), and described by its description.

**Styling:**
- Backdrop: `backdrop` with `blur-panel`. It fades in and out over 200ms.
- Panel: `surface` with `shadow-float`. From the left or right it is at most 280px wide and full height; from the top or bottom it spans the viewport width and is at most 80% tall, scrolling inside. The 1px `divider` edge sits on the inner edge, against the page.
- It slides in and out over 200ms on `out`, not the spring: the spring's overshoot would pull the panel off the edge it's anchored to and show a gap behind it.
- Title: `heading-3` (16px). Description and body: `body` (14px). Footer actions are rounded (`radius-lg`).
- With `hideTitle`, the heading stays in the accessibility tree but isn't drawn: use it when the content already starts with its own header (a brand and a nav list, say).
