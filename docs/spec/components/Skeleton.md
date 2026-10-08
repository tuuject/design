# Skeleton

A shimmering placeholder that stands in for content while it loads. It supplies only the fill color and the animation: its shape is up to you.

**When to use:** first loads of lists, cards and profiles, where the layout is known but the data isn't. Draw placeholders roughly the shape of the real content so nothing jumps when it arrives. For short waits inside a button or next to text, use Spinner; for measurable work, use Progress.

**The consumer supplies:**
- `className` or `style` with the shape: `width`, `height`, `border-radius`, margins and layout. Skeleton sets none of these, so a 40px circle is `width: 40px; height: 40px; border-radius: 9999px` in your own CSS. Reuse the system's radii (`radius-full` for avatars and pills, `radius-sm` or `radius-lg` for text lines, `radius-panel` for card covers) so the placeholder matches what replaces it.
- Optionally `as` (default `div`; use `span` inside a line of text).
- Optionally `children`: content to size the skeleton by. It keeps its space in the layout but is hidden, so `<Skeleton>示例标题</Skeleton>` is exactly one title tall and wide.
- Other HTML attributes pass through.

**Behavior:**
- Each Skeleton is `aria-hidden`. Mark the loading region itself with `aria-busy="true"` and an accessible name such as "加载中", then remove both when the content arrives.
- The shimmer is painted against the viewport (`background-attachment: fixed`), so every skeleton on the page sweeps as one band no matter its size. iOS Safari ignores fixed backgrounds, so there each skeleton shimmers on its own.
- With reduced motion, the shimmer stops and only the flat fill remains.

**Styling:**
- Fill: `skeleton` (gray-100 light, gray-800 dark).
- Shimmer: a soft `skeleton-highlight` band (gray-50 light, gray-700 dark) that crosses the screen every 1.6s.
