# Pagination

Page navigation in three shapes: `numbered`; `simple`, which is the blog's two large buttons around "n / m"; and `compact`, page numbers between two round icon-only buttons.

**When to use:** lists split into pages. Use `simple` for reading flows like blog lists, `numbered` when people jump around, and `compact` where the row shouldn't stretch across the page (a table footer, a narrow panel).

**The consumer supplies:** `page` (1-based), `pageCount`, `onChange(page)`, and optionally `variant`, `prevLabel`/`nextLabel` (default "上一页"/"下一页"), `siblings` (how many neighbours each side of the current page; default 1) and `label`.

**Styling:**
- Prev/next: `primary` `soft` Buttons with chevrons. In `simple`, they're `lg` `primary` `solid` Buttons; the blog wraps it in a pill `ShapeProvider`. In `compact`, they're `md` `primary` `soft` icon-only circles (chevron only; `prevLabel`/`nextLabel` become their accessible names and tooltips), the same 36px as the page numbers.
- Row: `numbered` and `simple` push prev/next to the ends; `compact` packs everything together with the page numbers' `space-1` gap, and is always pills (page numbers included) whatever the `ShapeProvider` says, so the row reads as one set of circles.
- Page numbers: round `control-md` (36px) buttons in `body` (14px).
- Current page: an `action` fill with `on-action` text and `aria-current="page"`.
- Gaps: shown as "…" in `text-muted`.
