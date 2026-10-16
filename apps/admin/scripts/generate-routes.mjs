// Standalone route-tree generation for `typecheck` (and any tooling outside rsbuild).
// The rsbuild plugin does the same thing on every dev/build; this script just runs its
// vite hook directly so `tsc` sees a fresh routeTree.gen.ts.
import { unpluginRouterGeneratorFactory } from '@tanstack/router-plugin';

const plugin = unpluginRouterGeneratorFactory({ target: 'react', autoCodeSplitting: true });
await plugin.vite.configResolved({ root: process.cwd() });
