# Checkbox

A 16px rounded-square checkbox with a label and an optional description.

**When to use:** independent on/off choices, or several choices from a list. For a setting that applies the moment it's flipped, use Switch.

**The consumer supplies:** `label`, optionally `description`, and `checked`/`onCheckedChange` (or `defaultChecked`, or a native `onChange`). Native input props pass through, and a `ref` reaches the input.

**Styling:**
- Box: a 1.5px `border-control` edge, `radius-sm` corners and a `surface` fill.
- Checked: filled `control-checked` with an `on-action` check mark, which pops in on Koi's springy curve (`cubic-bezier(.47,1.64,.41,.8)`).
- Text: the label is `body` (14px), the description is `small` (12px) in `text-muted` `space-1` (4px) below it, both `space-2` from the box.
- The whole row is the click target.
