# Link

An inline text link in Koi's signature style: amber text over a 2px dashed underline that fills with a soft tint on hover.

**When to use:** links inside running text. For standalone actions, use Button (`ghost` for a quiet one). For a row of navigation links such as breadcrumbs, use `variant="plain"`.

**The consumer supplies:** `href`, the link text, `variant` (`underline` by default, or `plain`), and `external` for off-site links. `external` adds `target="_blank"`, `rel="noopener noreferrer"`, an arrow glyph and a screen-reader note ("在新窗口打开").

**Styling:**
- Text: `link`, which is `accent-700` in light. That's one step darker than the blog's `accent-600`, so it reaches 5:1 at body size.
- `underline`: dashed `link-border` underline; hover fills `link-hover-bg` behind the text and draws the underline in `link-hover-border`.
- `plain`: secondary `text-muted`, no underline and no tint in any state; hover turns `text-brand` (the primary text role). For navigation rows such as breadcrumbs, where a link reads as a muted label until pointed at.

- Don't use amber for anything else clickable. Amber means "link". The one exception is `plain`: it's not amber at rest and only turns brand on hover, so keep it to navigation rows, never to inline links.
