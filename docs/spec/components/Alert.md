# Alert

An inline message box for information, warnings and errors related to the page or a section.

**When to use:** persistent messages that belong to the content, such as a failed save, a notice or a quota warning. For brief confirmations that disappear on their own, use Toast. For field-level problems, use the Field's `error`.

**The consumer supplies:** `tone` (`info`/`warning`/`error`), `title`, a body as children, and optionally an `action` (usually a small Button), `onClose` (adds a close button) or `icon` (`null` hides it).

**Styling:**
- Box: `radius-xl` corners, `space-3` padding, a 1px `<tone>-border` edge and a `<tone>-surface` fill. Text is `body` (14px) with a 16px icon.
- Text: the icon and title use `<tone>-text`, the body uses `text`, with a `space-1` (4px) gap between title and body.
- `info` uses the sky primary, `warning` uses yellow, `error` uses red.
- Every tone has its own icon, so the meaning never depends on color alone.
- Accessibility: warning and error alerts use `role="alert"`, info uses `role="status"`.
