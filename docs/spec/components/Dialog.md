# Dialog

A modal panel on a blurred backdrop for decisions and short focused tasks.

**When to use:** confirmations (use `role="alertdialog"`) and short forms that need the user's full attention. Don't use it for content that could live on the page, or for messages that need no answer (use Toast).

**The consumer supplies:** `open` and `onClose`, plus `title`, optional `description`, `children` and `footer` (actions in order: cancel as a `secondary` `ghost` Button, then the confirming solid Button: `primary`, or `error` when it destroys something). Buttons in the footer are `shape="rounded"` (8px corners) by default, so they don't need the prop; pass `shape="pill"` only to override. Optionally `size` (`sm` 400px, `md` 520px, `lg` 720px), `dismissible={false}` and `inline`.

**Behavior:**
- It renders into `document.body`.
- Focus moves to the first field or button and is trapped while the dialog is open.
- Esc and a click on the backdrop call `onClose`.
- When it closes, focus returns to the element that opened it.
- It's labelled by its title and described by its description.

**Styling:**
- Backdrop: `backdrop` with `blur-panel`.
- Panel: `surface` with `radius-dialog` (32px) corners, `space-6` padding and `shadow-float`. It pops in on the spring curve.
- Actions and the close button: rounded (`radius-lg`, 8px), not pills. The panel radius is that 8px plus the 24px padding, so the corners of the panel and of the bottom-right button are concentric. Change the padding or the button shape and the panel radius should follow.
- Title: `heading-2` (20px). Description and body: `body` (14px).
