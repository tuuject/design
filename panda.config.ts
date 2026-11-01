// One Panda config for the whole web side: it scans the component library, Storybook and the admin template,
// and writes the generated styled-system into packages/react/styled-system (gitignored).
// The shared parts live in packages/react/panda.base.ts, which the published library's own config reuses.
// Panda v2 notes: ESM only, Node 22+, presets are NOT added automatically, `panda codegen --clean` after upgrades.
import { defineConfig } from '@pandacss/dev';
import { koiPandaConfig } from './packages/react/panda.base';

export default defineConfig(
  koiPandaConfig({
    include: [
      './packages/react/src/**/*.{ts,tsx}',
      './apps/storybook/src/**/*.{ts,tsx}',
      './apps/admin/src/**/*.{ts,tsx}',
    ],
    outdir: 'packages/react/styled-system',
  }),
);
