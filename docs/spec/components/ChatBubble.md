# ChatBubble

A single chat or comment message: a soft panel whose fill and anchor corner tell the reader whose words they are.

**When to use:** chat threads, comment lists, support conversations. Compose the row (avatar, name, time, alignment) in the app; this component is only the bubble.

**The consumer supplies:** the message as `children`, and `side`: `received` (default) or `sent`.

**Styling:**
- Shape: `radius-xl` (12px), with the anchor corner (bottom-left for `received`, bottom-right for `sent`) at `radius-sm` (6px) so a column of bubbles reads directionally.
- `received`: a `surface-muted` fill, `text` color, no border.
- `sent`: an `action` fill with `on-action` text.
- Type: `body` (14px). Long words wrap (`overflow-wrap: break-word`); the bubble caps at 480px and never stretches to fill its row.
- No shadow, no transition: the bubble is static; only alignment moves, and that's the app's layout.

**Accessibility:** plain text in a `<div>`. No ARIA needed; the sender's name and time, if shown, are the app's markup.
