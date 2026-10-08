# Tag

An outlined pill chip for keywords, filters and removable selections.

**When to use:** article tags, active filters, and entered values like recipients. For pure status, use Badge.

**The consumer supplies:** the label as children, and optionally `icon`, `selected` (for filter chips) and `onRemove` (adds a × button named "移除 <label>").

**Styling:**
- Shape: `control-sm` (28px) tall with `radius-full` corners.
- Default: a 1px `border` edge on `surface`, with `small` (12px) type in `text`.
- `selected`: an `action-subtle` fill with `on-action-subtle` text.
