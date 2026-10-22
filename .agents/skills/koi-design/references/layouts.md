# Layouts: pages, dashboards, responsive

The Admin template (`apps/admin`) is the reference composition for app pages. Read its routes (`apps/admin/src/routes/`) and `agent-doc/admin.md` before inventing a layout.

## Dashboards and admin pages

- **A list page puts its table straight on the page**, so a long list isn't boxed in. A table that shares the page with other panels (a dashboard's recent orders) goes in a Card.
- **One frame per area, never a frame in a frame.** No card of cards, no card around a component that brings its own border.
- **A card holds one thing.** Don't stack a toolbar, a divider, a table and a pager inside one card to make a "table panel".
- Page header: `heading-1` title + optional `body` `text-muted` description, `space-6` below (`PageHeader`).
- **Siblings in a row line up.** Same header height, same body shape (label → value), same value size; don't give only one sibling a description line. Measure in a screenshot; don't eyeball.
- Filter bars lay out by their own width (container queries), not the viewport, so a collapsed sidebar doesn't break the columns. Search is manual (button / Enter), not per keystroke.
- The URL is the state for filters and paging.
- Loading: skeletons the shape of the real content; `layout="fixed"` tables with `skeletonRows` = page size so nothing jumps.
- App-shell chrome (sidebar width, topbar height, shell z-index) is the app's own constants, below Koi's overlay layers (`dialog` 900+). Overlays you portal yourself need `zIndex: 'popup'`.
- On desktop the sidebar is pinned to the viewport (`position: sticky`, `100dvh`), so long pages don't scroll the navigation away. Use sticky, not fixed: it keeps its width in the row, so collapsing it still pushes the content over.

## List pages

The orders page (`apps/admin/src/routes/_authed.orders.tsx`) is the reference. Top to bottom: PageHeader → filter Card → toolbar → table → pager, each a separate block on the page.

- **The toolbar sits on the page**, between the filters and the table, not inside a card. Actions on the left; selection count and a refresh IconButton on the right. Keep an equal gap above and below it (`space-5`).
- **Page-level actions are the default `md` size.** `sm` is for dense containers (table cells, tags), not for making a toolbar look tidy.
- Filter fields stack their labels above the controls (Field); side-by-side labels in a filter bar read as cramped.
- **Size table columns against real data.** With `layout="fixed"`, give every fixed-content column (IDs, amounts, status, timestamps, actions) a width that fits its longest value plus the cell's 16px sides, with no ellipsis. Leave **two or more** free-text columns (customer, product) without a width, so the spare room splits between them instead of pooling into one wide gap. Set the table's `minWidth` so it still fits the target window (1280px) without scrolling sideways.
- Row actions: see the Table spec. Icon-only actions are `md` IconButtons in a `paddingBlock="none"` cell; the destructive one is `color="error"`.

## Charts

Koi has no chart component. These rules extend the brand book's "scales only for illustration and charts":

- Series may use scale steps. Pick them so adjacent series differ in lightness, not just hue, and check them in both themes.
- Axis ticks, legends and tooltips are `small` (12px) in `text-muted`. Series color goes on a dot or the mark, never on label text.
- Tooltips look like Koi popovers: `surface`, `border`, `radius-xl`, `shadow-float`.
- Values use `tabular-nums` and thousands separators. Gridlines and cursor lines use `divider`.

## Content pages (blog-like)

- Reading column at most `content-max`; long-form text in `prose`.
- Wrap the page in `<ShapeProvider shape="pill">` for the blog's voice.
- Glass Cards go over imagery or color (a banner), never over the flat page.
- `space-10` / `md: 12` between list items, `space-16` between sections.

## Responsive

- The only breakpoint today is `md` (768px), defined in `panda.config.ts`. It isn't a token yet.
- Design the phone layout as its own composition: an element may **move** between breakpoints, not just stack. Render it twice (hidden at one breakpoint each) rather than contorting one element into both roles.
- On a phone, text is start-aligned and flows; edge-anchored navigation becomes a drawer that slides on `out`.
- Tables scroll sideways inside their own container; the page never scrolls sideways. Give a table a `min-width` when its columns shouldn't squeeze.
