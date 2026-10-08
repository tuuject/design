# Progress

A rounded progress bar, either determinate or indeterminate.

**When to use:** to show how far along a task with a known length is (uploads, reading progress). Omit `value` when the length is unknown. For small inline waits, use Spinner.

**The consumer supplies:** `value` (0–`max`; `max` defaults to 100), `label`, and optionally `showValue` and `size` (`sm` 4px, `md` 8px, `lg` 12px).

**Styling:**
- Track: `surface-muted` with `radius-full` corners.
- Bar: `control-checked`. It eases to new values on the spring curve; the indeterminate bar slides continuously.
- Accessibility: it renders `role="progressbar"` with `aria-valuenow`.
