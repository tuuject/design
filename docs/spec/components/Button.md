# Button

The fully rounded pill button: Koi's pagination button, generalized into five colors, four variants, three sizes and an optional squarer `rounded` shape.

**When to use:** any action. Choose `color` for what the action means and `variant` for how loud it should be.

**Color** (`color`, default `primary`):
- `primary` (sky): the main action of a view.
- `accent` (amber): a highlight action, such as a promotion or "new" call to action. Use it at most once per view, and never right beside a solid `primary`.
- `secondary` (gray): neutral actions such as cancel, back and close.
- `warning` (yellow): actions with consequences worth a second look ("强制同步").
- `error` (red): destructive actions such as delete or remove, usually confirmed in a Dialog.

**Variant** (`variant`, default `solid`):
- `solid`: full fill, no shadow; the strongest. Use one solid button per group.
- `soft`: tinted fill; for alternatives next to a solid button.
- `outline`: transparent with a colored edge; for secondary actions on busy surfaces.
- `ghost`: text only; for toolbars, dialogs and low-emphasis actions.
- `outline` and `ghost` fill with the soft color on hover.

**The consumer supplies:** a short verb label in Chinese ("保存", "发布文章"), `onClick` or `href` (which renders an `<a>`), and optionally `color`, `variant`, `size`, `shape`, `iconStart`/`iconEnd`, `loading`, `fullWidth` and `disabled`. All native button attributes pass through, and a `ref` reaches the element.

**Earlier names still work:** `variant="primary"` means solid, `variant="secondary"` means soft, and `variant="danger"` means solid with `color="error"`.

**Styling:**
- Each color has eight tokens: `<color>-solid`, `<color>-solid-hover`, `on-<color>-solid`, `<color>-soft`, `<color>-soft-hover`, `on-<color>-soft`, `<color>-fg` (outline and ghost text) and `<color>-edge` (outline border).
- Every text pairing reaches 4.5:1 and every outline edge 3:1, in both themes. Amber and yellow solids use dark text, because white doesn't read on them.
- Shape: `radius-full` by default. `shape="rounded"` uses `radius-lg` (8px, Tailwind `rounded-lg`). Rounded is the dense shape: at `sm` its sides are 8px instead of 12px, so adjacent actions in a table row or toolbar don't read as spread apart.
- Heights: `control-sm` 28px / `control-md` 36px / `control-lg` 44px. Labels are `button` (14px), or `button-sm` (12px) at `sm`; icons are 16px (14px at `sm`).
- No variant has a shadow: buttons stay flat, and color alone sets their weight.
- Press: on release, a soft ripple in the button's `<color>-solid` (a box-shadow, 45% → 0% over `ripple` 600ms, `out` easing) spreads 6px out from the edge and fades. It's a transition, so a quick click plays it in full; it ends with no shadow, and reduced motion skips it.
- Focus: a 2px `focus-ring` outline at a 2px offset.

- Do keep labels to one line.
- Don't put two solid buttons side by side, and don't use color alone to signal danger: say it in the label too ("删除").
- Pick one shape per group of buttons. Pills are Koi's default voice; use `rounded` where buttons sit among square-cornered things (toolbars, tables, dense forms, input groups). Table cells and Dialog footers make `rounded` the default for the buttons inside them.
- `loading` keeps the button's width steady and announces itself with `aria-busy`. A loading button looks disabled (50% opacity) but keeps its spinner turning and shows a `progress` cursor.
