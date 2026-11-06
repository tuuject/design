# Popover

A small panel of controls anchored to a trigger.

**When to use:** a filter form, a view or density switcher, a short set of controls that would crowd the page. For a list of actions or links, use Menu; for a panel that needs the user's full attention, use Dialog; for a panel from the screen edge, use Drawer.

**The consumer supplies:** `trigger` (the element that opens it) and `children`, the panel's content. It sits in a panel with 12px inner padding (4px panel + 8px body), so give the content its own spacing. Optionally `placement` (default `bottom-start`), `open` / `defaultOpen` / `onOpenChange`, `modal`, and `label` (the panel's accessible name, for a panel whose content doesn't name it). `className` lands on the panel; `classNames` (keyed `positioner`, `body`) adds classes to the other parts.

**Behavior:** Base UI Popover. A click on the trigger opens it, ↓ / Enter / Space open it from the keyboard, Esc and a click outside close it, and focus returns to the trigger. `modal` traps focus and locks the page scroll; by default a popover is a small panel of controls, not a dialog, and leaves the page alone.

**Styling:** the panel Menu uses, so the two read the same: `surface`, a 1px `border` edge, `radius-xl`, `shadow-float`, 4px padding, at most 420px tall (it scrolls) and between 200 and 320px wide. It pops in from the trigger (scale from 96% on the spring curve, fade on `out`).
