# Breadcrumb

The trail from the app's home to the page being shown, as one row in a topbar: muted ancestors that turn brand on hover, the current page in bold.

**When to use:** a page inside a hierarchy (an admin console, a documentation site) where the reader benefits from knowing where they are and can jump back up. It's orientation, not navigation: the main way around is the NavMenu. Don't repeat the page title in it on a page that already has a PageHeader title, and don't use it for steps in a sequence (that's a wizard).

**The consumer supplies:** `items`, outermost page first and the current one last. Each item is `{ label, href?, current?, onSelect? }`:
- `label` is the crumb's text.
- `href` renders it as a link. An item without one is plain text.
- `current` marks the page being shown: bold, in `text`, and carrying `aria-current="page"`. Usually the last item; an item that is both `href` and `current` renders as text.
- `onSelect(details)` fires when a linked crumb is clicked, with `details.reason = 'link-press'` and `details.event` the DOM event. With client-side routing call `details.event.preventDefault()` and navigate yourself; `details.cancel()` prevents the default too, rejecting the navigation. Modified clicks (Ctrl/Cmd/Shift/Alt) should be let through without preventing the default, so "open in a new tab" still works.
- `label` sets the nav landmark's accessible name (default "面包屑").

The component knows nothing about a router: the app builds the items from its own routes (the admin template reads each route's `staticData.title`). `className` lands on the root and `classNames` (keyed `list`, `item`, `separator`, `label`) adds classes to the inner parts.

**Styling:**
- Root: a `<nav>` with an `<ol>` inside, one row, `space-1` (8px) gaps between crumbs and on both sides of each chevron. It has no background, border or padding of its own, so it sits directly in a topbar.
- Ancestors: the Link's `plain` variant, `text-muted` that turns `text-brand` on hover, no underline and no tint.
- Current page: `text` in bold, no link behaviour.
- Separators: `ChevronRightIcon` at 14px (`icon-sm`) in `text-muted`, decorative (`aria-hidden`), so screen readers read only the crumbs. The chevron points along the reading direction, so it mirrors in RTL.
- Truncation: the root and the list are `min-width: 0` with hidden overflow, and every crumb's text is a single line with `text-overflow: ellipsis`. Ancestors keep their width (a crumb is a section name, not a sentence) and the current page is the one that gives way, so a long title ends in an ellipsis instead of squeezing "首页" to one character or widening the topbar. The chevrons keep their size, and every crumb carries its full text as a `title`, so a shortened one stays readable.
- Keyboard: the crumbs are ordinary links, so Tab walks them and Enter follows. The focus ring is drawn just inside the crumb (`outline-offset: -2px`), because the trail clips sideways to stay in the topbar.

- Do keep labels short: a section name, not a sentence.
- Don't put buttons, menus or counts in a crumb; the trail is text and links only.
