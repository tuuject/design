# Badge

A small, non-interactive pill label for status or counts.

**When to use:** to mark state ("已发布", "草稿") or a count next to something. It isn't clickable. For filters or removable chips, use Tag.

**The consumer supplies:** a short label (one or two words, or a number), `tone` (`neutral`/`primary`/`accent`/`warning`/`error`/`solid`) and optionally `dot`.

**Styling:**
- Size: 22px tall with 10px side padding and `radius-full` corners. Text is `caption` type (12px bold).
- Tones:
  - `neutral`: `surface-muted`
  - `primary`: `action-subtle`
  - `accent`: `highlight`, Koi's amber in a small dose
  - `warning`, `error`: their status surfaces
  - `solid`: `action`
- All tones keep 4.5:1+ text in both themes.
