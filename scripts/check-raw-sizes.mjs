// Fails if a component writes a size as a literal instead of taking it from tokens.json. Native builds the same
// components from @koi/tokens/dimensions, so a literal here would drift between platforms.
// Use a shared token by name ('control-md', 'icon', '3'), or `components.<name>.<part>` from
// @koi/tokens/dimensions through toPx() (recipes/dimensions.ts). A size that only exists on the web (a pseudo-element
// hit area, a baseline nudge) keeps its literal with a `// koi-web-only: <why>` comment on the line.
// Usage: node scripts/check-raw-sizes.mjs [dir…]   (default: packages/react/src packages/native/src)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['packages/react/src', 'packages/native/src'];
const PX = /(?<![\w$.{-])-?\d+(?:\.\d+)?px\b/g;
// Numeric JSX props that are sizes: <CloseIcon size={18} />, sideOffset={8}, and an icon's default size.
const JSX = /\b(?:size|sideOffset|alignOffset|strokeWidth)\s*=\s*\{?\s*-?\d/g;

const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(p) && files.push(p); } };
dirs.filter(existsSync).forEach(walk);

let bad = 0;
for (const f of files) {
  if (normalize(f).endsWith(normalize('recipes/headless.ts'))) continue;
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/koi-web-only/.test(line) || /^\s*(\/\/|\*|\/\*)/.test(line)) return;
    const code = line.replace(/\s\/\/.*$/, '');
    const hits = [...code.matchAll(PX), ...(f.endsWith('.tsx') ? code.matchAll(JSX) : [])].map((m) => m[0].trim());
    for (const h of hits) { bad++; console.log(`${f}:${i + 1}  ${h}  →  take it from tokens.json (@koi/tokens/dimensions)`); }
  });
}
console.log(bad
  ? `\n${bad} literal size(s). A web-only one keeps its literal with "// koi-web-only: <why>" on the line.`
  : `No literal sizes in ${files.length} files.`);
process.exit(bad ? 1 : 0);
