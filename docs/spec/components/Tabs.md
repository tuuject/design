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
