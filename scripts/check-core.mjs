// Keeps @koi/core platform-neutral and the platforms built on it (agent-doc/core.md):
// 1. packages/core imports nothing but types from 'react' and its own files.
// 2. packages/core names no platform type. Its tsconfig has no DOM lib, but @types/react declares empty
//    stand-ins for Event, HTMLElement and the like, so those would still compile without this check.
// 3. Every exported `<Name>Props` in @koi/react is built on `<Name>OwnProps` from @koi/core.
// Usage: node scripts/check-core.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d, out = []) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p, out) : /\.tsx?$/.test(p) && out.push(p);
  }
  return out;
};
const code = (line) => !/^\s*(\/\/|\*|\/\*)/.test(line) && !/koi-allow-core/.test(line);

let bad = 0;
const report = (f, i, msg) => {
  bad++;
  console.log(`${f}:${i + 1}  ${msg}`);
};

const PLATFORM =
  /\b(?:\w*Event|HTML\w*|SVG\w*|Element|EventTarget|Window|Document|CSSProperties|View\w*Props|StyleProp|ViewStyle|TextStyle)\b/g;
const IMPORT = /^\s*(?:import|export)\b.*\bfrom\s+'([^']+)'/;
const coreFiles = walk('packages/core/src');
for (const f of coreFiles) {
  readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (!code(line)) {
        return;
      }
      const m = line.match(IMPORT);
      if (m && !m[1].startsWith('./') && !(m[1] === 'react' && /^\s*import type\b/.test(line))) {
        report(f, i, `imports '${m[1]}'  →  core may only \`import type\` from 'react' and its own files`);
      }
      for (const t of line.matchAll(PLATFORM)) {
        if (t[0] !== 'ReactElement') {
          report(
            f,
            i,
            `${t[0]}  →  a platform type; make it a type parameter (as ChangeDetails<E>) or move the prop to the platform package`,
          );
        }
      }
    });
}

const DECL = /^export (?:interface|type) (\w+)Props\b/;
const webFiles = walk('packages/react/src').filter((f) => /\/[^/]+\/[A-Z]\w*\.tsx$/.test(f));
for (const f of webFiles) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const m = line.match(DECL);
    if (!m) {
      return;
    }
    // The declaration runs to its closing brace, or to the first line ending in `;` / `{}` for one-liners.
    let text = '';
    for (let j = i; j < lines.length; j++) {
      text += `${lines[j]}\n`;
      if (/^}|;\s*$|\{\}\s*$/.test(lines[j])) {
        break;
      }
    }
    if (!text.includes(`${m[1]}OwnProps`)) {
      report(f, i, `${m[1]}Props  →  build it on ${m[1]}OwnProps from @koi/core`);
    }
  });
}

console.log(
  bad
    ? `\n${bad} core problem(s). See agent-doc/core.md. Add "// koi-allow-core" to a line only with a reason.`
    : `Core is platform-neutral (${coreFiles.length} files); all ${webFiles.length} web component files build on it.`,
);
process.exit(bad ? 1 : 0);
