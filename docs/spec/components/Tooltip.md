# Tooltip

A small inverted bubble that names or explains the element it's attached to, on hover or keyboard focus.

**When to use:** to name icon-only buttons and add brief, non-essential hints. Never put essential information or interactive content in a tooltip. Touch users may never see it.

**The consumer supplies:** `content` (a short phrase), exactly one focusable child, and optionally `side` (`top` by default, or `bottom`) or `open` to control it.

**Styling:** `tooltip-bg`, which inverts against the page, with `tooltip-text`. Corners are `radius-lg`, text is `small` (12px) type, padding is 4px × 8px and width is capped at 240px. The bubble sits 8px from its trigger.

**Accessibility:** the trigger gets `aria-describedby` while the tooltip is shown, and Esc hides it.
