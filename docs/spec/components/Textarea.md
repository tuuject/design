# Textarea

A multi-line text field that matches Input.

**When to use:** comments, bios, messages: anything that may run past one line.

**The consumer supplies:** native textarea props (`value`/`onChange`, `rows` with a default of 4, `placeholder`…) and `invalid`. Put it inside a Field for a label.

**Styling:** the same edge, corners, focus and invalid states as Input. Text is `body` (14px / 20px), with 8px × 12px padding. It resizes vertically, with a minimum height of 80px.
