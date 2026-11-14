// Fails if a component styles something with a physical inline-direction property where a logical one exists. Koi
// supports RTL, and a physical `left`/`pr`/`textAlign: 'right'` silently points the wrong way there while the same
// declaration written as `insetInlineStart`/`pe`/`textAlign: 'start'` follows the reading direction for free.
// Why, and the two cases that stay physical: agent-doc/web-components.md ("Direction"), docs/spec/README.md.
//
// A line that genuinely has to be physical keeps its declaration with a `// koi-physical: <reason>` comment either on
// that line or on a comment line of its own directly above it (the measured left offset of Base UI's tab indicator,
// the way a toast was swiped, the inner edge of a Drawer pinned to a physical screen edge). The line above is needed
// for a variant key or an object opening, because the formatter moves a trailing comment after `{` down a line; a
// declaration with its own trailing comment does NOT exempt the next line. The adapter (recipes/headless.ts) is
// skipped: it names the library's swipe directions, not CSS.
// Usage: node scripts/check-logical-props.mjs [dir…]   (default: packages/react/src)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : ['packages/react/src'];
const ADAPTER = normalize('packages/react/src/recipes/headless.ts');

// A quoted key (`'left': 0`) is the same declaration as `left: 0`, so every key rule allows the quotes.
const KEY = (names) => new RegExp(`(?:^|[\\s{,])(?:['"]?(?:${names})['"]?)\\s*:`);
// A value, quoted or not, and either an object property or a JSX attribute (`side={'left'}`).
const VALUE = (names, values) => new RegExp(`\\b(?:${names})\\s*[:=]\\s*(?:\\{\\s*)?['"]?(?:${values})['"]?`);

// Each rule: what it looks for, and what to write instead.
const RULES = [
  {
    // A positioning property, or a variant/map key named after a physical edge (Drawer's `left` / `right` sides).
    re: KEY('left|right'),
    hint: 'insetInlineStart / insetInlineEnd (or, in a placement, `inline-start` / `inline-end`)',
  },
  { re: KEY('ml|mr|pl|pr'), hint: 'ms / me / ps / pe' },
  { re: /\bmargin(?:Left|Right)\b/, hint: 'marginInlineStart / marginInlineEnd' },
  { re: /\bpadding(?:Left|Right)\b/, hint: 'paddingInlineStart / paddingInlineEnd' },
  {
    re: /\bborder(?:Left|Right)(?:Width|Style|Color)?\b/,
    hint: 'borderInlineStartWidth / borderInlineEndWidth (colour and style follow the same name)',
  },
  {
    re: /\bborder(?:TopLeft|TopRight|BottomLeft|BottomRight)Radius\b/,
    hint: 'borderStartStartRadius / borderStartEndRadius / borderEndStartRadius / borderEndEndRadius',
  },
  { re: /\b(?:inset|scrollMargin|scrollPadding)(?:Left|Right)\b/, hint: 'the InlineStart / InlineEnd form' },
  { re: /\btextAlign:\s*['"](?:left|right)['"]/, hint: "textAlign: 'start' / 'end'" },
  {
    // CSS logical float values are `inline-start` / `inline-end`; `start`/`end` are not float values.
    re: /\bfloat:\s*['"](?:left|right)['"]/,
    hint: "float: 'inline-start' / 'inline-end'",
  },
  {
    re: /\bjustifyContent:\s*['"](?:left|right)['"]/,
    hint: "justifyContent: 'flex-start' / 'flex-end' (or `left`/`right` with `// koi-physical` when the edge is physical)",
  },
  {
    // Base UI takes `inline-start` / `inline-end` for a side and mirrors the alignment itself once it knows the
    // direction; a physical side there pins the panel to the wrong edge in RTL.
    re: VALUE('side|align', 'left|right'),
    hint: "side: 'inline-start' | 'inline-end' (or map the placement through placementOf)",
  },
  // Anything else that names a physical edge, quoted or not: an object key or a JSX attribute.
  { re: VALUE('inset|border|margin|padding', 'left|right'), hint: 'the InlineStart / InlineEnd form' },
];

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(p) && files.push(p);
  }
};
dirs.filter(existsSync).forEach(walk);

let bad = 0;
for (const f of files) {
  if (normalize(f) === ADAPTER) {
    continue;
  }
  const lines = readFileSync(f, 'utf8').split('\n');
  // A standalone comment line directly above exempts the next line; a declaration's own trailing comment doesn't.
  const commentLine = (line) => /^\s*(?:\/\/|\/\*|\*)/.test(line);
  lines.forEach((line, i) => {
    const above = lines[i - 1] ?? '';
    const exempt = /koi-physical/.test(line) || (commentLine(above) && /koi-physical/.test(above));
    if (exempt || /^\s*(?:\/\/|\*|\/\*)/.test(line)) {
      return;
    }
    // Comments at the end of a line don't count: they can describe the rule itself.
    const code = line.replace(/\s\/\/.*$/, '');
    const hit = RULES.find((rule) => rule.re.test(code));
    if (hit) {
      bad++;
      console.log(`${f}:${i + 1}  ${code.trim()}\n    →  ${hit.hint}`);
    }
  });
}
console.log(
  bad
    ? `\n${bad} physical direction declaration(s). Keep one only with "// koi-physical: <why>" on the line.`
    : `No physical direction declarations in ${files.length} files.`,
);
process.exit(bad ? 1 : 0);
