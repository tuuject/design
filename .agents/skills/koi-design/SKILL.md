---
name: koi-design
description: Koi's visual design language for anything built on or inside the Koi design system — pages, screens and dashboards composed from @tuuject/koi-react (Panda CSS) or @tuuject/koi-native (Tamagui), the Admin template, the blog, Bilisound screens, new components in this repo, and other projects that install the packages from npm. Covers role tokens over raw scales, sky action / amber link color semantics, the 14px base and type styles, rounded-vs-pill shape rules, translucency instead of shadows, spring motion, Font Awesome Solid icons, component selection, dashboard composition, Chinese UI copy, and a pre-delivery review checklist. Use when designing, styling, restyling or reviewing any UI that uses Koi, or when the user mentions Koi design, Koi 风格, or Koi tokens. Takes precedence over the generic web-design-taste skill wherever the two disagree. Do NOT use for porting a legacy component (use port-component) or for copywriting beyond UI strings.
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
- **Which Koi are you in?** If this repo has `packages/tokens/src/tokens.json` and `docs/spec/`, you are inside koi-ui: the sources and commands below apply. If it only depends on `@tuuject/koi-*` in `package.json`, you are a consumer: read the installed package READMEs and `node_modules/@tuuject/koi-tokens/src/tokens.json`, and get `docs/spec/` from the GitHub repo; koi-ui's `pnpm check`, `pnpm shots` and `pnpm dev:admin` do not exist there. Setup, admin-template copying and migration boundaries: `references/consumer.md`.
- **Koi outranks `web-design-taste`.** Don't load both and average them; see `references/web-design-taste.md` for what carries over and what Koi overrides.
- **Use a component before styling a `div`.** A hand-styled lookalike drifts the moment the component changes.
- When the user overrides a rule, that is new evidence: offer to update the spec (a system rule) or this skill (composition taste).

## Core rules

These hold on every task. The references explain them and add the detail.

- **Color:** role tokens only (`surface`, `text-muted`, `action`, `border-control`); scale steps only for illustration and chart series; never a literal or a per-theme override. Sky = action, amber = links and small highlights (an accent Button at most once per view), status always paired with an icon or word.
- **Type:** `fontFamily: 'sans'`, 14px `body` base, named text styles only (they carry the weight). Beside 14px content, mark secondary text with `text-muted` or weight, not by dropping to 12px.
- **Shape:** buttons `rounded` 8px by default (`pill` via `shape` or `ShapeProvider`), one shape per button group; tabs, tags, badges, Switch always pills; fields 12, cards 24, dialogs 32, concentric corners.
- **Depth:** no shadows on buttons or cards; `raised` only for the active tab and switch thumb, `float` only for things over the page; glass only over imagery or color. Never nest cards; the areas of one continuous workspace are split by `divider` hairlines, not framed.
- **Size:** control heights 28 / 36 / 44, one height per row; `md` by default, `sm` only inside dense containers (table cells, tags), never `sm` for icon-only controls; spacing on the 4px `space-*` scale; when in doubt, one step looser.
- **Motion:** colors 150ms; moving things on `spring`, edge-anchored drawers on `out` 200ms; respect reduced motion.
- **Icons:** Font Awesome Free Solid as Iconify data through `Icon`, `currentColor`, icon size tokens; no emoji.
- **Copy:** Simplified Chinese, short and plain; buttons are verbs ("保存"), navigation nouns ("首页"); errors written as the fix ("邮箱格式不太对，请检查一下。"); dates like "Oct 7, 2026"; optional fields "（选填）"; no decorative English; the user's words, not the implementation's: no config keys, enum values, file names, internal codenames or protocol acronyms as labels (`base_url` → "接口地址", TTFB → "首次响应"), product names kept as they are, and a raw identifier only where the user has to copy or match it, in mono; no middle dots (`U+00B7`, `U+30FB`, look-alikes) as separators: separate inline meta with a layout gap, or with ，、 in a sentence (a name or title that contains one keeps it, marked `koi-allow-dot: <reason>`). Component copy comes from `strings` in `@tuuject/koi-core`, so it is Chinese: in a product with its own locale, pass labels explicitly where props allow and treat the remaining built-in strings (some aria-labels, empty states) as a known gap rather than half-translating around them.

## References

Read only what the task needs:

| Read | When |
| --- | --- |
| `references/color.md` | Picking a role token for anything; palettes, dark mode, contrast pairs |
| `references/foundations.md` | Type styles, the radius table, shadows and glass, spacing meanings, motion curves, icons, focus |
| `references/components.md` | Choosing between components (Badge vs Tag, Alert vs Toast, Select vs SelectPanel…); button color / variant rules; forms |
| `references/layouts.md` | Composing a page, dashboard or admin screen; master–detail workspaces; charts; blog-like content pages; responsive recomposition |
| `references/code.md` | Writing the styles: Panda `css()` token names and pitfalls, Tamagui theme keys |
| `references/web-design-taste.md` | The general skill is also in play, or a rule from it seems to apply |
| `references/consumer.md` | The project installs `@tuuject/koi-*` from npm instead of living in koi-ui; wiring Panda, copying the Admin template, migrating from another stack |
| `docs/spec/components/<Name>.md` | Before using a component in an unusual way, or changing one |

## Review checklist

Before presenting a design or a diff:

1. Any scale step or literal color outside illustration / charts? Any per-theme color override?
2. Amber on anything clickable that isn't a link, or for status? More than one accent Button in the view?
3. Every status color paired with an icon or a word?
4. Any raw `fontSize` or hand-set `fontWeight`? Anything at 12px beside 14px content that should be `text-muted` instead? A stacked second line that isn't `small` `text-muted`, or a lone line that is? Changing counts without `tabular-nums`?
5. Any radius off the vocabulary? One shape per button group? Pills where Koi requires them? Nested corners concentric?
6. Any shadow on a button or a card? Glass on a flat background? A card in a card, or around a bordered component? Parts of one workspace framed in Cards instead of split by hairlines?
7. Controls in one row sharing one height? Page-level controls `md`, not `sm`? Icons sized by token?
8. Tables: any cell cut off with an ellipsis on real data? Spare width pooling into one wide gap?
9. Spacing on the scale, page padding even on all sides? Tight → loosen a step. Lost → one frame per area.
10. Color transitions 150ms; moving things on spring (`out` for edge-anchored); reduced motion respected?
11. Icons filled and in `currentColor`, no emoji, icon-only controls named?
12. Copy in Chinese, verbs on buttons, errors as fixes, no decorative English, no middle-dot separators? Any config key, enum value or acronym shown as a label? Unfamiliar fields explained in `help`?
13. Could a Koi component replace something hand-styled?
14. New role-on-background pair added to `contrast-pairs.json`?
15. Checked in **both themes** and under the `rose` palette?
16. Consumer project: `designSystem` set, no `presets` / `staticCss` duplication, no `node_modules` in `include`, no import from `@tuuject/koi-react/src` or `packages/`, theme through `data-theme` rather than a `.dark` class?

## Verification

**Inside koi-ui:**

- `pnpm check` and `pnpm lint` must pass.
- Components: `pnpm shots <Name>`, then open the light and dark PNGs; `KOI_PALETTE=rose` / `KOI_FONT=chill` for the other palette and font.
- Admin pages: take over `pnpm dev:admin` if it's running (`pnpm dev:admin:status`), else start it in the background; screenshot light and dark, desktop and phone width.
- Details and how to report results: `agent-doc/verification.md`.

**In a consumer app (npm packages):**

- Run the app's own commands (`tsc`, `build`, `e2e`, its dev server); never substitute koi-ui's `pnpm check` or `pnpm shots`.
- Confirm `designSystem: '@tuuject/koi-react'`, the `@layer reset, base, tokens, recipes, utilities;` line, and `theme-init` before CSS.
- Open light and dark, and `data-palette="rose"`; check desktop and phone widths. Then run the affected product flows (login, guards, filters, forms, dialogs, toasts).
- Details: `references/consumer.md` and the GitHub `agent-doc/consuming-koi.md`.
