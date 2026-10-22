# Table

A plain, quiet data table: hairline rows, muted bold column headers, and rows that never get shorter than 48px. It comes in two layers: table parts you compose yourself (the shape a headless table library such as TanStack Table expects), and DataTable, a ready-made table built from those parts.

**When to use:** records people scan and compare across columns, such as orders, users and logs. A list page puts the table straight on the page, so a long list doesn't feel boxed in; a table that shares the page with other panels, such as a dashboard's recent orders, goes in a Card. For a short list of settings or a single record, use plain layout or a description list instead.

**The consumer supplies:**
- **Parts:** `Table` (the `<table>`, inside a horizontally scrolling container), `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHeaderCell` and `TableCell`, plus `TableEmpty` for a "no data" row. Each renders its native element and passes every native attribute through (`colSpan`, `style`, `onClick`, `ref`…), so a headless library can drive them directly.
  - `Table`: optional `layout` (`auto` or `fixed`, see Behavior).
  - `TableHeaderCell` and `TableCell`: optional `align` (`start`, `center` or `end`). Put numbers at `end`.
  - `TableHeaderCell`: optional `sort` (`'asc'`, `'desc'` or `false`) and `onSort(event)`. With `onSort`, the header becomes a sort button; these are the shapes TanStack Table's `column.getIsSorted()` and `column.getToggleSortingHandler()` return.
  - `TableRow`: optional `selected`.
  - `TableEmpty`: `colSpan` (the column count) and optional children (default "暂无数据").
- **DataTable:** `columns` (`{key, header, cell(row, index), align?, width?, skeleton?}`), `rows`, `getRowKey(row, index)`, and optionally `layout`, `loading` with `skeletonRows` (default 5), `empty` and `caption`. A column's `width` is a number (px) or any CSS length.

**Behavior:**
- The container scrolls sideways when the table is wider than it; the page itself never scrolls sideways. Give the table a `min-width` when its columns shouldn't squeeze.
- A sortable header is a real `<button>` inside the `<th>`, so it's reachable with Tab and works with Enter and Space. The sorted column's `<th>` carries `aria-sort` (`ascending` or `descending`).
- Header cells are `<th scope="col">`.
- `layout="auto"` (default) sizes columns by their content, so they shift whenever the content changes. `layout="fixed"` sizes them by the widths given (DataTable's column `width`, or the header cells' widths when composing parts, e.g. TanStack Table's `header.getSize()`); columns without a width share the rest, and content that doesn't fit ends in an ellipsis. Use `fixed`, with widths on every column but the one that should stretch, wherever rows load or page in place: nothing moves when skeletons turn into data.
- While DataTable is `loading`, it shows skeleton rows and marks the table `aria-busy`. Each placeholder takes the size of its column's `skeleton` sample (a sample value, or the element itself, such as a Badge) and follows the column's alignment. Set `skeletonRows` to the page size so the table keeps its height.

**Styling:**
- Type: `body` (14px) in `text`, with tabular figures so numbers line up. Cells don't wrap.
- Header cells: `label` (14px bold) in `text-muted`, 8px vertical padding. The muted color and weight set them apart from the body; at 12px they read as fine print next to 14px rows.
- Body rows: at least 48px tall (`table.row-height`), with 8px vertical and 16px side padding in each cell, so taller content still grows the row. Content is vertically centered.
- Every cell has a 1px `divider` bottom edge.
- Hover: the whole row fills `table-row-hover`, a step lighter than `surface-muted` (the ghost-button hover), so a hovered action button still shows in a hovered row. Selected rows fill `action-subtle` and keep `text`.
- Sort button: inherits the header type; it turns `text` on hover and when sorted. Sortable columns show a 14px up/down chevron pair in `text-muted`; the sorted column shows a single chevron pointing up (ascending) or down (descending). Focus: the standard 2px `focus-ring` at a 2px offset.
- Empty row: centered `text-muted`, 40px vertical padding.
- Actions in a row: `sm` `ghost` Buttons, next to each other with no gap. Buttons inside a cell default to `shape="rounded"`, whose `sm` size has 8px sides, so a row of actions stays compact; this holds even when a pill Pagination sits under the table. Buttons in a cell or the empty row use the 14px `button` label even at `sm`, so they match the text around them; the 28px height and 8px sides don't change. End-align the actions column and pull the group 8px outward (`margin-inline-end: -8px`) so the last label lines up with the header.
- The table has no background, border or radius of its own; it takes whatever it sits on, the page or a Card.

- Don't put a `primary` Badge in a row that can be selected: its `action-subtle` fill is the selected row's fill, so the badge disappears into it.
