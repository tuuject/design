# Switch

A pill toggle whose thumb slides on Koi's springy curve.

**When to use:** a setting that takes effect immediately, such as a preference or feature toggle. If the change only applies after a Save button, use Checkbox instead.

**The consumer supplies:** `label`, `checked`/`onCheckedChange` or `defaultChecked`, and optionally `disabled`. It renders a `button` with `role="switch"` and `aria-checked`.

**Styling:**
- Track: 36 × 20px with `radius-full` corners. It's `border-control` when off (3:1 on `surface`) and `control-checked` when on.
- Thumb: a 14px `white` circle with `shadow-raised`, moving over 400ms on `cubic-bezier(.47,1.64,.41,.8)`. That's the same spring as the blog's mobile menu.
