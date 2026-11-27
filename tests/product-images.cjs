// The image path, end to end, without real captures.
// 1. The dormant back-office capture plan keeps its placeholders at the final path and size; staging never
//    publishes one.
// 2. A placeholder is never shown: the pages reference only real captures. In a temporary copy of the site,
//    importing a Sentinel area's desktop and phone captures (as tools/capture/import.mjs does) and rendering again
//    shows them, on desktop and phone, and adds no other product image.
// 3. The hero swap point: hero-swap.mjs refuses missing captures, and with the Sentinel capture copies it rewrites
//    the integrity manifest and turns the swap on; after regeneration the orbit uses them with the product badge.
// Nothing is written to the checkout.
const { chromium } = require('playwright');
const { spawnSync, spawn } = require('node:child_process');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const PORT = Number(process.env.FIXTURE_PORT || 8097);
const HERO = ['sentinel-transactions', 'sentinel-alerts', 'sentinel-rules'];
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const webpSize = b => { const c = b.toString('ascii', 12, 16); if (c === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]; if (c === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; } return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]; };
(async () => {
  // 1. placeholders of the back-office plan
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'tools/capture/placeholders.json'), 'utf8')).files;
  const plan = Object.keys(registry);
  assert.equal(plan.length, 30, 'one placeholder per screen of the back-office capture plan (26 desktop, 4 phone)');
  for (const rel of plan) {
    const buffer = fs.readFileSync(path.join(root, rel));
    const [width, height] = webpSize(buffer);
    const phone = rel.endsWith('-mobile.webp');
    // Either still the registered placeholder at the final size, or a capture that keeps the screen's proportion
    // (the capture may step down to 0.75x to fit the byte budget).
    if (sha(buffer) === registry[rel]) assert.deepEqual([width, height], phone ? [780, 1688] : [3200, 2000], rel + ' placeholder size');
    else assert.ok(Math.abs(width / height - (phone ? 780 / 1688 : 1.6)) < 0.01, rel + ' capture keeps the proportion of its screen');
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
    const pages = () => ['index.html', 'es/index.html'].map(f => fs.readFileSync(path.join(dir, f), 'utf8'));
    const referenced = html => [...new Set([...html.matchAll(/\/assets\/product\/[a-z0-9-]+\.webp/g)].map(m => m[0].slice(1)))].sort();
    const render = () => { const r = spawnSync('python3', ['tools/render.py'], { cwd: dir, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); };
    // 2. a placeholder is never shown: every product image the checked-in pages reference is a real capture
    for (const html of pages()) for (const rel of referenced(html)) assert.notEqual(sha(fs.readFileSync(path.join(dir, rel))), registry[rel], rel + ' is shown while still a placeholder');
    // before the import of the alerts area (its files removed from the copy), the pages show no image there
    const area = 'tour-alerts';
    const files = ['assets/product/sentinel-alerts.webp', 'assets/product/sentinel-alerts-mobile.webp'];
    for (const rel of files) fs.rmSync(path.join(dir, rel), { force: true });
    render();
    const before = pages();
    for (const html of before) assert.ok(!files.some(rel => html.includes('/' + rel)), 'no image before the import');
    // the import writes the desktop and phone captures; rendering again shows them, and only them
    const imported = { [files[0]]: await fixture(3200, 2000, 'alerts'), [files[1]]: await fixture(780, 1688, 'alerts-mobile') };
    for (const [rel, buffer] of Object.entries(imported)) fs.writeFileSync(path.join(dir, rel), buffer);
    render();
    pages().forEach((html, i) => assert.deepEqual(referenced(html).filter(rel => !referenced(before[i]).includes(rel)), files.slice().sort(), 'rendering again shows the two captures and no other product image'));
    const stage = spawnSync(process.execPath, ['tools/stage.mjs'], { cwd: dir, encoding: 'utf8', env: { ...process.env, PUBLIC_SITE_ORIGIN: '' } });
    assert.equal(stage.status, 0, stage.stderr);
    for (const rel of plan) if (sha(fs.readFileSync(path.join(dir, rel))) === registry[rel]) assert.ok(!fs.existsSync(path.join(dir, 'public', rel)), rel + ' placeholder is never published');
    for (const rel of files) assert.ok(fs.existsSync(path.join(dir, 'public', rel)), rel + ' capture is published');
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', path.join(dir, 'public')], { stdio: 'ignore' });
    for (let i = 0; i < 40; i++) { try { await (await fetch(`http://127.0.0.1:${PORT}/`)).text(); break; } catch { await new Promise(r => setTimeout(r, 150)); } }
    for (const [width, rel] of [[1440, files[0]], [390, files[1]]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', ...(width < 600 ? { isMobile: true, hasTouch: true } : {}) });
      await page.goto(`http://127.0.0.1:${PORT}/#${area}`, { waitUntil: 'networkidle' });
      const img = page.locator(`#${area} img`);
      await img.scrollIntoViewIfNeeded(); await img.evaluate(i => i.decode());
      const src = await img.evaluate(i => i.currentSrc);
      assert.ok(src.endsWith('/' + rel), `${width}px shows ${rel}`);
      const served = Buffer.from(await (await fetch(src)).arrayBuffer());
      assert.equal(sha(served), sha(imported[rel]), `${width}px serves the imported file`);
      await page.close();
    }
    // 3. hero swap point, from a state before the swap
    fs.rmSync(path.join(dir, 'tools/capture/hero.json'), { force: true });
    for (const name of HERO) fs.rmSync(path.join(dir, `assets/hero/${name}.webp`), { force: true });
    const swap = (extra = []) => spawnSync(process.execPath, ['tools/capture/hero-swap.mjs', ...extra], { cwd: dir, encoding: 'utf8', env: { ...process.env, SITE_ROOT: dir } });
    assert.notEqual(swap().status, 0, 'hero swap refuses missing capture copies');
    assert.ok(!fs.existsSync(path.join(dir, 'tools/capture/hero.json')), 'nothing changed by a refused swap');
    fs.mkdirSync(path.join(dir, 'assets/hero'), { recursive: true });
    for (const name of HERO) {
      fs.writeFileSync(path.join(dir, `assets/product/${name}.webp`), await fixture(3200, 2000, name));
      fs.writeFileSync(path.join(dir, `assets/hero/${name}.webp`), await fixture(1586, 992, 'hero ' + name));
    }
    const done = swap();
    assert.equal(done.status, 0, done.stderr);
    const integrity = JSON.parse(fs.readFileSync(path.join(dir, 'docs/web-studio/evidence/asset-integrity.json'), 'utf8'));
    assert.deepEqual(integrity.map(e => e.file), HERO.map(name => `assets/hero/${name}.webp`), 'integrity manifest rewritten on purpose, front panel first');
    render();
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    assert.ok(integrity.every(e => html.includes(`<img src="/${e.file}"`)), 'orbit uses the capture copies');
    assert.match(html, /data-hero-images="product">[^<]*PRODUCT UI/, 'badge under the orbit says product UI');
    const check = spawnSync(process.execPath, [path.join(dir, 'tests/integrity.cjs')], { encoding: 'utf8' });
    assert.equal(check.status, 0, check.stderr);
    // after the swap, the concept dashboards are no longer published
    const staged = spawnSync(process.execPath, ['tools/stage.mjs'], { cwd: dir, encoding: 'utf8', env: { ...process.env, PUBLIC_SITE_ORIGIN: '' } });
    assert.equal(staged.status, 0, staged.stderr);
    for (const name of ['dashboard-1.webp', 'dashboard-2.webp', 'dashboard-3.webp']) assert.ok(!fs.existsSync(path.join(dir, 'public/assets', name)), name + ' is not published after the swap');
    for (const name of HERO) assert.ok(fs.existsSync(path.join(dir, 'public/assets/hero', name + '.webp')), name + ' hero copy is published');
    console.log('PASS: 30 back-office placeholders at the final paths, never shown nor published; an imported Sentinel capture appears after rendering again (desktop and phone); hero swap refuses missing copies, rewrites the integrity manifest, turns the product badge on and unpublishes the concept dashboards');
  } finally { server?.kill(); await browser.close(); fs.rmSync(dir, { recursive: true, force: true }); }
})().catch(e => { console.error(e); process.exitCode = 1; });
