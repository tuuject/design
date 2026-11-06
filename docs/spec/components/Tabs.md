# Tabs

A segmented pill track that switches between views. The active tab lifts out as a white pill.

**When to use:** 2–6 peer views of the same content (categories, time ranges). Don't use it for steps in a sequence, or for navigating between pages.

**The consumer supplies:** `items` (`{value, label, content?, disabled?}`), `value`/`onChange` or `defaultValue`, a `label` for the tab list, and optionally `fullWidth`. Leave `content` out to use Tabs as a pure segmented control.

**Styling:**
- Track: `surface-muted` with `radius-full` corners and `space-1` padding.
- Tabs: `control-md` (36px) tall with `space-4` (16px) side padding, in `body` (14px) type. The tab itself matches a default button or input, and the whole track is 44px (`control-lg`).
- Inactive tabs: `text-muted`.
- Active tab: a `surface` pill with `shadow-raised` and bold `text`.

**Keyboard:** ←/→ move between tabs, and Home/End jump to the first or last. The roles are tablist, tab and tabpanel.

**Narrow screens:** with more tabs than fit (six tabs in a 280px row), the track scrolls sideways instead of clipping the last tabs or widening the page: wheel, trackpad and touch all scroll it, and ←/→ move the selection into view. The scrollbar itself is hidden, so it still reads as one pill; the active pill follows the scroll (the indicator adds the track's scroll offset to its measurement). Tabs keep their full label width (`flex-shrink: 0`) and never wrap, and the root is `min-width: 0` so it can sit in a narrow column. The alternative for many views is a SelectPanel dropdown, not a second row of tabs.
