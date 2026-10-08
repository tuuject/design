// Checks every pair in src/contrast-pairs.json in both themes. Exits 1 on any failure (use it in CI).
// `node scripts/contrast.mjs` or `node scripts/contrast.mjs --all` to print passing pairs too.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolveColor, THEMES } from './load.mjs';
import { parseColor, contrast, over } from './color.mjs';

const pairs = JSON.parse(readFileSync(fileURLToPath(new URL('../src/contrast-pairs.json', import.meta.url)), 'utf8'));
const all = process.argv.includes('--all');
const NEED = { text: 4.5, ui: 3 };

function solid(name, theme, ground = 'page-bg') {
  const c = parseColor(resolveColor(name, theme));
  if (c.a >= 1) return c.rgb;
  return over(c, { rgb: solid(ground, theme), a: 1 });
}

let failed = 0;
for (const [kind, list] of Object.entries(pairs)) {
  if (kind.startsWith('$')) continue;
  for (const [fg, bg, ground = 'page-bg'] of list) for (const th of THEMES) {
    const back = solid(bg, th, ground);
    const r = contrast(solid(fg, th, bg) /* translucent fg composites over its bg */, back);
    const ok = r >= NEED[kind];
    if (!ok) failed++;
    if (!ok || all) console.log(`${ok ? 'ok  ' : 'FAIL'} ${th.padEnd(5)} ${r.toFixed(2).padStart(5)}:1 (need ${NEED[kind]}) ${fg} on ${bg}`);
  }
}
console.log(failed ? `\n${failed} pair(s) below target.` : 'All contrast pairs pass.');
process.exit(failed ? 1 : 0);
