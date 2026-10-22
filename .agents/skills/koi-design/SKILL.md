---
name: koi-design
description: Koi's visual design language for anything built on or inside the Koi design system — pages, screens and dashboards composed from @koi/react (Panda CSS) or @koi/native (Tamagui), the Admin template, the blog, Bilisound screens, and new components in this repo. Covers role tokens over raw scales, sky action / amber link color semantics, the 14px base and type styles, rounded-vs-pill shape rules, translucency instead of shadows, spring motion, Font Awesome Solid icons, component selection, dashboard composition, Chinese UI copy, and a pre-delivery review checklist. Use when designing, styling, restyling or reviewing any UI that uses Koi, or when the user mentions Koi design, Koi 风格, or Koi tokens. Takes precedence over the generic web-design-taste skill wherever the two disagree. Do NOT use for porting a legacy component (use port-component) or for copywriting beyond UI strings.
---

# Koi Design

> Soft, rounded, roomy. Sky means action, amber means link. Depth comes from translucency, not shadows. Roundness and springy motion are the identity; a palette swap never touches them.

## Ground rules

- **This skill is a map, not the source of truth.** The sources, in precedence order:
  1. Explicit instructions in the current conversation.
  2. `docs/spec/components/<Name>.md` for the component in question.
  3. `docs/spec/README.md` (the brand book).
  4. The `usage` line of each token in `packages/tokens/src/tokens.json`.
  5. AGENTS.md's Design Invariants.
  6. This skill and its references.

  If this skill disagrees with a source above it, the source wins; fix the skill in the same change.
- **Koi outranks `web-design-taste`.** Don't load both and average them; see `references/web-design-taste.md` for what carries over and what Koi overrides.
- **Use a component before styling a `div`.** A hand-styled lookalike drifts the moment the component changes.
- When the user overrides a rule, that is new evidence: offer to update the spec (a system rule) or this skill (composition taste).

## Core rules

These hold on every task. The references explain them and add the detail.

- **Color:** role tokens only (`surface`, `text-muted`, `action`, `border-control`); scale steps only for illustration and chart series; never a literal or a per-theme override. Sky = action, amber = links and small highlights (an accent Button at most once per view), status always paired with an icon or word.
- **Type:** `fontFamily: 'sans'`, 14px `body` base, named text styles only, weights 400 / 700.
- **Shape:** buttons `rounded` 8px by default (`pill` via `shape` or `ShapeProvider`), one shape per button group; tabs, tags, badges, Switch always pills; fields 12, cards 24, dialogs 32, concentric corners.
- **Depth:** no shadows on buttons or cards; `raised` only for the active tab and switch thumb, `float` only for things over the page; glass only over imagery or color. Never nest cards.
- **Size:** control heights 28 / 36 / 44, one height per row; spacing on the 4px `space-*` scale; when in doubt, one step looser.
- **Motion:** colors 150ms; moving things on `spring`, edge-anchored drawers on `out` 200ms; respect reduced motion.
- **Icons:** Font Awesome Free Solid as Iconify data through `Icon`, `currentColor`, icon size tokens; no emoji.
- **Copy:** Simplified Chinese, short and plain; buttons are verbs ("保存"), navigation nouns ("首页"); errors written as the fix ("邮箱格式不太对，请检查一下。"); dates like "Oct 7, 2026"; optional fields "（选填）"; no decorative English. Component copy comes from `strings` in `@koi/core`.

## References

Read only what the task needs:

| Read | When |
| --- | --- |
| `references/color.md` | Picking a role token for anything; palettes, dark mode, contrast pairs |
| `references/foundations.md` | Type styles, the radius table, shadows and glass, spacing meanings, motion curves, icons, focus |
| `references/components.md` | Choosing between components (Badge vs Tag, Alert vs Toast, Select vs SelectPanel…); button color / variant rules; forms |
| `references/layouts.md` | Composing a page, dashboard or admin screen; charts; blog-like content pages; responsive recomposition |
| `references/code.md` | Writing the styles: Panda `css()` token names and pitfalls, Tamagui theme keys |
| `references/web-design-taste.md` | The general skill is also in play, or a rule from it seems to apply |
| `docs/spec/components/<Name>.md` | Before using a component in an unusual way, or changing one |

## Review checklist

Before presenting a design or a diff:

1. Any scale step or literal color outside illustration / charts? Any per-theme color override?
2. Amber on anything clickable that isn't a link, or for status? More than one accent Button in the view?
3. Every status color paired with an icon or a word?
4. Any raw `fontSize`, or a weight other than 400 / 700?
5. Any radius off the vocabulary? One shape per button group? Pills where Koi requires them? Nested corners concentric?
6. Any shadow on a button or a card? Glass on a flat background? A card in a card, or around a bordered component?
7. Controls in one row sharing one height? Icons sized by token?
8. Spacing on the scale, page padding even on all sides? Tight → loosen a step. Lost → one frame per area.
9. Color transitions 150ms; moving things on spring (`out` for edge-anchored); reduced motion respected?
10. Icons filled and in `currentColor`, no emoji, icon-only controls named?
11. Copy in Chinese, verbs on buttons, errors as fixes, no decorative English?
12. Could a Koi component replace something hand-styled?
13. New role-on-background pair added to `contrast-pairs.json`?
14. Checked in **both themes** and under the `rose` palette?

## Verification

- `pnpm check` and `pnpm lint` must pass.
- Components: `pnpm shots <Name>`, then open the light and dark PNGs; `KOI_PALETTE=rose` / `KOI_FONT=chill` for the other palette and font.
- Admin pages: take over `pnpm dev:admin` if it's running (`pnpm dev:admin:status`), else start it in the background; screenshot light and dark, desktop and phone width.
- Details and how to report results: `agent-doc/verification.md`.
