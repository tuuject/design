// Behaviour check for reading direction and long text: the things a screenshot can't judge. Which edge a floating
// panel lines up with, which edge a Drawer opens on, how tall a control gets beside a taller sibling, whether one
// unbreakable word fits a narrow column.
//
// The probes are the `Components/RtlProbe` stories (apps/storybook/src/components/RtlProbe.stories.tsx); the check
// reads their `data-koi-probe` attributes. Two direction modes, because they exercise different plumbing:
// - document: `<html dir>` (the 方向 toolbar global) plus the DirectionProvider the decorator adds, like an app;
// - scoped: an RTL subtree (`dir` on a wrapper + DirectionProvider) inside an LTR document.
//
// Usage: pnpm rtl-check            (starts its own Storybook on port 6199, like pnpm shots)
//        pnpm rtl-check --watch    (keeps the browser open on the last failure: not implemented, reserved)
// Docs: agent-doc/verification.md
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const base = 'http://localhost:6199';
const viewport = { width: 1000, height: 800 };

// Same Node + dispatcher launch as shots.mjs (the .bin shim keeps pipes open after kill on Windows).
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
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Storybook didn't start in 2 minutes:\n${serverLog}`);
}

const results = [];
let failures = 0;
function check(name, ok, detail) {
  if (!ok) {
    failures++;
  }
  const line = `${ok ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  (${detail})`}`;
  results.push(line);
  console.log(line);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport });

async function open(story, direction) {
  await page.goto(
    `${base}/iframe.html?id=components-rtlprobe--${story}&viewMode=story&globals=theme:light;font:system;palette:koi;direction:${direction}`,
  );
  await page.waitForSelector('#storybook-root > *', { state: 'attached' });
  await page.waitForTimeout(450);
}

const box = async (locator) => {
  const b = await locator.boundingBox();
  if (!b) {
    throw new Error(`no box for ${locator}`);
  }
  return b;
};
const round = (n) => Math.round(n * 10) / 10;

/** A panel aligned to its trigger's start edge, clearly wider than the trigger so both edges can't match. */
async function expectStartAligned(label, trigger, floating, rtl) {
  const t = await box(trigger);
  const p = await box(floating);
  const aligned = rtl ? Math.abs(p.x + p.width - (t.x + t.width)) : Math.abs(p.x - t.x);
  const other = rtl ? Math.abs(p.x - t.x) : Math.abs(p.x + p.width - (t.x + t.width));
  check(
    `${label} lines up with the trigger's start (${rtl ? 'rtl' : 'ltr'})`,
    aligned <= 2 && p.width > t.width + 20 && other > 20,
    `trigger ${round(t.x)}..${round(t.x + t.width)}, panel ${round(p.x)}..${round(p.x + p.width)}`,
  );
}

async function expectDrawer(label, side, rtl) {
  const panel = await box(page.locator('.koi-drawer__popup'));
  const atStart = Math.abs(panel.x) < 5;
  const atEnd = Math.abs(panel.x + panel.width - viewport.width) < 5;
  const onStartSide = side === 'start' ? atStart : atEnd;
  check(
    `${label} side="${side}" opens on the ${side} edge (${rtl ? 'rtl' : 'ltr'})`,
    rtl ? (side === 'start' ? atEnd : atStart) : onStartSide,
    `panel x=${round(panel.x)}, width ${round(panel.width)}`,
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
}

try {
  await waitForServer();

  // --- Placement, in the two direction modes -------------------------------------------------------------------
  for (const [mode, story, direction, rtl] of [
    ['document ltr', 'document', 'ltr', false],
    ['document rtl', 'document', 'rtl', true],
    // The scoped story pins the document to LTR itself; the direction global can't change it.
    ['scoped subtree rtl in an ltr document', 'scoped-rtl', 'ltr', true],
  ]) {
    await open(story, direction);
    const htmlDir = await page.evaluate(() => document.documentElement.dir || 'ltr');
    check(
      `${mode}: document direction is ${rtl && story === 'document' ? 'rtl' : 'ltr'}`,
      htmlDir === (rtl && story === 'document' ? 'rtl' : 'ltr'),
      `<html dir="${htmlDir}">`,
    );
    await expectStartAligned(
      `${mode}: Popover bottom-start`,
      page.locator('[data-koi-probe=popover] button'),
      page.locator('.koi-floating-panel__popup').filter({ hasText: 'breiter als' }),
      rtl,
    );
    await expectStartAligned(
      `${mode}: Menu bottom-start`,
      page.locator('[data-koi-probe=menu] button'),
      page.locator('.koi-floating-panel__popup').filter({ hasText: 'Datenschutzgrundverordnung bestätigen' }),
      rtl,
    );
    await expectStartAligned(
      `${mode}: SelectPanel`,
      page.locator('[data-koi-probe=select] button'),
      page.locator('.koi-select-panel__popup'),
      rtl,
    );

    // Drawers: close the panels first (Esc reaches the topmost overlay), then open one side at a time.
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
    for (const side of ['start', 'end']) {
      await page.locator(`[data-koi-probe=drawer-${side}] button`).click();
      await page.waitForSelector('.koi-drawer__popup');
      await page.waitForTimeout(350);
      await expectDrawer(mode, side, rtl);
    }
  }

  // --- The trigger's tooltip follows the value Base UI shows, not the props it was given -----------------------
  await open('document', 'ltr');
  const shownValue = (probe) =>
    page.evaluate((p) => {
      const trigger = document.querySelector(`[data-koi-probe=${p}] button`);
      const span = trigger?.querySelector('.koi-select-panel__value [title]');
      return { text: trigger?.textContent?.trim().replace(/\s+/g, ' '), title: span?.getAttribute('title') };
    }, probe);
  const initial = await shownValue('select');
  check(
    'SelectPanel tooltip matches the first value',
    initial.title === initial.text && !!initial.title,
    JSON.stringify(initial),
  );
  // The probe page keeps the other overlays open, and one of them covers the list; dispatch the click on the option
  // itself instead of hit-testing through a panel that is only there for the placement probes.
  await page.getByRole('option', { name: 'العربية (المملكة العربية السعودية)' }).evaluate((el) => el.click());
  await page.waitForTimeout(250);
  const picked = await shownValue('select');
  check(
    'SelectPanel tooltip follows the value the reader picks',
    picked.title === picked.text && picked.title.includes('العربية'),
    JSON.stringify(picked),
  );
  const none = await shownValue('select-null');
  check(
    'SelectPanel value={null} shows and titles the placeholder',
    none.title === none.text && !!none.title,
    JSON.stringify(none),
  );

  // --- Long text: heights in a row, and one unbreakable word in a narrow column -------------------------------
  await open('row-height-story', 'ltr');
  const heights = await page.evaluate(() => {
    const height = (sel) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().height) : null;
    };
    return {
      button: height('[data-koi-probe=row] .koi-btn'),
      tag: height('[data-koi-probe=row] .koi-tag__root'),
      badge: height('[data-koi-probe=row] .koi-badge__root'),
      textarea: height('[data-koi-probe=row] .koi-textarea'),
    };
  });
  check(
    'Button keeps its own height beside a taller Textarea',
    heights.button === 36,
    `button ${heights.button}px, textarea ${heights.textarea}px`,
  );
  check('Tag keeps its own height beside a taller Textarea', heights.tag === 28, `tag ${heights.tag}px`);
  check('Badge keeps its own height beside a taller Textarea', heights.badge === 22, `badge ${heights.badge}px`);

  await open('narrow-words-story', 'ltr');
  const narrow = await page.evaluate(() =>
    ['button', 'tag', 'badge', 'field'].map((name) => {
      const root = document.querySelector(`[data-koi-probe=narrow-${name}]`);
      if (!root) {
        return { name, missing: true };
      }
      // Any descendant sticking out of the box, not just its scrollWidth: `break-word` lets the glyphs overflow a
      // box whose min-content is wider than the column, and scrollWidth can stop at an `overflow: hidden` ancestor.
      const box = root.getBoundingClientRect();
      let right = box.right;
      for (const el of root.querySelectorAll('*')) {
        right = Math.max(right, el.getBoundingClientRect().right);
      }
      return {
        name,
        overflows: right > box.right + 1,
        width: Math.round(box.width),
        content: Math.round(right - box.left),
      };
    }),
  );
  for (const item of narrow) {
    check(
      `One 40-character word wraps inside a 240px column: ${item.name}`,
      !item.missing && !item.overflows,
      `box ${item.width}px, content ${item.content}px`,
    );
  }
} catch (error) {
  failures++;
  console.log(`FAIL  run: ${error.message.split('\n')[0]}`);
} finally {
  await browser.close();
  server.kill();
}

console.log(failures ? `\n${failures} check(s) failed.` : `\nAll ${results.length} checks passed.`);
process.exit(failures ? 1 : 0);
