# Avatar

A round (or rounded-square) picture of a person or site, with initials as the fallback.

**When to use:** next to author names, comments and friend links. The blog's nav avatar is `lg`, and its friend avatars are `xl` with `shape="square"`.

**The consumer supplies:** `name`, which is required in practice: it's the alt text and the source of the fallback (the first character for Chinese names, otherwise up to two initials). Optionally `src`, `size` (`sm` 28px, `md` 36px, `lg` 44px, `xl` 64px) and `shape` (`circle` or `square`). If the image fails to load, it falls back to initials.

**Styling:** `radius-full`, or `radius-xl` when square. The fallback uses `action-subtle` with bold `on-action-subtle` initials.
