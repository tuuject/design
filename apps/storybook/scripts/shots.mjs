// Screenshots every story in light and dark into shots/<Component>-<Story>_<theme>.png.
// This is how Claude Code checks its visual work: run it, then Read the PNGs.
// Stories tagged `shot-viewport` (an open Dialog) are shot as the whole viewport, the rest as #storybook-root.
// Usage: pnpm shots                  (starts its own Storybook on port 6199)
//        KOI_FONT=chill pnpm shots   (ChillRoundF instead of the system font)
//        KOI_PALETTE=rose pnpm shots (another built-in palette; files get a `_rose` suffix)
//        KOI_DIR=rtl pnpm shots      (right-to-left layout; files get a `_rtl` suffix)
// A story tagged `koi-shot-<width>x<height>` (a phone stress story) is shot at that viewport instead of 1000x800.
//        pnpm shots Button Dialog    (only these components)
import { spawn } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

/** `koi-shot-390x900` in a story's tags: the viewport it is shot at. Default 1000x800. */
function shotViewport(tags) {
  for (const tag of tags ?? []) {
    const match = /^koi-shot-(\d+)x(\d+)$/.exec(tag);
    if (match) {
      return { width: Number(match[1]), height: Number(match[2]) };
    }
  }
  return { width: 1000, height: 800 };
}

const root = fileURLToPath(new URL('..', import.meta.url));
const base = 'http://localhost:6199';
const only = process.argv.slice(2).map((s) => s.toLowerCase());
const font = process.env.KOI_FONT === 'chill' ? 'chill' : 'system';
const palette = process.env.KOI_PALETTE || 'koi';
const direction = process.env.KOI_DIR === 'rtl' ? 'rtl' : 'ltr';
// What this run writes: other palettes, fonts and directions live in the same folder and are left alone.
const suffix = `${palette === 'koi' ? '' : `_${palette}`}${direction === 'ltr' ? '' : `_${direction}`}`;
// A full run starts clean, so renamed or deleted stories don't leave stale PNGs behind.
if (!only.length) {
  for (const f of readdirSync(`${root}shots`)) {
    if (f.endsWith(`_light${suffix}.png`) || f.endsWith(`_dark${suffix}.png`)) {
      rmSync(`${root}shots/${f}`);
    }
  }
}

// Run the CLI through Node itself rather than the .bin shim: on Windows that shim is a `storybook.cmd`, which
// Node can only start through a shell — and a shell keeps the child's pipes open after kill(), so the run would
// never end. Node + the dispatcher script behaves the same on every platform.
const bin = `${root}node_modules/storybook/dist/bin/dispatcher.js`;
const server = spawn(process.execPath, [bin, 'dev', '-p', '6199', '--ci', '--quiet'], {
  cwd: root,
  stdio: ['ignore', 'ignore', 'pipe'],
});
let serverLog = '';
server.stderr.on('data', (d) => {
  serverLog += d;
});

async function waitForServer() {
  for (let i = 0; i < 240; i++) {
    if (server.exitCode !== null) {
      throw new Error(`Storybook exited:\n${serverLog}`);
    }
    try {
      const r = await fetch(`${base}/index.json`);
      if (r.ok) {
        return r.json();
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Storybook didn't start in 2 minutes:\n${serverLog}`);
}

const browser = await chromium.launch();
const errors = [];
let count = 0;
try {
  const { entries } = await waitForServer();
  const stories = Object.values(entries).filter(
    (e) => e.type === 'story' && (!only.length || only.some((o) => e.title.toLowerCase().endsWith(`/${o}`))),
  );
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, colorScheme: theme });
    page.on('pageerror', (e) => errors.push(`${theme}: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && errors.push(`${theme}: ${m.text()}`));
    for (const s of stories) {
      // A story that claims a phone or tablet (`koi-shot-390x900` tag) is shot at that width: fixed-position overlays
      // live in the viewport, not in the story's box, so a narrow wrapper can't stand in for it. A tag, not a
      // parameter: Storybook's index.json carries tags, and it is what this script reads.
      await page.setViewportSize(shotViewport(s.tags));
      await page.goto(
        `${base}/iframe.html?id=${s.id}&viewMode=story&globals=theme:${theme};font:${font};palette:${palette};direction:${direction}`,
      );
      // `attached`, not `visible`: a story may render nothing in flow (a Drawer or a Dialog that portals itself), so
      // its root child has no box. The paint is awaited below through `document.fonts.ready` plus the story's own
      // mount; portalled content is in the viewport shot.
      await page.waitForSelector('#storybook-root > *', { state: 'attached' });
      await page.evaluate(() => document.fonts.ready);
      const file = `${root}shots/${s.title.split('/').pop()}-${s.name.replace(/\s+/g, '-')}_${theme}${suffix}.png`;
      if (s.tags?.includes('shot-viewport')) {
        await page.waitForTimeout(600); // let the open animation finish
        await page.screenshot({ path: file });
      } else {
        await page.locator('#storybook-root').screenshot({ path: file });
      }
      count++;
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
console.log(`${count} screenshots in apps/storybook/shots/.`);
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors.');
process.exit(errors.length ? 1 : 0);
