// Screenshots every [data-shot] section in light and dark into shots/<Name>_<theme>.png,
// plus the open Dialog. This is how Claude Code checks its visual work: run it, then Read the PNGs.
// Usage: pnpm shots            (starts its own Vite server)
//        KOI_FONT=chill pnpm shots   (ChillRoundF instead of the system font)
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const errors = [];
try {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, colorScheme: theme });
    if (process.env.KOI_FONT === 'chill') await page.addInitScript(() => localStorage.setItem('koi-font', 'chill'));
    page.on('pageerror', (e) => errors.push(`${theme}: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && errors.push(`${theme}: ${m.text()}`));
    await page.goto('http://localhost:5199/');
    await page.waitForSelector('[data-shot]');
    await page.evaluate(() => document.fonts.ready);
    for (const el of await page.$$('[data-shot]')) {
      const name = await el.getAttribute('data-shot');
      await el.screenshot({ path: `${root}shots/${name}_${theme}.png` });
    }
    await page.getByRole('button', { name: '删除文章' }).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${root}shots/Dialog-open_${theme}.png` });
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'Screenshots in apps/playground/shots/, no console errors.');
process.exit(errors.length ? 1 : 0);
