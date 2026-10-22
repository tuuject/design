# Relation to web-design-taste

`web-design-taste` is the general taste Koi grew out of. Koi outranks it: where they agree, its rules still apply; where they conflict, follow Koi. Don't load both and average them.

## Carried over

These rules from the general skill still hold in Koi:

- **Subtract before styling.** A section that repeats information found elsewhere is deleted, not restyled, and its now-unused wrappers go with it.
- **No costume.** No glow, no exaggerated gradients, no SaaS-landing look, no editorial print pastiche, no serif display face to look "designed".
- No tinted zone backgrounds, no colored bar across a card's top, no colored rule under a heading. A section heading is a heading and nothing else.
- No decorative English, no `uppercase`, no wide letter-spacing as ornament.
- Recompose per breakpoint; on a phone, text is start-aligned and flows.
- Raster images go through the framework's image pipeline at their displayed size with 1x/2x densities; no borders on images.
- Decoration is allowed only when it carries identity (a persona illustration), and stays faint: inert (`alt=""`, `aria-hidden`, `pointer-events: none`), large, around 7% opacity, behind text.
- External links carry `target="_blank" rel="noopener noreferrer"` (Link's `external` does this).
- No in-page buttons that duplicate a browser feature; no unrequested theme switcher.
- A shipped site has its own favicon set and OG card, never the framework's.
- If a page has a print form, every interactive affordance needs a paper form.

## Overridden

| web-design-taste | Koi |
| --- | --- |
| Three roles `primary-*` / `accent-*` / `secondary-*` used directly | Role tokens only; scales only for illustration and charts |
| Links are primary; hover resolves to primary | Inline links are amber `link` with a dashed underline; amber means "link" |
| Accent is opt-in, often zero | Accent is the link color and small highlights; an accent Button at most once per view |
| Pair every color with `dark:` | Role tokens carry both themes; never write per-theme colors |
| De-emphasize with `opacity-60` | `text-muted` (it *is* the blog's 60%) |
| Tinted chip keeps neutral text | Use the fill's paired `on-*` token |
| Cards get a soft shadow at wide breakpoints | Cards never have a shadow; depth is translucency |
| `rounded-lg` / `rounded-2xl` freely | The fixed radius vocabulary; cards 24, fields 12, buttons 8 |
| `transition-colors duration-200` | 150ms `fast`; moving things on `spring` |
| Touch targets `size-12` circles | Control heights 28 / 36 / 44; same height per row |
| Remix Icon for UI, sizes in `em` | Font Awesome Free Solid via Iconify data; icon size tokens |
| Tailwind spacing scale, `px-*` utilities | Koi `space-*` tokens via Panda (bare numbers) |
| System sans, no web font unless asked | Same default, but always through the `sans` token; ChillRoundF via `data-font="chill"` |
| KPIs share one card | Follow the Admin template's composition; the shared rule is "never nest frames" |
| A table inside a card goes flush to the edges | Follow the Table spec: list pages put the table on the page; elsewhere it sits inside the Card's padding |
