# Spinner

A small rotating ring for short, unmeasured waits.

**When to use:** inside buttons (Button's `loading` uses it), next to "加载中…" text, or centered in an area that's loading. For long or measurable work, use Progress.

**The consumer supplies:** `size` (`sm` 16px, `md` 20px, `lg` 32px) and `label` (the accessible name, default "加载中").

**Styling:** it draws in `currentColor`, so it takes the surrounding text color. Set `text-brand` on its parent for a branded spinner. It's a 25%-opacity ring with an arc that turns every 800ms.
