# Menu

A dropdown list of actions or links that opens from a trigger.

**When to use:** row actions, the signed-in user's menu, a grouped navigation flyout. For choosing a value from a list, use SelectPanel (it tracks the choice); for a panel of controls, use Popover.

**The consumer supplies:** `trigger` (the element that opens it: a Button, an avatar button, a nav row) and `items`, either rows (`{value, label, textValue?, icon?, endContent?, href?, disabled?, current?, onSelect?}`), groups of them (`{label, items}`), or the string `'separator'` between them. `onSelect(value, item, details)` fires when a row is chosen; a row's own `onSelect` overrides it.
- Optionally `header` and `footer` (divided from the rows by a line), `placement` (default `bottom-start`), `openOnHover`, `modal` (default true), and `open` / `defaultOpen` / `onOpenChange`.
- `finalFocus(interactionType)` (web only) chooses where focus goes when the menu closes; return an element to focus, or `false` to leave focus alone. Base UI's default returns it to the trigger. `ChangeSummary` uses it to jump to the field that was picked.
- `className` lands on the panel; `classNames` (keyed `positioner`, `header`, `body`, `footer`, `group`, `groupLabel`, `separator`, `item`, `itemIcon`, `itemText`, `itemEnd`) adds classes to the other parts.
- `placement` is reading-direction relative: `bottom-start` aligns with the trigger's start edge, so it mirrors in RTL, and `right-start` opens toward the inline end (to the left in RTL). The panel's positioner carries the `DirectionProvider`'s `dir`, and the positioner resolves the alignment from it.
- A row with `href` is a real anchor, so middle-click and copy-link work. With client-side routing, call `details.event.preventDefault()` in `onSelect` and navigate yourself.
- `textValue` is what type-to-find matches when `label` isn't plain text.
- `details.cancel()` keeps the menu open instead of closing after the row's handler.

**Behavior:** Base UI Menu. ↓ / Enter / Space open it, arrow keys move, typing jumps to a matching row, Enter chooses, Esc closes and returns focus to the trigger, and a click outside closes it. `openOnHover` also opens it from the mouse, for navigation flyouts; a hover-opened menu is never modal. `modal` locks the page scroll and blocks outside clicks while it's open; set it to false when choosing a row starts a scroll or a navigation, so neither is swallowed.

**Styling:**
- Panel: `surface`, a 1px `border` edge, `radius-xl`, `shadow-float`, 4px padding, at most 420px tall (it scrolls) and between 200 and 320px wide. It pops in from the trigger (scale from 96% on the spring curve, fade on `out`).
- Rows: at least 36px tall, `body` type, `radius-lg` (concentric with the panel). A label longer than the panel is wide wraps onto a second line and the row grows (with hyphenation when the page's `lang` allows it). The highlighted row fills `surface-muted`; the current row fills `nav-item-active` and is bold, with `aria-current="page"`; disabled rows are `text-disabled`.
- An `icon` sits before the label (16px, `text-muted`) and `endContent` after it (muted, `small`).
- Group labels: `small` `text-muted`. Separators: 1px `divider`, edge to edge. Header and footer: 16px side padding, divided from the rows by a 1px `divider`.
