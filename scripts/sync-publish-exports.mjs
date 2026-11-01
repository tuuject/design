// Copies a package's local (source-based) exports into publishConfig.exports with every ./src/* entry pointed at
// the compiled ./dist/* files. pnpm/npm apply publishConfig on pack/publish, so the workspace keeps importing
// TypeScript sources (HMR, no build step) while the tarball only contains JavaScript + declarations.
// Usage: node scripts/sync-publish-exports.mjs packages/react
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? '.');
const path = join(dir, 'package.json');
const pkg = JSON.parse(readFileSync(path, 'utf8'));

/** ./src/foo/Bar.tsx -> { types: ./dist/foo/Bar.d.ts, default: ./dist/foo/Bar.js } */
function published(target) {
  if (typeof target !== 'string') {
    return target;
  }
  // Only authored TypeScript under ./src/ needs compiling; generated styled-system and dist entries are final.
  if (target.endsWith('.d.ts') || !target.startsWith('./src/')) {
    return target;
  }
  const base = `./dist/${target.slice('./src/'.length).replace(/\.tsx?$/, '')}`;
  if (!/\.tsx?$/.test(target)) {
    return base;
  }
  return { types: `${base}.d.ts`, default: `${base}.js` };
}

/** Keep multi-target conditions in order; map each concrete target. */
function publishedEntry(entry) {
  if (typeof entry === 'string') {
    return published(entry);
  }
  if (Array.isArray(entry)) {
    return entry.map(published);
  }
  return Object.fromEntries(Object.entries(entry).map(([condition, target]) => [condition, published(target)]));
}

const exports = Object.fromEntries(
  Object.entries(pkg.exports ?? {}).map(([key, entry]) => [key, publishedEntry(entry)]),
);

pkg.publishConfig = { ...pkg.publishConfig, access: 'public', exports };
writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`publish exports synced: ${Object.keys(exports).length} entries`);
