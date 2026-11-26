// The capture path, end to end, without real captures: a temporary copy of the site gets obviously fake
// "FIXTURE" images and an approved capture manifest, is rendered and staged, and the page must then show
// them in the tour, the Player 360 (with numbered markers), payments and the hero, each with the single
// product badge, one image at a time on phones. Nothing is written to the checkout.
const { chromium } = require('playwright');
const { spawnSync, spawn } = require('node:child_process');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const PORT = Number(process.env.FIXTURE_PORT || 8097);
const TOUR = ['player-360-payments', 'withdrawals-queue', 'alerts', 'segments', 'audit', 'reports', 'users'];
const PHONE = ['player-360-summary-mobile', 'withdrawals-queue-mobile', 'alerts-mobile', 'reports-mobile'];
const HERO = ['player-360-summary', 'withdrawals-queue', 'reports'];
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rhs-product-images-'));
  let server; const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    for (const name of ['tools', 'assets', 'es', 'index.html', 'site.css', 'site.js', 'robots.txt', 'site.config.json']) fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
    fs.rmSync(path.join(dir, 'tools/capture/manifest.json'), { force: true });
    fs.mkdirSync(path.join(dir, 'assets/product'), { recursive: true }); fs.mkdirSync(path.join(dir, 'assets/hero'), { recursive: true });
    const painter = await browser.newPage();
    const paint = (width, height, label) => painter.evaluate(async ({ width, height, label }) => {
      const c = document.createElement('canvas'); c.width = width; c.height = height; const x = c.getContext('2d');
      x.fillStyle = '#0b2131'; x.fillRect(0, 0, width, height); x.strokeStyle = '#2ddaca'; x.lineWidth = 6; x.strokeRect(3, 3, width - 6, height - 6);
      x.fillStyle = '#e8f6f7'; x.font = `bold ${Math.round(width / 22)}px sans-serif`; x.textAlign = 'center'; x.fillText('FIXTURE ' + label, width / 2, height / 2);
      const blob = await new Promise(r => c.toBlob(r, 'image/webp', 0.8)); const b = new Uint8Array(await blob.arrayBuffer());
      let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s);
    }, { width, height, label });
    const write = async (rel, width, height, label) => { const buf = Buffer.from(await paint(width, height, label), 'base64'); fs.writeFileSync(path.join(dir, rel), buf); return { path: rel, width, height, bytes: buf.length, quality: 0.8, overBudget: false, sha256: crypto.createHash('sha256').update(buf).digest('hex') }; };
    const screens = {};
    for (const name of [...new Set([...TOUR, 'player-360-summary', 'withdrawal-detail'])]) {
      screens[name] = { route: '/fixture', viewport: [1600, 1000], scale: 2, files: [await write(`assets/product/${name}-1600.webp`, 1600, 1000, name)], warnings: [], approved: true };
      if (HERO.includes(name)) screens[name].hero = await write(`assets/hero/${name}.webp`, 1586, 992, name);
    }
    for (const name of PHONE) screens[name] = { route: '/fixture', viewport: [390, 844], scale: 2, files: [await write(`assets/product/${name}-780.webp`, 780, 1688, name)], warnings: [], approved: true };
    screens['player-360-summary'].hotspots = { identity: { x: .05, y: .08, w: .9, h: .1 }, money: { x: .05, y: .2, w: .9, h: .12 }, withdrawals: { x: .66, y: .38, w: .3, h: .2 }, alerts: { x: .66, y: .6, w: .3, h: .15 }, history: { x: .05, y: .8, w: .6, h: .15 } };
    screens.segments.approved = false; // an unreviewed capture must never reach the page
    fs.writeFileSync(path.join(dir, 'tools/capture/manifest.json'), JSON.stringify({ version: 1, screens, hero: { active: true } }, null, 2));
    for (const [cmd, args] of [['python3', ['tools/render.py']], [process.execPath, ['tools/stage.mjs']]]) {
      const run = spawnSync(cmd, args, { cwd: dir, encoding: 'utf8', env: { ...process.env, PUBLIC_SITE_ORIGIN: '' } }); assert.equal(run.status, 0, run.stderr);
    }
    server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', path.join(dir, 'public')], { stdio: 'ignore' });
    for (let i = 0; i < 40; i++) { try { await (await fetch(`http://127.0.0.1:${PORT}/`)).text(); break; } catch { await new Promise(r => setTimeout(r, 150)); } }
    for (const lang of ['en', 'es']) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
      await page.goto(`http://127.0.0.1:${PORT}/${lang === 'es' ? 'es/' : ''}`, { waitUntil: 'networkidle' });
      const hero = await page.evaluate(() => ({ srcs: [...document.querySelectorAll('#carousel-track img')].map(i => i.getAttribute('src')), badge: document.querySelector('.carousel-disclosure').dataset.heroImages, notice: document.querySelector('[data-notice]').dataset.notice }));
      assert.deepEqual(hero.srcs, HERO.map(name => `/assets/hero/${name}.webp`), 'hero uses the approved captures in order');
      assert.equal(hero.badge, 'product'); assert.equal(hero.notice, 'available product', 'footer notice for product screens only');
      for (let i = 0; i < TOUR.length; i++) {
        await page.locator('#platform [role="tab"]').nth(i).click();
        const panel = await page.evaluate(() => { const p = [...document.querySelectorAll('#platform [role="tabpanel"]')].find(x => !x.hidden); const img = p.querySelector('.rhs-frame img'); return { id: p.id, img: img && img.getAttribute('src'), alt: img && img.alt, badge: p.querySelector('.rhs-frame .rhs-badge')?.textContent, list: p.querySelectorAll('.rhs-screens').length, chips: p.querySelectorAll('.rhs-screen-chips li').length }; });
        if (TOUR[i] === 'segments') { assert.equal(panel.img, null, 'unapproved capture stays off the page'); assert.equal(panel.list, 1, 'its area keeps the screens list'); continue; }
        assert.equal(panel.img, `/assets/product/${TOUR[i]}-1600.webp`, panel.id);
        assert.ok(panel.alt.length > 20, 'alt text ' + panel.id); assert.match(panel.badge, /Product UI · Synthetic data|Interfaz del producto · Datos sintéticos/); assert.ok(panel.chips > 0);
      }
      const marks = await page.evaluate(() => [...document.querySelectorAll('#player-360 .rhs-hotspots circle')].map(c => [+c.getAttribute('cx'), +c.getAttribute('cy')]));
      assert.equal(marks.length, 5, 'five numbered markers'); assert.ok(marks.every(([x, y]) => x > 0 && x < 1600 && y > 0 && y < 1000), 'markers inside the image');
      assert.equal(await page.locator('#player-360 .rhs-anatomy-legend li').count(), 5, 'the five parts become the legend');
      assert.equal(await page.locator('#payments .rhs-wide-shot img').getAttribute('src'), '/assets/product/withdrawal-detail-1600.webp');
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } });
      await page.waitForLoadState('networkidle');
      assert.ok(await page.evaluate(() => [...document.images].filter(i => getComputedStyle(i).display !== 'none' && i.closest(':not([hidden])') && i.getBoundingClientRect().width > 0).every(i => i.complete && i.naturalWidth > 0)), 'visible images load');
      assert.deepEqual(errors, [], 'no failed requests or script errors');
      await page.close();
      const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      await phone.goto(`http://127.0.0.1:${PORT}/${lang === 'es' ? 'es/' : ''}#tour-payments`, { waitUntil: 'networkidle' });
      const mobile = await phone.evaluate(() => ({ visible: [...document.querySelectorAll('#platform .rhs-frame img')].filter(i => i.getBoundingClientRect().height > 0).map(i => i.currentSrc.split('/').pop()), overflow: document.documentElement.scrollWidth - innerWidth }));
      assert.deepEqual(mobile.visible, ['withdrawals-queue-mobile-780.webp'], 'one tour image at a time, the phone capture on phones');
      assert.equal(mobile.overflow, 0);
      await phone.close();
    }
    console.log('PASS: approved captures reach the tour, Player 360 markers, payments and the hero with one product badge; unapproved ones never do; phones get one phone image at a time (EN/ES, fixtures only)');
  } finally { server?.kill(); await browser.close(); if (process.env.KEEP_FIXTURE) console.log('fixture site kept in ' + dir); else fs.rmSync(dir, { recursive: true, force: true }); }
})().catch(e => { console.error(e); process.exitCode = 1; });
