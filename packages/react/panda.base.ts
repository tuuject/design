// The Panda config both the repo and the published library use. `panda.config.ts` at the repo root adds the apps
// and Storybook; `packages/react/panda.config.ts` is the library-only config that `panda lib` turns into the
// design-system preset consumers load with `designSystem: '@tuuject/koi-react'`. Change the shared parts here, not twice.
import koiPreset from '@tuuject/koi-tokens/panda';
import { defineConfig } from '@pandacss/dev/define';
import { globalCss } from './src/global-css';
import { recipes, slotRecipes } from './src/recipes/index';

export function koiPandaConfig(options: { include: string[]; outdir: string }) {
  return defineConfig({
    // preset-base gives the utilities and the _hover/_focusVisible… conditions. We deliberately do NOT include
    // @pandacss/preset-panda: the only tokens that exist are Koi's.
    presets: ['@pandacss/preset-base', koiPreset],
    include: options.include,
    exclude: [],
    outdir: options.outdir,
    // Library and apps import the generated code by package name (`@tuuject/koi-react/styled-system/css`), never by
    // relative path, so one importMap covers both.
    importMap: '@tuuject/koi-react/styled-system',
    jsxFramework: 'react',
    // Styles come from css() and recipes only. Without this, any JSX prop named like a CSS property is read as a
    // style prop: <DataTable columns={…}> was extracted as the `columns` property (nested_property warnings).
    jsxStyleProps: 'none',
    preflight: true,
    // Off for now: with only Koi's tokens loaded, strict mode also rejects plain values like `0`, `100%` or
    // `400px` for sizes and spacing. Hard-coded colors are caught by scripts/check-raw-colors.mjs instead.
    // Revisit once Phase 1 is done (escape hatch syntax: '[12px]').
    strictTokens: false,
    theme: {
      extend: {
        recipes,
        slotRecipes,
        // The only breakpoint this repo needs so far (Bilisound switches layouts at md 768). Lives here
        // until breakpoints move into tokens.json (plan.md 未决事项).
        breakpoints: { md: '768px' },
      },
    },
    // The library must ship every variant, not just the ones the stories happen to use. `panda lib` records
    // these in buildinfo.json, so consumers get every class without scanning node_modules themselves.
    staticCss: { recipes: '*' },
    globalCss,
  });
}
