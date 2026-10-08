# Input

A single-line text field with a soft 12px corner.

**When to use:** short free text, such as names, emails, URLs and search. Wrap it in a Field to give it a label, help text and errors. Use Textarea for multi-line text and Select for a fixed list.

**The consumer supplies:** native input props (`value`/`onChange`, `type`, `placeholder`, `name`…), plus optional `size` (`sm`/`md`/`lg`), `iconStart`/`iconEnd` and `invalid`. Outside a Field, give it an `aria-label`.

**Styling:**
- Fill and edge: `surface` with a 1px `border-control` edge (3:1+), turning `border-control-hover` on hover. Corners are `radius-xl`.
- Height: `control-md` (36px) by default, with `body` (14px) text; `sm` is 28px with 12px text.
- Focus: the edge becomes a 2px `focus-ring`.
- Invalid: `error-control`.
- Disabled: `surface-muted` with `text-disabled`.
- Placeholder: `text-muted`. Don't use a placeholder as a label.
