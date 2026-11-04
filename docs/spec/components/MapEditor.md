# MapEditor

A list of key-value rows: drag handle, key field, an arrow, value field, remove button, and an add button underneath.

**When to use:** editing a small map a form persists, such as HTTP headers, query parameters, environment variables or metadata. For a fixed set of named fields use Field with Inputs; for a single list of values use SetEditor.

**The consumer supplies:** controlled `value` / `onChange`, `createEntry`, `renderKey` / `renderValue`, and optionally `validateKey`, `keyEquals` / `valueEquals`, `sortable`, `disabled`, `readOnly`, `addLabel`, `emptyText` and `classNames`. The render props hand the control `value`, `onChange`, `disabled`, `readOnly` and `invalid`; give the control an accessible name, because a row has no visible label.

**Data:**
- Keys are unique. A duplicate is never merged or dropped: both rows keep the value and show "键名不能重复" until one changes. `validateKey` runs only once the key is unique; its message replaces the built-in one when it returns a string.
- `value` is an array in display order. The app converts it to a `Map` after validating.
- Rows have internal ids, so typing never remounts a field. When the parent replaces the array, entries are matched by `keyEquals` + `valueEquals` (default `Object.is`); unmatched rows get new ids. Pass comparators for object keys or values.
- `sortable` controls the UI only: `false` hides the handle and the drag context, while the array keeps whatever order it came in.

**Styling:**
- One row is `[handle] [key] → [value] [remove]`, 8px gaps, top-aligned so an error under one field doesn't move the others. Handle and remove are `md` IconButtons (36px), matching the `md` fields; key and value split the width evenly.
- The arrow is a 16px `text-muted` glyph between the fields, `aria-hidden`.
- The handle is `text-muted` with a grab cursor; while a row is dragged it lifts on `surface` with `shadow-float` and sits above its siblings.
- Errors render through Field: `small` (12px) `error-text`, an error icon, and a red edge on the offending control.
- Add is a left-aligned `ghost` secondary Button with a plus; remove is a `ghost` error IconButton. Empty state is one line of `text-muted`.
- Disabled dims the whole editor to 50% and disables every control; read-only drops the handle, remove and add, and hands `readOnly` to the fields.
- Consumers restyle the fields grid or any part through `classNames` (slots: `list`, `row`, `handle`, `fields`, `arrow`, `remove`, `add`, `empty`); `className` stays on the root.

**Accessibility:** rows are `<li>`s in a `<ul>`. The handle is a real button named "拖动排序" with a drag role description; a pointer gesture has a 4px activation distance, so a click doesn't start a drag. The keyboard grabs with Space or Enter, moves with the arrow keys, drops with Space or Enter and cancels with Esc; announcements and instructions are Chinese. Inputs inside a row keep their selection, cursor and copy/paste. The row order is committed once, on drop.
