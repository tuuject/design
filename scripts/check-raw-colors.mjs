// Fails if component source contains a literal color. Components must use role tokens
// (bg: 'surface', color: 'text-muted'…) so both themes and the contrast checks keep working.
// Usage: node scripts/check-raw-colors.mjs [dir…]   (default: packages/react/src packages/native/src)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['packages/react/src', 'packages/native/src'];
const RAW = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/gi;
const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(p) && files.push(p);
  }
};
dirs.filter(existsSync).forEach(walk);

let bad = 0;
for (const f of files) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/koi-allow-raw-color/.test(line)) {
        return;
      }
      const m = line.match(RAW);
      if (m) {
        bad++;
        console.log(`${f}:${i + 1}  ${m.join(', ')}  →  use a role token`);
      }
    });
}
console.log(
  bad
    ? `\n${bad} raw color(s). Add "// koi-allow-raw-color" to a line only with a reason.`
    : `No raw colors in ${files.length} files.`,
);
process.exit(bad ? 1 : 0);
