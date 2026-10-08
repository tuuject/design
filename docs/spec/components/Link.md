# Link

An inline text link in Koi's signature style: amber text over a 2px dashed underline that fills with a soft tint on hover.

**When to use:** links inside running text. For standalone actions, use Button (`ghost` for a quiet one).

**The consumer supplies:** `href`, the link text, and `external` for off-site links. `external` adds `target="_blank"`, `rel="noopener noreferrer"`, an arrow glyph and a screen-reader note ("在新窗口打开").

**Styling:**
- Text: `link`, which is `accent-700` in light. That's one step darker than the blog's `accent-600`, so it reaches 5:1 at body size.
- Underline: dashed `link-border`.
- Hover: `link-hover-bg` behind the text and a `link-hover-border` underline.

- Don't use amber for anything else clickable. Amber means "link".
