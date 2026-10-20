// Starts a workspace app's dev server with its output mirrored to .temp/dev-<app>.log, so a coding agent can
// find and read a server the user already started instead of launching a second one (AGENTS.md).
// Node instead of `| tee` so it behaves the same in Windows shells.
// Usage: node scripts/dev-server.mjs <app>            codegen, then `pnpm --filter <app> dev`
//        node scripts/dev-server.mjs <app> --status   exit 0 and print the URL and log path if it is up
import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';

// Keep in sync with server.port in the app's bundler config.
const PORTS = { admin: 3000 };

const [app, flag] = process.argv.slice(2);
const port = PORTS[app];
if (!port) {
  console.error(`usage: node scripts/dev-server.mjs <${Object.keys(PORTS).join('|')}> [--status]`);
  process.exit(2);
}
const url = `http://localhost:${port}`;
const log = `.temp/dev-${app}.log`;
const up = await fetch(url).then(
  () => true,
  () => false,
);

if (flag === '--status') {
  console.log(up ? `${app} dev server is up: ${url}  log: ${log}` : `${app} dev server is not running`);
  process.exit(up ? 0 : 1);
}
// Checked before touching the log: starting anyway would truncate the running server's log.
if (up) {
  console.error(`${app} dev server is already running at ${url} (log: ${log})`);
  process.exit(1);
}

mkdirSync('.temp', { recursive: true });
const out = createWriteStream(log);
const child = spawn(`pnpm codegen && pnpm --filter ${app} dev`, {
  // pnpm is pnpm.cmd on Windows, which only a shell can run.
  shell: true,
  // stdin stays a TTY so Rsbuild keeps its CLI shortcuts.
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
