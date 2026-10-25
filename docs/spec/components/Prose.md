# Prose

Koi's long-form type for rendered rich text: markdown output, CMS HTML, docs. It's the blog's article body (Tailwind Typography's `prose` with `prose-slate` and the Koi overrides in `MarkdownBody.astro`), so a post looks the same in an app as on the blog.

**When to use:** a block of HTML you didn't write element by element, such as `react-markdown` output, an article, release notes or an assistant reply. Don't use it for UI built from components; style that with the role tokens and type styles.

**The consumer supplies:** `children` (the rendered HTML) and `size`: `md` (16px, default) for articles and docs, `sm` (14px) for rich text that sits among UI text, like a comment or a description in a dense panel. Native div props pass through, so `dangerouslySetInnerHTML` works, and `className` lands on the root. Prose has no max width: put it in a reading column (`content-max` at most, around 65 characters per line reads best).

**Sizing: everything inside is em.** Heading sizes, margins, list indents, code and table padding are all em of the element they land on, worked out from the blog's px values at 16px. `size` only sets the root's font size, so the whole block scales from it: an `h1` is 36px in `md` and 31.5px in `sm`. A consumer's own `font-size` on the root (through `className`) scales it the same way. Line heights are unitless for the same reason. Only rules stay put at every size: hairlines (`stroke.hairline`), the blockquote rule (`prose.quote-rule`, 4px), the table head rule (`prose.head-rule`, 2px) and the `kbd` shadow drop (`prose.kbd-depth`, 3px).

**Styling** (sizes at the 16px base):
- Root: `prose-text`, `sans`, line height 1.75. The first child's top margin and the last child's bottom margin are 0.
- Paragraphs: 20px apart. `.lead`: 20px in `text-muted`.
- Headings, all `text`: `h1` 36px / 800, `h2` 24px / 700, `h3` 20px / 600, `h4` 16px / 600, `h5` 14px / 600, `h6` 14px / 600 in `text-muted`. Whatever follows `h2`–`h6` or `hr` has no top margin.
- Links: exactly Link's style. `link` text over a 2px dashed `link-border` underline, `link-hover-bg` behind it on hover, weight 500, and the focus ring.
- Bold: `text`, 600. Italic stays italic.
- Lists: disc and decimal markers in `text-muted`, 26px indent, items 2px apart (the blog's `prose-li:my-0.5`). `ol[type]` picks letters or roman numerals.
- Blockquote: `text`, italic, weight 500, a 4px `border` rule at the start and curly quotes added around it.
- Inline code: `text`, 600, 14px, inside backticks. Code blocks: `code-block-text` on `code-block-bg` (dark in both themes), 14px on a 24px line, `radius-sm` corners, scrolling sideways. Syntax highlighting is the app's; a highlighter's own background replaces the fill.
- `kbd`: a key cap with a `divider` outline and a 3px `divider` drop, 14px, with a little room between keys. A combination (`<kbd><kbd>Ctrl</kbd>+<kbd>C</kbd></kbd>`) gets padding around its inner keys.
- Images: `radius-lg` corners, 32px above and below. `figcaption`: 14px `text-muted`, 12px under the image.
- Tables: full width, cells at the body size on a 32px line, `text` header at 600 over a 2px `border` rule, 1px `border` between rows, no outer padding on the first and last column.
- `hr`: 1px `border`, 48px above and below. Description lists: `dt` in `text` at 600, `dd` indented 26px.

**Embedding components:** wrap a Koi component (or any markup Prose shouldn't touch) in an element with the class `koi-not-prose`. Everything inside it is left alone.

**Differences from the blog:**
- List markers are `text-muted`. The blog's slate-300 bullets are 1.5:1, below the 3:1 Koi needs for icons.
- Body text is `prose-text` (`secondary-700` / `secondary-300`), the gray step that matches the blog's slate. Headings, bold and code use `text`.
- Dark code blocks are `secondary-800`. Tailwind's `black / 0.5` disappears against Koi's dark `page-bg`.
- Link colors come from the Link tokens, one step darker than the blog in light mode for contrast.
- `h5` and `h6` are styled; Tailwind Typography leaves them as plain text.

**Not included:** syntax highlighting, heading anchors, footnote styling, a `lg` size.
