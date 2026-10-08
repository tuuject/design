# Card

A rounded container (24px corners) that groups related content. Its `glass` variant is Koi's frosted content panel.

**When to use:** list items with a title and actions, settings groups, summaries. Use `glass` only over imagery or color, as the blog does over its banner. Don't nest cards.

**The consumer supplies:** `children`, and optionally `title`, `description`, `media` (full-bleed content on top, e.g. an `<img>`), `footer` (actions, aligned right), `variant` (`outlined` by default, `filled` or `glass`) and `padding="none"`. Native div props pass through.

**Styling:**
- Shape: `radius-panel` corners, `space-5` padding and `space-3` gaps.
- `outlined`: `surface` with a 1px `border`.
- `filled`: `surface-muted`.
- `glass`: `surface-glass` with a `blur-panel` backdrop.
- Title: `heading-3` (16px). Body: `body` (14px). Description: `small` (12px) in `text-muted`.
- No shadow. Koi layers with translucency, not elevation.
