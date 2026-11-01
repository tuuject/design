// Packs the public packages into .temp/packs so their publishConfig can be inspected without publishing.
// Usage: pnpm pack:packages  (builds first); or node scripts/pack-packages.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const dest = resolve('.temp/packs');
mkdirSync(dest, { recursive: true });
for (const dir of ['packages/tokens', 'packages/core', 'packages/react']) {
  execFileSync('pnpm', ['pack', '--pack-destination', dest], { cwd: dir, stdio: 'inherit' });
}
console.log(`tarballs written to ${dest}`);
