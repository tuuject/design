# Table

A plain, quiet data table: hairline rows, muted bold column headers, and rows that never get shorter than 48px. It comes in two layers: table parts you compose yourself (the shape a headless table library such as TanStack Table expects), and DataTable, a ready-made table built from those parts.

**When to use:** records people scan and compare across columns, such as orders, users and logs, usually inside a Card with `padding="none"`. For a short list of settings or a single record, use plain layout or a description list instead.

**The consumer supplies:**
- **Parts:** `Table` (the `<table>`, inside a horizontally scrolling container), `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHeaderCell` and `TableCell`, plus `TableEmpty` for a "no data" row. Each renders its native element and passes every native attribute through (`colSpan`, `style`, `onClick`, `ref`…), so a headless library can drive them directly.
  - `TableHeaderCell` and `TableCell`: optional `align` (`start`, `center` or `end`). Put numbers at `end`.
  - `TableHeaderCell`: optional `sort` (`'asc'`, `'desc'` or `false`) and `onSort(event)`. With `onSort`, the header becomes a sort button; these are the shapes TanStack Table's `column.getIsSorted()` and `column.getToggleSortingHandler()` return.
  - `TableRow`: optional `selected`.
  - `TableEmpty`: `colSpan` (the column count) and optional children (default "暂无数据").
- **DataTable:** `columns` (`{key, header, cell(row, index), align?, skeleton?}`), `rows`, `getRowKey(row, index)`, and optionally `loading` with `skeletonRows` (default 5), `empty` and `caption`.

**Behavior:**
- The container scrolls sideways when the table is wider than it; the page itself never scrolls sideways. Give the table a `min-width` when its columns shouldn't squeeze.
- A sortable header is a real `<button>` inside the `<th>`, so it's reachable with Tab and works with Enter and Space. The sorted column's `<th>` carries `aria-sort` (`ascending` or `descending`).
- Header cells are `<th scope="col">`.
- While DataTable is `loading`, it shows skeleton rows (shaped like the real content through each column's `skeleton`) and marks the table `aria-busy`.

**Styling:**
- Type: `body` (14px) in `text`, with tabular figures so numbers line up. Cells don't wrap.
- Header cells: `small` (12px) bold `text-muted`, 8px vertical padding.
- Body rows: at least 48px tall (`table.row-height`), with 8px vertical and 16px side padding in each cell, so taller content still grows the row. Content is vertically centered.
- Every cell has a 1px `divider` bottom edge.
- Hover: the whole row fills `surface-muted`. Selected rows fill `action-subtle` and keep `text`.
- Sort button: inherits the header type; it turns `text` on hover and when sorted. Sortable columns show a 14px up/down chevron pair in `text-muted`; the sorted column shows a single chevron pointing up (ascending) or down (descending). Focus: the standard 2px `focus-ring` at a 2px offset.
- Empty row: centered `text-muted`, 40px vertical padding.
- Actions in a row: `sm` `ghost` Buttons. Use the same button shape as the rest of the surface (pills next to Pagination).
- The table has no background, border or radius of its own; the Card around it provides them.

- Don't put a `primary` Badge in a row that can be selected: its `action-subtle` fill is the selected row's fill, so the badge disappears into it.
