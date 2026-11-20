// Installs this checkout's Coding Agent skills.
//
// The repository's own skills are committed under .agents/skills/<name>/, the directory Codex and others read.
// Shared tuuject skills are pinned in package.json's "skills" field; the `skills` CLI installs them into the same
// directory (gitignored) and records their content hashes in skills-lock.json. Claude Code reads .claude/skills/,
// so every skill in .agents/skills/ gets a relative link there.
//
// As the root postinstall (--postinstall) it skips CI and copies without a .git (source archives), and problems
// only warn: agent skills must not fail `pnpm install` when GitHub is unreachable.
// `pnpm skills:sync` always runs and exits non-zero on any problem.
import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync, mkdirSync, readdirSync, readlinkSync, symlinkSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const skillsDir = join(root, '.agents', 'skills');
const claudeDir = join(root, '.claude', 'skills');
const postinstall = process.argv.includes('--postinstall');

/** Where `link` points when it is a symlink, resolved to an absolute path. */
function linkTarget(link) {
  if (!lstatSync(link, { throwIfNoEntry: false })?.isSymbolicLink()) {
    return undefined;
  }
  return resolve(dirname(link), readlinkSync(link));
}

function syncSharedSkills(problems) {
  let cli;
  try {
    cli = join(dirname(createRequire(import.meta.url).resolve('skills/package.json')), 'bin', 'cli.mjs');
  } catch {
    problems.push('the skills CLI is not installed; shared skills were not synced');
    return;
  }
  // --include . limits the sync to package.json's own "skills" field: skills shipped inside npm dependencies are
  // not installed. Telemetry stays off for an automated hook.
  const result = spawnSync(
    process.execPath,
    [cli, 'experimental_sync', '--yes', '--agent', 'claude-code', '--include', '.'],
    { cwd: root, stdio: 'inherit', env: { ...process.env, DISABLE_TELEMETRY: '1' } },
  );
  if (result.error) {
    problems.push(`shared skills were not synced: ${result.error.message}`);
  } else if (result.status !== 0) {
    problems.push(`shared skills were not synced: skills CLI exited with ${result.status ?? result.signal}`);
  }
}

function linkClaudeSkills(problems) {
  // An old checkout may have .claude/skills itself as a symlink to some other tree. Replacing it is the
  // owner's call, so report it instead of writing through it.
  if (lstatSync(claudeDir, { throwIfNoEntry: false })?.isSymbolicLink()) {
    problems.push('.claude/skills is a symlink; left untouched (delete it and rerun to let this script manage it)');
    return;
  }
  try {
    const names = readdirSync(skillsDir)
      .filter((name) => existsSync(join(skillsDir, name, 'SKILL.md')))
      .sort();
    mkdirSync(claudeDir, { recursive: true });
    // Drop links to skills that were removed or renamed; never touch other entries.
    for (const name of readdirSync(claudeDir)) {
      const link = join(claudeDir, name);
      const target = linkTarget(link);
      if (target !== undefined && dirname(target) === skillsDir && !names.includes(name)) {
        unlinkSync(link);
      }
    }
    for (const name of names) {
      const link = join(claudeDir, name);
      const target = join(skillsDir, name);
      if (linkTarget(link) === target) {
        continue;
      }
      if (lstatSync(link, { throwIfNoEntry: false })) {
        problems.push(`${relative(root, link)} exists and is not a link to .agents/skills/${name}; left untouched`);
        continue;
      }
      // 'junction' only matters on Windows, where it needs no symlink privilege.
      symlinkSync(relative(claudeDir, target), link, 'junction');
    }
    console.log(`skills-sync: linked ${names.join(', ')} into .claude/skills`);
  } catch (error) {
    problems.push(`cannot link skills into .claude/skills: ${String(error)}`);
  }
}

const inCi = !['', '0', 'false'].includes(process.env.CI ?? '');
if (postinstall && (inCi || !existsSync(join(root, '.git')))) {
  console.log('skills-sync: skipped outside a local git checkout; run `pnpm skills:sync` to install agent skills');
} else {
  const problems = [];
  syncSharedSkills(problems);
  linkClaudeSkills(problems);
  for (const problem of problems) {
    console.warn(`skills-sync: ${problem}`);
  }
  if (problems.length > 0) {
    if (postinstall) {
      console.warn('skills-sync: install continues; fix the above and rerun `pnpm skills:sync`');
    } else {
      process.exitCode = 1;
    }
  }
}
