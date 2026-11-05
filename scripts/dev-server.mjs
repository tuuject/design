// Starts a workspace app's dev server with its output mirrored to .temp/dev-<app>.log, so a coding agent can
// find and read a server the user already started instead of launching a second one (AGENTS.md).
// Node instead of `| tee` so it behaves the same in Windows shells.
// Usage: node scripts/dev-server.mjs <app>            codegen, then `pnpm --filter <app> dev`
//        node scripts/dev-server.mjs <app> --status   exit 0 and print the URL and log path if this checkout's
//                                                     server is up; 1 if nothing is; 3 if another server holds the port
import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripVTControlCharacters } from 'node:util';

// Keep in sync with the port each app's dev server is pinned to: server.port + strictPort in
// apps/admin/vite.config.ts, `-p 6006 --exact-port` in apps/storybook's dev script.
const PORTS = { admin: 3000, storybook: 6006 };
// Both apps' Vite configs send the checkout they run from in this header (URI-encoded). Worktrees share the ports,
// so a server answering on 3000 may be serving another branch's code.
const CHECKOUT_HEADER = 'x-koi-checkout';
const here = fileURLToPath(new URL('..', import.meta.url));

const [app, flag] = process.argv.slice(2);
const port = PORTS[app];
if (!port) {
  console.error(`usage: node scripts/dev-server.mjs <${Object.keys(PORTS).join('|')}> [--status]`);
  process.exit(2);
}
const url = `http://localhost:${port}`;
const log = `.temp/dev-${app}.log`;
// undefined: nothing answers. null: a server that doesn't name its checkout (another app, or a branch from before
// the header). /@vite/client is served by Vite in both apps; Storybook's own pages are not.
const owner = await fetch(new URL('/@vite/client', url)).then(
  async (res) => {
    await res.body?.cancel();
    const value = res.headers.get(CHECKOUT_HEADER);
    return value === null ? null : decodeURIComponent(value);
  },
  () => undefined,
);
const comparable = (path) => (process.platform === 'win32' ? resolve(path).toLowerCase() : resolve(path));
const ours = typeof owner === 'string' && comparable(owner) === comparable(here);
const foreign = () =>
  owner === null
    ? `port ${port} is held by a server that doesn't name its checkout (another app, or a branch older than this check)`
    : `port ${port} is held by another checkout's ${app} dev server: ${owner} (log: ${join(owner, log)})`;

if (flag === '--status') {
  if (owner === undefined) {
    console.log(`${app} dev server is not running`);
    process.exit(1);
  }
  if (!ours) {
    console.log(
      `${foreign()}. Its pages are not this checkout's code, and this checkout can't start its own until it stops.`,
    );
    process.exit(3);
  }
  console.log(`${app} dev server is up: ${url}  log: ${log}`);
  process.exit(0);
}
// Checked before touching the log: starting anyway would truncate the running server's log.
if (owner !== undefined) {
  console.error(ours ? `${app} dev server is already running at ${url} (log: ${log})` : foreign());
  process.exit(1);
}

mkdirSync('.temp', { recursive: true });
const out = createWriteStream(log);
const child = spawn(`pnpm codegen && pnpm --filter ${app} dev`, {
  // pnpm is pnpm.cmd on Windows, which only a shell can run.
  shell: true,
  // stdin stays a TTY so Vite keeps its CLI shortcuts.
  stdio: ['inherit', 'pipe', 'pipe'],
  // Piped stdout is not a TTY, so colours would switch off; force them and strip them from the log.
  env: { ...process.env, FORCE_COLOR: '1' },
});
for (const [from, to] of [
  [child.stdout, process.stdout],
  [child.stderr, process.stderr],
]) {
  from.setEncoding('utf8');
  from.on('data', (text) => {
    to.write(text);
    out.write(stripVTControlCharacters(text));
  });
}
// Ctrl+C reaches the child as well; wait for it to shut down so its last lines still reach the log.
process.on('SIGINT', () => {});
child.on('exit', (code) => {
  out.end();
  process.exitCode = code ?? 1;
});
