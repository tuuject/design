---
name: port-component
description: Port one Koi component from the legacy bundle to Base UI + Panda CSS v2. Use when the user says "port <Component>", "port-component <Component>", "移植 <Component>", or asks to port a component from the legacy web bundle to the new React package.
argument-hint: <ComponentName>
---

Port the Koi component **$ARGUMENTS** to `packages/react`.

1. Read `docs/spec/components/$ARGUMENTS.md`, the `$ARGUMENTS` section of `reference/legacy-web/components/bundle.js`, its rules in `reference/legacy-web/components/bundle.css`, and its props in `reference/legacy-web/components/index.d.ts`. Check the Phase 1 table in `docs/plan.md` for which Base UI part to build on, and read that part's docs (Base UI ships them as markdown in `node_modules/@base-ui/react/docs/`).
2. Write the recipe (or slot recipe) in `packages/react/src/recipes/<name>.ts` with role tokens only, and register it in `recipes/index.ts`.
3. Write the component in `packages/react/src/<name>/` and export it from `src/index.ts`. Keep the legacy props API unless the spec says otherwise.
4. Add a `<section data-shot="$ARGUMENTS">` to `apps/playground/src/App.tsx` showing its variants and states, the way the legacy preview did.
5. If it puts a token on a new background, add the pair to `packages/tokens/src/contrast-pairs.json`.
6. Run `pnpm codegen && pnpm shots`, then look at `apps/playground/shots/$ARGUMENTS_light.png` and `_dark.png`. Compare against the legacy version and fix differences (spacing, radii, colors, focus ring, motion).
7. Run `pnpm check`. Then mark the row done in `docs/plan.md` and note any API change or gotcha.
