# Layouts: pages, dashboards, responsive

The Admin template (`apps/admin`) is the reference composition for app pages. Read its routes (`apps/admin/src/routes/`) and `agent-doc/admin.md` before inventing a layout. In a consumer project the template is a Vite app to copy, not a dependency: see `references/consumer.md`; the same sources are at <https://github.com/tuuject/design/tree/main/apps/admin>.

## Text on the page

A page stays clean: every line left visible helps the user work this screen. That means the content itself, units on values, empty states and missing-data hints ("未配置", "暂无记录"), plus the field help and errors in `references/components.md`.

- **Explain once, elsewhere.** How it works underneath, how to use it and its limits go on a separate help page or in the docs, written once. Don't repeat them page after page, or in a PageHeader or Card `description`; a `description` says in one line what the thing is for, when the title doesn't.
- **A section that needs explaining gets an icon, not a sentence**: a `circle-info` IconButton (`md`, `ghost`, a `label` naming the topic, e.g. "关于请求头") beside its title, opening the matching section of that help page. At the top of a page it goes in PageHeader's `info`.

## Secondary information

Secondary information never costs the main layout. Give it the lightest form that still says it clearly. If adding it

- wraps text where it shouldn't (a label, value or column header breaking onto a second line),
- stretches the layout (one row taller than its siblings, a column pushed wider, siblings out of line),
- or makes the page, or a table, scroll sideways at full desktop width,

switch to a lighter form (a unit instead of a phrase, a Tooltip on an icon) or put it behind a toggle (a Switch such as "显示明细" that reveals the extra columns or lines).

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

The orders page (`apps/admin/src/routes/_authed.orders.tsx`, or the copied route in a consumer) is the reference. Top to bottom: PageHeader → filter Card → toolbar → table → pager, each a separate block on the page.

- **The toolbar sits on the page**, between the filters and the table, not inside a card. Actions on the left; selection count and a refresh IconButton on the right. Keep an equal gap above and below it (`space-5`).
- **Page-level actions are the default `md` size.** `sm` is for dense containers (table cells, tags), not for making a toolbar look tidy.
- Filter fields stack their labels above the controls (Field); side-by-side labels in a filter bar read as cramped.
- **Size table columns against real data.** With `layout="fixed"`, give every fixed-content column (IDs, amounts, status, timestamps, actions) a width that fits its longest value plus the cell's 16px sides, with no ellipsis. Leave **two or more** free-text columns (customer, product) without a width, so the spare room splits between them instead of pooling into one wide gap. Set the table's `minWidth` so it still fits the target window (1280px) without scrolling sideways.
- Row actions: see the Table spec. Icon-only actions are `md` IconButtons in a `paddingBlock="none"` cell; the destructive one is `color="error"`.
- **A list that isn't a table still reads like one.** Its header row (select-all checkbox, selection count, batch action) has a `divider` hairline under it, `space-3` below its content. Every row has a bottom hairline, the last one too, so the list is closed before the pager. The empty state gets `space-4` block padding; the pager sits `space-4` below the last line.

## Workspace pages (master–detail)

A page that is one continuous workspace (the provider list on the left, the selected provider's settings on the right) is layered with hairlines, not Cards. Cards are for independent things, like a dashboard's summaries or separate settings groups; wrapping the parts of one workspace in Cards stacks frames.

- **One hairline between master and detail.** Stacked, it is the detail's top border; side by side, the detail's start border. Set the grid's `columnGap` to `0` and give each side `space-6` toward the line, so the line sits in the middle of the gutter. The master's grid column is its content width plus that padding (308 + 24 = 332px). Stretch the detail (`alignSelf: 'stretch'`) so the line runs the full height even when the master is taller.
- Split only where both panes fit (about 1200px for a 300px rail beside a form), not at `md`; below that, stack master above detail.
- **The detail opens with a title bar**: the object's name in `heading-2`, its kind in `text-muted`, status Badges, then a hairline `space-6` below. Actions on the whole object (delete it, `ghost` `error`) sit at the end of the title bar; each section keeps its own actions.
- Sections inside the detail are unframed: a `heading-3` title with the section's actions at the end of the same row, `space-8` between sections.
- **A sticky master** keeps the same air above and below: `top: 'calc(var(--app-header-offset) + token(spacing.6))'`, `maxHeight: 'calc(100dvh - var(--app-header-offset) - token(spacing.6) * 2)'`. Only its list scrolls; the search box above and the create button below keep `flexShrink: '0'`.
- A scroll box clips its rows' focus rings. Give it `padding: '1'` and `margin: '-1'`, so the ring fits inside the clip and the rows don't move.
- Mark a scroll edge with a hairline only while rows are hidden past it: two `divider` lines that stay with the box (`backgroundAttachment: 'scroll'`) under two `page-bg` covers that scroll with the content (`'local'`), which hide the lines when the list rests at that end.

## Charts

Koi has no chart component. These rules extend the brand book's "scales only for illustration and charts":

- Series may use scale steps. Pick them so adjacent series differ in lightness, not just hue, and check them in both themes.
- Axis ticks, legends and tooltips are `small` (12px) in `text-muted`. Series color goes on a dot or the mark, never on label text.
- Tooltips look like Koi popovers: `surface`, `border`, `radius-xl`, `shadow-float`.
- Values use `tabular-nums` and thousands separators. Gridlines and cursor lines use `divider`.

## Content pages (blog-like)

- Reading column at most `content-max`; long-form text in `prose`, rendered markdown in Prose.
- Wrap the page in `<ShapeProvider shape="pill">` for the blog's voice.
- Glass Cards go over imagery or color (a banner), never over the flat page.
- `space-10` / `md: 12` between list items, `space-16` between sections.

## Responsive

- The only breakpoint today is `md` (768px), defined in `panda.config.ts`. It isn't a token yet.
- Design the phone layout as its own composition: an element may **move** between breakpoints, not just stack. Render it twice (hidden at one breakpoint each) rather than contorting one element into both roles.
- On a phone, text is start-aligned and flows; edge-anchored navigation becomes a drawer that slides on `out`.
- Tables scroll sideways inside their own container; the page never scrolls sideways. Give a table a `min-width` when its columns shouldn't squeeze.
