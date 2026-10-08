# Toast

A short, floating confirmation on Koi's frosted glass, the same material as the blog's nav pill.

**When to use:** quick feedback after an action that doesn't need a response ("已保存", "已复制链接"). It disappears after 4 seconds. Anything the user must act on belongs in an Alert or a Dialog.

**The consumer supplies:**
- Wrap the app once in `<ToastProvider>` (optional `position`: `bottom` by default, or `top`).
- Then call `useToast().toast({tone, title, description, action, duration})` from any component. `tone` is `info`, `success`, `warning` or `error`. `duration` is in ms, and 0 keeps the toast until it's closed.
- `Toast` itself can also be rendered directly.

**Styling:**
- Material: `surface-glass-tint` with a `blur-float` backdrop, `radius-panel` (24px) corners like Cards and Dialogs, and `shadow-float`. It has no border: the shadow alone lifts it off the page.
- Entrance: it rises in on the spring curve.
- Icons: `text-brand` for info and success, the status text colors for warning and error.
- Size: 360px wide with `space-4` (16px) padding and a `space-3` (12px) gap between icon and text; a 16px bold title and a 14px description `space-1` (4px) apart, with an 18px icon. That's one step above the page's 14px base on purpose: a toast is glanced at for a few seconds, so it reads larger than the text around it.
- At most 4 toasts stack at once.
