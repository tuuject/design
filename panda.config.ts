// One Panda config for the whole web side. It scans the component library and the Storybook,
// and writes the generated styled-system into packages/react/styled-system (gitignored).
// Panda v2 notes: ESM only, Node 22+, presets are NOT added automatically, `panda codegen --clean` after upgrades.
import { defineConfig } from '@pandacss/dev';
import koiPreset from './packages/tokens/dist/panda-preset.js';
import { recipes, slotRecipes } from './packages/react/src/recipes';
import { globalCss } from './packages/react/src/global-css';

export default defineConfig({
  // preset-base gives the utilities and the _hover/_focusVisible… conditions. We deliberately do NOT
  // include @pandacss/preset-panda: the only tokens that exist are Koi's.
  presets: ['@pandacss/preset-base', koiPreset],
  include: ['./packages/react/src/**/*.{ts,tsx}', './apps/storybook/src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'packages/react/styled-system',
  // Library and apps import the generated code by package name (`@koi/react/styled-system/css`),
  // never by relative path, so one importMap covers both.
  importMap: '@koi/react/styled-system',
  jsxFramework: 'react',
  preflight: true,
  // Off for now: with only Koi's tokens loaded, strict mode also rejects plain values like `0`, `100%` or
  // `400px` for sizes and spacing. Hard-coded colors are caught by scripts/check-raw-colors.mjs instead.
  // Revisit once Phase 1 is done (escape hatch syntax: '[12px]').
  strictTokens: false,
  theme: { extend: { recipes, slotRecipes } },
  // The library must ship every variant, not just the ones the stories happen to use.
  staticCss: { recipes: '*' },
  globalCss,
});
