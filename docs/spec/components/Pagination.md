# Pagination

Page navigation in two shapes: `numbered`, and `simple`, which is the blog's two large pills around "n / m".

**When to use:** lists split into pages. Use `simple` for reading flows like blog lists, and `numbered` when people jump around.

**The consumer supplies:** `page` (1-based), `pageCount`, `onChange(page)`, and optionally `variant`, `prevLabel`/`nextLabel` (default "上一页"/"下一页"), `siblings` (how many neighbours each side of the current page; default 1) and `label`.

**Styling:**
- Prev/next: `primary` `soft` Buttons with chevrons. In `simple`, they're `lg` `primary` `solid` pills, as on the blog.
- Page numbers: round `control-md` (36px) buttons in `body` (14px).
- Current page: an `action` fill with `on-action` text and `aria-current="page"`.
- Gaps: shown as "…" in `text-muted`.
