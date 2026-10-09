// Screenshots every story in light and dark into shots/<Component>-<Story>_<theme>.png.
// This is how Claude Code checks its visual work: run it, then Read the PNGs.
// Stories tagged `shot-viewport` (an open Dialog) are shot as the whole viewport, the rest as #storybook-root.
// Usage: pnpm shots                  (starts its own Storybook on port 6199)
//        KOI_FONT=chill pnpm shots   (ChillRoundF instead of the system font)
//        pnpm shots Button Dialog    (only these components)
import { spawn } from 'node:child_process';
import { readdirSync, rmSync } from 'node:fs';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = 'http://localhost:6199';
const only = process.argv.slice(2).map((s) => s.toLowerCase());
// A full run starts clean, so renamed or deleted stories don't leave stale PNGs behind.
if (!only.length) for (const f of readdirSync(`${root}shots`)) if (f.endsWith('.png')) rmSync(`${root}shots/${f}`);

const server = spawn(`${root}node_modules/.bin/storybook`, ['dev', '-p', '6199', '--ci', '--quiet'], { cwd: root, stdio: ['ignore', 'ignore', 'pipe'] });
let serverLog = '';
server.stderr.on('data', (d) => { serverLog += d; });

async function waitForServer() {
  for (let i = 0; i < 240; i++) {
    if (server.exitCode !== null) throw new Error(`Storybook exited:\n${serverLog}`);
    try { const r = await fetch(`${base}/index.json`); if (r.ok) return r.json(); } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Storybook didn't start in 2 minutes:\n${serverLog}`);
}

const browser = await chromium.launch();
const errors = [];
let count = 0;
try {
  const { entries } = await waitForServer();
  const stories = Object.values(entries).filter((e) => e.type === 'story'
    && (!only.length || only.some((o) => e.title.toLowerCase().endsWith(`/${o}`))));
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, colorScheme: theme });
    page.on('pageerror', (e) => errors.push(`${theme}: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && errors.push(`${theme}: ${m.text()}`));
    const font = process.env.KOI_FONT === 'chill' ? 'chill' : 'system';
    for (const s of stories) {
      await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story&globals=theme:${theme};font:${font}`);
      await page.waitForSelector('#storybook-root > *');
      await page.evaluate(() => document.fonts.ready);
      const file = `${root}shots/${s.title.split('/').pop()}-${s.name.replace(/\s+/g, '-')}_${theme}.png`;
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
