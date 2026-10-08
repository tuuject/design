# Field

A form row that wraps one control with its label, help text and error message, and wires up the accessibility for you.

**When to use:** around every Input, Textarea and Select in a form. Stack Fields with `space-4` between them.

**The consumer supplies:** `label`, one control as `children`, and optionally `help`, `error`, `required` (adds a red asterisk) or `optional` (adds "（选填）").

**What it wires up:** the child control receives the `id` the label points at, `aria-describedby` linking the error and help text, and `aria-invalid` when there's an error.

**Styling:**
- Label: `label` type (14px bold) in `text`.
- Help: `small` (12px) in `text-muted`.
- Error: `small` (12px) in `error-text` with a 12px icon, so the meaning doesn't rely on color alone.
- Spacing: 6px between the parts.

- Write errors as a fix, not a scolding: "邮箱格式不太对，请检查一下。"
