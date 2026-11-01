// The library-only Panda config. `panda lib` uses it to compile dist/panda/preset.mjs and buildinfo.json, the
// two files consumers load with `designSystem: '@tuuject/koi-react'`. The repo's own dev config is the root
// panda.config.ts; both share packages/react/panda.base.ts.
import { defineConfig } from '@pandacss/dev/define';
import { koiPandaConfig } from './panda.base';

export default defineConfig(
  koiPandaConfig({
    include: ['./src/**/*.{ts,tsx}'],
    // Relative to this package, so the published package ships its own runtime for the components.
    outdir: 'styled-system',
  }),
);
