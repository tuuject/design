# PageHeader

The top of a page: its `h1`, an optional one-line description and an optional mark beside the title, with the page's own controls on the right.

**When to use:** once, at the top of every page in an app or admin console, so titles, descriptions and page-level actions line up from page to page. It's the page's heading, not a Card header (use Card's `title`) and not a section heading (use an `h2`).

**The consumer supplies:** `title` (the `h1`), optionally `description` (one line under it), `actions` (page-level controls: buttons, a filter trigger, a switch) and `info` (a mark beside the title that explains the page, usually an IconButton opening a Tooltip). All four are nodes, so the copy and the controls stay the consumer's. `className` lands on the root and `classNames` (keyed `main`, `titleRow`, `title`, `info`, `description`, `actions`) adds classes to the inner parts.

**Styling:**
- Root: a `<header>`, a flex row with `space-between`, `align-items: flex-start`, wrapping, a `space-4` (16px) gap and `space-6` (24px) below it before the page content starts.
- Title block: takes the leftover width (`flex: 1`) and may shrink (`min-width: 0`), a column with a `space-1` (4px) gap.
- Title: `heading-1` in bold `text`, no margin. It sits in a row with the `info` mark, which keeps its size and never squeezes the title.
- Description: `body` (14px) in `text-muted`, no margin. It wraps rather than pushing the actions off the row.
- Actions: pinned right (`margin-inline-start: auto`), never shrunk, wrapping onto more lines when there are several controls, `space-2` (8px) apart.
- Narrow: the header is its own container, and below ~480px of header width the actions take a full row under the title block. The width that matters is the header's, not the viewport's: the same header sits in a full-width page and in a form page's 768px column.

- Do put only page-level controls in `actions`; a control that belongs to one card goes in that card's header.
- Don't repeat the page title in the Breadcrumb and in the PageHeader description; the title belongs here, the trail only says where it is.
