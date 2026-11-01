// Bumps every @tuuject package to one version, then commits and tags the release.
// Lockstep on purpose: the packages are published together and depend on each other.
// Usage:
//   pnpm version:bump patch|minor|major|<x.y.z> [--dry-run] [--push]
//   pnpm version:bump patch --no-commit --no-tag   # only rewrite package.json files
// `--allow-dirty` skips the clean-tree check and passes --no-git-checks to pnpm; for testing only.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PACKAGES = ['tokens', 'core', 'react', 'native'];
const BUMP_TYPES = new Set(['major', 'minor', 'patch']);
const SEMVER = /^\d+\.\d+\.\d+$/;

const args = process.argv.slice(2);
const value = args.find((arg) => !arg.startsWith('-'));
const flags = new Set(args.filter((arg) => arg.startsWith('-')));
const bump = value;

function usage(message) {
  if (message) {
    console.error(`${message}\n`);
  }
  console.error('Usage: pnpm version:bump <major|minor|patch|x.y.z> [--dry-run] [--push] [--no-commit] [--no-tag]');
  process.exit(1);
}

if (!bump || (!BUMP_TYPES.has(bump) && !SEMVER.test(bump))) {
  usage(bump ? `Not a version or bump type: ${bump}` : 'Missing version or bump type.');
}

function compare(left, right) {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return 0;
}

/** Stable versions only: a prerelease needs a dist-tag, which publish:packages does not set yet. */
function nextVersion(current, type) {
  if (SEMVER.test(type)) {
    if (compare(type, current) <= 0) {
      usage(`${type} is not newer than ${current}.`);
    }
    return type;
  }
  const [major, minor, patch] = current.split('.').map(Number);
  if (type === 'major') {
    return `${major + 1}.0.0`;
  }
  if (type === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
}

const run = (command, commandArgs) =>
  execFileSync(command, commandArgs, { cwd: resolve(process.cwd()), stdio: 'inherit' });
const capture = (command, commandArgs) =>
  execFileSync(command, commandArgs, { cwd: resolve(process.cwd()), encoding: 'utf8' }).trim();

const versions = () =>
  Object.fromEntries(
    PACKAGES.map((dir) => [dir, JSON.parse(readFileSync(`packages/${dir}/package.json`, 'utf8')).version]),
  );

const before = versions();
const unique = new Set(Object.values(before));
if (unique.size !== 1) {
  usage(`@tuuject packages are not on one version: ${JSON.stringify(before)}. Align them first.`);
}

const target = nextVersion(before.tokens, bump);
if (flags.has('--dry-run')) {
  console.log(`Would bump ${before.tokens} → ${target} for ${PACKAGES.length} @tuuject packages.`);
  process.exit(0);
}

if (!flags.has('--allow-dirty') && capture('git', ['status', '--porcelain'])) {
  usage('Working tree is not clean. Commit or stash first, or pass --allow-dirty while testing.');
}

const pnpmArgs = ['version', '-r', bump, '--filter', '@tuuject/*'];
if (flags.has('--allow-dirty')) {
  pnpmArgs.push('--no-git-checks');
}
run('pnpm', pnpmArgs);

const after = versions();
const next = after.tokens;
if (new Set(Object.values(after)).size !== 1) {
  usage(`Version bump left the packages out of sync: ${JSON.stringify(after)}.`);
}
if (next === before.tokens) {
  usage(`Version did not change from ${next}.`);
}

if (!flags.has('--no-tag') && capture('git', ['tag', '--list', `v${next}`])) {
  usage(`Tag v${next} already exists.`);
}
if (flags.has('--push') && flags.has('--allow-dirty')) {
  usage('--allow-dirty is for local testing; drop --push.');
}

if (!flags.has('--no-commit')) {
  run('git', ['add', '-A']);
  run('git', ['commit', '-m', `Release v${next}`]);
}
if (!flags.has('--no-tag')) {
  run('git', ['tag', `v${next}`]);
}
if (flags.has('--push') && flags.has('--no-commit')) {
  usage('--push needs a commit; drop --no-commit or push yourself.');
}
if (flags.has('--push')) {
  run('git', ['push']);
  if (!flags.has('--no-tag')) {
    run('git', ['push', 'origin', `v${next}`]);
  }
}

console.log(`\nBumped ${before.tokens} → ${next}.`);
if (flags.has('--no-commit')) {
  console.log('Skipped the commit. Run git add/commit yourself.');
} else if (flags.has('--no-tag')) {
  console.log('Skipped the tag. Run git tag yourself.');
} else {
  console.log(`Created commit and tag v${next}.`);
}
if (!flags.has('--push')) {
  console.log(`Push with git push && git push origin v${next}.`);
}
console.log('Next: pnpm check && pnpm publish:packages');
