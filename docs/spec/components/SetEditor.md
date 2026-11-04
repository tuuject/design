# SetEditor

A list of unique values: drag handle, one field, remove button, and an add button underneath.

**When to use:** editing a small set a form persists, such as tags, allowed hosts or feature flags. When the values pair a name with a value use MapEditor; a single pick from a known list is a Select or SelectPanel.

**The consumer supplies:** controlled `value` / `onChange`, `createValue`, `renderValue`, and optionally `validateValue`, `equals`, `sortable`, `disabled`, `readOnly`, `addLabel`, `emptyText` and `classNames`. The render prop hands the control `value`, `onChange`, `disabled`, `readOnly` and `invalid`; give the control an accessible name.

**Data:**
- Values are unique. A duplicate is never deduplicated: both rows keep the value and show "值不能重复" until one changes. `validateValue` runs only once the value is unique; its message replaces the built-in one when it returns a string.
- `value` is an array in display order. The app converts it to a `Set` after validating.
- Rows have internal ids, so typing never remounts a field. When the parent replaces the array, entries are matched by `equals` (default `Object.is`); unmatched rows get new ids. Pass a comparator for object values.
- `sortable` controls the UI only: `false` hides the handle and the drag context, while the array keeps whatever order it came in.

**Styling:** the same rows as MapEditor without the key column and the arrow: `[handle] [value] [remove]`, 8px gaps, `md` controls, handle and remove at 36px, the field taking the rest. The dragged row lifts on `surface` with `shadow-float`; errors render through Field; add is a left-aligned `ghost` secondary Button; the empty state is one line of `text-muted`; disabled dims the editor to 50%; read-only drops the handle, remove and add. `classNames` reaches the same slots as MapEditor; `className` stays on the root.

**Accessibility:** identical to MapEditor: `<ul>` / `<li>` rows, a named handle acting as the drag activator, 4px pointer activation, Space/Enter plus arrows plus Esc from the keyboard, Chinese announcements and instructions, and one commit on drop.
