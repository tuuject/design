# RadioGroup

A set of round radio buttons for choosing exactly one option.

**When to use:** 2–5 mutually exclusive options that should all stay visible. For longer lists, use Select.

**The consumer supplies:** `options` (`{value, label, description?, disabled?}`), `value`/`onChange` or `defaultValue`, and `label` (the group's accessible name). Optionally `orientation="horizontal"` and `disabled`.

**Styling:**
- Each radio is a 16px circle with a 1.5px `border-control` edge.
- Selected: filled `control-checked` with a 6px `on-action` dot that springs in.
- Labels and descriptions match Checkbox: a `body` (14px) label with a `small` (12px) description `space-1` (4px) below it.
- Vertical groups are spaced `space-3` apart, horizontal ones `space-6`.
