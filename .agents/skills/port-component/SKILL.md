---
name: port-component
description: Port one Koi component from the legacy bundle to Base UI + Panda CSS v2. Use when the user says "port <Component>", "port-component <Component>", "移植 <Component>", or asks to port a component from the legacy web bundle to the new React package.
argument-hint: <ComponentName>
---

Port the Koi component **$ARGUMENTS** to `packages/react`.

1. Read `docs/spec/components/$ARGUMENTS.md`, the `$ARGUMENTS` section of `reference/legacy-web/components/bundle.js`, its rules in `reference/legacy-web/components/bundle.css`, and its props in `reference/legacy-web/components/index.d.ts`. Check `agent-doc/plan.md` (Phase 1 remaining) and `agent-doc/web-port-record.md` for which Base UI part to build on, and read that part's docs (Base UI ships them as markdown in `node_modules/@base-ui/react/docs/`).
2. Write the recipe (or slot recipe) in `packages/react/src/recipes/<name>.ts` with role tokens only and no literal sizes (shared sizes by token name, the component's own from the `component` group in `tokens.json` through `toPx()`; see `agent-doc/tokens.md`), and register it in `recipes/index.ts`. Read component state and measured sizes through `state.*` / `vars.*` from `recipes/headless.ts`, never Base UI's `data-*` attributes or CSS variables; add a missing one there with a meaning-based name (`agent-doc/headless.md`).
3. Write the props contract first: `<Name>OwnProps` (and any variant lists, helpers and copy) in `packages/core/src/<name>.ts`, exported from its `index.ts` (`agent-doc/core.md`). Then write the component in `packages/react/src/<name>/`, with `<Name>Props` built on `<Name>OwnProps` plus DOM attributes, and export it from `src/index.ts`. Keep the legacy props API unless the spec says otherwise, and keep Base UI types out of the exported props (`agent-doc/headless.md`, rule 5).
4. Add `apps/storybook/src/components/$ARGUMENTS.stories.tsx` (title `Components/$ARGUMENTS`): a `Playground` story driven by args, plus stories showing its variants and states the way the legacy preview did. Use the row helpers in `src/layout.ts`. Tag a story `shot-viewport` if it renders over the page (portals, overlays). Add it to the component list in `src/Introduction.mdx`.
5. If it puts a token on a new background, add the pair to `packages/tokens/src/contrast-pairs.json`.
6. Run `pnpm codegen && pnpm shots $ARGUMENTS`, then look at `apps/storybook/shots/$ARGUMENTS-*_light.png` and `_dark.png`. Compare against the legacy version and fix differences (spacing, radii, colors, focus ring, motion).
7. Run `pnpm check`. Then update `agent-doc/plan.md`: mark the component done and note any API change from legacy. Put any new Panda / Base UI gotcha in `agent-doc/web-components.md`.
