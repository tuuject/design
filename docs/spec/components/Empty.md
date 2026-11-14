# Empty

A quiet placeholder for a place with nothing to show: an icon over a short title, with an optional description and a way out.

**When to use:** a list, table, search result or detail view with no content, whether nothing has been created yet, nothing matched the filters, or loading failed. It's a state of the page, not a container: don't wrap it in a Card for its own sake. For a one-line field hint, use the Field's description; while content is still arriving, use Skeleton.

**The consumer supplies:** `icon`, `title`, `description` and `action`, all optional nodes, so the copy is the consumer's. `variant="plain"` drops the block padding and keeps the title in the muted body style, for a table cell; leave it out for a page-level state. `className` lands on the root, and `classNames` (keyed `icon`, `title`, `description`, `action`) adds classes to the inner parts.

**Styling:**
- Layout: a centered column with a `space-2` (8px) gap, `space-4` (16px) sides and `space-10` (40px) block padding, in `body` (14px) `text-muted`. The generous block padding is what makes it read as a state rather than a paragraph.
- Icon: `inline-flex` in `text-muted`, with no size of its own: an `Icon` or an illustration keeps the size it was given. A 24–32px icon reads best; the empty-state icon is decorative.
- Title: `label` (14px bold) in `text`, so it's the one line that stands out from the muted copy.
- Description: `small` (12px) in `text-muted`, for what happened and what to do next. Both title and description wrap (and hyphenate with the page's `lang`) inside the centred column.
- Action: 16px above the copy (the column's 8px gap plus 8px), centered, and wraps when there are several controls. Usually one Button; it keeps the surrounding shape (a pill page gives a pill button).
- No background, border or radius of its own: it takes whatever it sits on, the page or a Card.

**In a table:** TableEmpty renders Empty's `plain` variant inside its cell with the table's own title (default "暂无数据"), and forwards optional `icon`, `description` and `action`. The cell keeps the table's muted 14px copy and its own 16px / 40px padding, so the row still reads as table text. See Table.
