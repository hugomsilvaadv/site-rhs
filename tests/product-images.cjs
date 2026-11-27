// The image swap, end to end, without real captures.
// 1. Every screen of the capture plan has its placeholder at the final path and size.
// 2. In a temporary copy of the site, overwriting placeholders with other files (as the capture does) changes
//    what the page shows with no other change: same HTML, no regeneration.
// 3. The hero swap point: hero-swap.mjs refuses placeholders, and with capture copies it rewrites the integrity
//    manifest and turns the swap on; after regeneration the orbit uses them with the product badge.
// Nothing is written to the checkout.
const { chromium } = require('playwright');
const { spawnSync, spawn } = require('node:child_process');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const PORT = Number(process.env.FIXTURE_PORT || 8097);
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const webpSize = b => { const c = b.toString('ascii', 12, 16); if (c === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]; if (c === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; } return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]; };
(async () => {
  // 1. placeholders
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'tools/capture/placeholders.json'), 'utf8')).files;
  const plan = Object.keys(registry);
  assert.equal(plan.length, 30, 'one placeholder per screen of the capture plan (26 desktop, 4 phone)');
  for (const rel of plan) {
    const buffer = fs.readFileSync(path.join(root, rel));
    assert.deepEqual(webpSize(buffer), rel.endsWith('-mobile.webp') ? [780, 1688] : [3200, 2000], rel + ' size');
    assert.equal(sha(buffer), registry[rel], rel + ' is the registered placeholder');
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rhs-product-images-'));
  let server; const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const name of ['tools', 'tests', 'assets', 'docs/web-studio/evidence', 'es', 'index.html', 'site.css', 'site.js', 'robots.txt', 'site.config.json']) fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
    const painter = await browser.newPage();
    const fixture = async (width, height, label) => Buffer.from(await painter.evaluate(async ({ width, height, label }) => {
      const c = document.createElement('canvas'); c.width = width; c.height = height; const x = c.getContext('2d');
      x.fillStyle = '#123a2c'; x.fillRect(0, 0, width, height); x.fillStyle = '#ffffff'; x.font = `bold ${Math.round(width / 20)}px sans-serif`; x.textAlign = 'center'; x.fillText('FIXTURE ' + label, width / 2, height / 2);
      const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.8)); const b = new Uint8Array(await blob.arrayBuffer());
      let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s);
    }, { width, height, label }), 'base64');
    const htmlBefore = ['index.html', 'es/index.html'].map(f => fs.readFileSync(path.join(dir, f), 'utf8'));
    // 2. the capture overwrites two placeholders (desktop and phone) — nothing else changes
    const swapped = { 'assets/product/withdrawals-queue.webp': await fixture(3200, 2000, 'withdrawals-queue'), 'assets/product/withdrawals-queue-mobile.webp': await fixture(780, 1688, 'withdrawals-queue-mobile') };
    for (const [rel, buffer] of Object.entries(swapped)) fs.writeFileSync(path.join(dir, rel), buffer);
    const stage = spawnSync(process.execPath, ['tools/stage.mjs'], { cwd: dir, encoding: 'utf8', env: { ...process.env, PUBLIC_SITE_ORIGIN: '' } });
    assert.equal(stage.status, 0, stage.stderr);
    assert.deepEqual(['index.html', 'es/index.html'].map(f => fs.readFileSync(path.join(dir, f), 'utf8')), htmlBefore, 'no page change for the swap');
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', path.join(dir, 'public')], { stdio: 'ignore' });
    for (let i = 0; i < 40; i++) { try { await (await fetch(`http://127.0.0.1:${PORT}/`)).text(); break; } catch { await new Promise(r => setTimeout(r, 150)); } }
    for (const [width, rel] of [[1440, 'assets/product/withdrawals-queue.webp'], [390, 'assets/product/withdrawals-queue-mobile.webp']]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', ...(width < 600 ? { isMobile: true, hasTouch: true } : {}) });
      await page.goto(`http://127.0.0.1:${PORT}/#tour-payments`, { waitUntil: 'networkidle' });
      const img = page.locator('#tour-payments img');
      await img.scrollIntoViewIfNeeded(); await img.evaluate(i => i.decode());
      const src = await img.evaluate(i => i.currentSrc);
      assert.ok(src.endsWith('/' + rel), `${width}px shows ${rel}`);
      const served = Buffer.from(await (await fetch(src)).arrayBuffer());
      assert.equal(sha(served), sha(swapped[rel]), `${width}px serves the new file, not the placeholder`);
      await page.close();
    }
    // 3. hero swap point
    const swap = (extra = []) => spawnSync(process.execPath, ['tools/capture/hero-swap.mjs', ...extra], { cwd: dir, encoding: 'utf8', env: { ...process.env, SITE_ROOT: dir } });
    assert.notEqual(swap().status, 0, 'hero swap refuses placeholders');
    assert.ok(!fs.existsSync(path.join(dir, 'tools/capture/hero.json')), 'nothing changed by a refused swap');
    fs.mkdirSync(path.join(dir, 'assets/hero'), { recursive: true });
    for (const name of ['player-360-summary', 'withdrawals-queue', 'reports']) {
      if (name !== 'withdrawals-queue') fs.writeFileSync(path.join(dir, `assets/product/${name}.webp`), await fixture(3200, 2000, name));
      fs.writeFileSync(path.join(dir, `assets/hero/${name}.webp`), await fixture(1586, 992, 'hero ' + name));
    }
    const done = swap();
    assert.equal(done.status, 0, done.stderr);
    const integrity = JSON.parse(fs.readFileSync(path.join(dir, 'docs/web-studio/evidence/asset-integrity.json'), 'utf8'));
    assert.deepEqual(integrity.map(e => e.file), ['assets/hero/player-360-summary.webp', 'assets/hero/withdrawals-queue.webp', 'assets/hero/reports.webp'], 'integrity manifest rewritten on purpose, front panel first');
    const render = spawnSync('python3', ['tools/render.py'], { cwd: dir, encoding: 'utf8' });
    assert.equal(render.status, 0, render.stderr);
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.ok(integrity.every(e => html.includes(`<img src="/${e.file}"`)), 'orbit uses the capture copies');
    assert.match(html, /data-hero-images="product">[^<]*PRODUCT UI/, 'badge under the orbit says product UI');
    const check = spawnSync(process.execPath, [path.join(dir, 'tests/integrity.cjs')], { encoding: 'utf8' });
    assert.equal(check.status, 0, check.stderr);
    console.log('PASS: 30 placeholders at the final paths; overwriting a file swaps the image with no page change (desktop and phone); hero swap refuses placeholders, rewrites the integrity manifest and turns the product badge on');
  } finally { server?.kill(); await browser.close(); fs.rmSync(dir, { recursive: true, force: true }); }
})().catch(e => { console.error(e); process.exitCode = 1; });
