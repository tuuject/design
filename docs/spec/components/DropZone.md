# DropZone

A dashed area that collects files: drop them on it, or click, Space or Enter to open the platform picker.

**When to use:** importing files where drag and drop is a shortcut, never the only path. Validation, progress and the result list stay in the app; the component only hands over the files.

**The consumer supplies:** `onFiles` (web), `accept`, `multiple`, and optionally `title`, `description`, `icon`, `disabled`. The default title is "拖拽文件到这里，或点击选择"; with no title it is named "选择文件".

**Styling:**
- Shape: `radius-panel` (24px) with a 2px dashed `border` edge, the same quiet line as cards and tags; hover raises it to `border-hover`, still quieter than a control edge.
- Drag: the edge turns `control-checked` and the fill becomes `action-subtle`.
- Icon: a 44px `action-subtle` circle with the upload glyph in `on-action-subtle`; replace it through `icon`.
- Type: the title is `heading-3` (16px bold); the description is `small` in `text-muted`, 4px under it.
- Padding: `space-12` (48px) block, `space-8` (32px) inline; content is centered.
- Disabled: 50% opacity, a `not-allowed` cursor, and neither a click nor a drop does anything.
- Motion: background and border over 150ms.

**Accessibility:** the area is a `role="button"` with `tabIndex` 0, opened by Enter or Space, and carries `aria-disabled` when disabled. The file input is hidden and sits outside the button, because a button may not contain another labelable control.
