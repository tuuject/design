// Fails if component styles reach past the headless adapter (packages/react/src/recipes/headless.ts) into the
// headless library's own DOM contract: its data-* attributes, its CSS variables, or a preset-base condition that
// quietly matches data-* attributes (`_active` is `[data-active]` too, which Base UI puts on the current tab).
// Also fails if a component's type declarations (its public props) mention a type imported from the library.
// Why, and what to do instead: agent-doc/headless.md.
// Usage: node scripts/check-headless.mjs [dir…]   (default: packages/react/src)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';
import presetBase from '@pandacss/preset-base';
import koiPreset from '../packages/tokens/dist/panda-preset.js';

const ADAPTER = normalize('packages/react/src/recipes/headless.ts');
const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['packages/react/src'];

// Koi's own attributes (theme-init.js) and variables (`--koi-*`, and Panda's token variables like `--blurs-panel`).
const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const { tokens, semanticTokens } = koiPreset.theme.extend;
const tokenVars = [...new Set([...Object.keys(tokens), ...Object.keys(semanticTokens)])].map(kebab);
const DATA = /\[data-(?!theme\b|font\b|koi-)[a-z][\w-]*/g;
const VAR = new RegExp(`var\\(--(?!koi-|(?:${tokenVars.join('|')})-)[\\w-]+`, 'g');

// preset-base conditions whose selector also matches a data-* attribute. These are allowed because Koi uses them
// on native elements for their native half only (:hover, :focus-visible, :disabled, ::placeholder, :empty);
// every other one goes through `state` in headless.ts.
const ALLOWED = new Set(['hover', 'focusVisible', 'disabled', 'placeholder', 'empty']);
const banned = Object.entries(presetBase.conditions)
  .filter(([name, sel]) => /data-/.test(String(sel)) && !ALLOWED.has(name))
  .map(([name]) => name);
const COND = new RegExp(`\\b_(?:${banned.join('|')})\\b(?=\\s*:)`, 'g');

const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(p) && files.push(p); } };
dirs.filter(existsSync).forEach(walk);

// Rule 5: the names a file imports from the headless library, which its top-level type and interface
// declarations (the public props and whatever they're built from) must not mention.
const IMPORT = /import\s+(?:type\s+)?(\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+'@base-ui\/react[^']*'/g;
const importedNames = (src) => [...src.matchAll(IMPORT)].flatMap(([, spec]) =>
  spec.startsWith('{')
    ? spec.slice(1, -1).split(',').map((s) => s.trim().split(/\s+as\s+/).pop().replace(/^type\s+/, '')).filter(Boolean)
    : [spec.split(/\s+/).pop()]);

let bad = 0;
for (const f of files) {
  if (normalize(f) === ADAPTER) continue;
  const src = readFileSync(f, 'utf8');
  const names = importedNames(src);
  const TYPE = names.length ? new RegExp(`\\b(?:${names.join('|')})\\b`, 'g') : null;
  let decl = null; // 'interface' | 'type' while inside a top-level declaration
  src.split('\n').forEach((line, i) => {
    const start = line.match(/^(?:export\s+)?(interface|type)\s+\w+/);
    if (start) decl = start[1];
    const inDecl = decl;
    if (decl === 'interface' ? /^\}|\{\}\s*$/.test(line) : decl === 'type' && /^\S.*;\s*$/.test(line)) decl = null;
    if (/koi-allow-headless/.test(line) || /^\s*(\/\/|\*)/.test(line)) return;
    const hits = [
      ...[...line.matchAll(DATA)].map((m) => `${m[0]}]  →  add it to \`state\` in headless.ts`),
      ...[...line.matchAll(VAR)].map((m) => `${m[0]})  →  add it to \`vars\` in headless.ts`),
      ...[...line.matchAll(COND)].map((m) => `${m[0]}  →  also matches [data-…]; use \`state\` in headless.ts`),
      ...(inDecl && TYPE ? [...line.matchAll(TYPE)].map((m) => `${m[0]}  →  a headless type in a declaration; define a Koi type (rule 5)`) : []),
    ];
    for (const h of hits) { bad++; console.log(`${f}:${i + 1}  ${h}`); }
  });
}
console.log(bad
  ? `\n${bad} headless leak(s). See agent-doc/headless.md. Add "// koi-allow-headless" to a line only with a reason.`
  : `No headless leaks in ${files.length} files.`);
process.exit(bad ? 1 : 0);
