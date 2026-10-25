// Fails if any source text uses a middle dot as a separator. Koi separates inline items
// with layout gaps (or plain punctuation in prose), never with a dot glyph.
// Scans every tracked or new text file outside reference/. Usage: node scripts/check-dots.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// U+00B7 middle dot, U+0387 Greek ano teleia (NFC folds it into U+00B7), U+2027 hyphenation point,
// U+22C5 dot operator, U+30FB katakana middle dot, U+FF65 halfwidth katakana middle dot.
const DOTS = /[\u00B7\u0387\u2027\u22C5\u30FB\uFF65]/g;
const TEXT = /\.(?:[cm]?[jt]sx?|json|jsonc|md|mdx|css|html|ya?ml)$/;

const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter((f) => f && TEXT.test(f) && !f.startsWith('reference/'));

let bad = 0;
for (const f of files) {
  let text;
  try {
    text = readFileSync(f, 'utf8');
  } catch {
    // Listed by git but deleted in the working tree.
    continue;
  }
  text.split('\n').forEach((line, i) => {
    const m = line.match(DOTS);
    if (m) {
      bad++;
      const codes = [...new Set(m)].map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
      console.log(`${f}:${i + 1}  ${codes.join(', ')}  →  separate with a layout gap, or use prose punctuation`);
    }
  });
}
console.log(bad ? `\n${bad} line(s) with a middle dot.` : `No middle dots in ${files.length} files.`);
process.exit(bad ? 1 : 0);
