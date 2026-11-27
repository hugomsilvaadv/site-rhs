// Brings reviewed screenshots taken elsewhere into the website without rewriting them. Each source PNG listed
// in tools/capture/sentinel.config.mjs becomes assets/product/<name>.webp: website size, the product badge
// drawn in, within the byte budget; hero screens also get the clean 1586×992 copy in assets/hero/. A missing
// source is skipped (the page then shows no image there) and a source of the wrong size is refused. Writes
// tools/capture/sentinel-manifest.json and the contact sheet tools/capture/sentinel-contact-sheet.png.
//   node tools/capture/import.mjs <folder with the PNGs> [--dry-run]
//   node tools/capture/import.mjs --self-test
import { mkdir, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { launch, fitWebp, sha256, webpSize, stamp, siteRoot } from './lib.mjs';
import { buildContactSheet } from './contact-sheet.mjs';
import * as plan from './sentinel.config.mjs';

const BUDGET = 250 * 1024;

export function pngSize(buffer) {
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error('not a PNG file');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

// The screenshot fills a viewport of its CSS size at 2×, so the badge is drawn at the same size as on a capture.
async function render(page, png, { width, height, badge, small }) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:#000;overflow:hidden}img{display:block;width:100vw;height:100vh}</style></head><body><img alt="" src="data:image/png;base64,${png.toString('base64')}"></body></html>`);
  await page.evaluate(() => document.images[0].decode());
  if (badge) await stamp(page, { small });
  return page.screenshot({ type: 'png', animations: 'disabled' });
}

export async function importAll({ from, out = siteRoot, dryRun = false, screens = plan.screens }) {
  const results = {};
  const browser = await launch();
  try {
    const context = await browser.newContext({ deviceScaleFactor: 2 });
    const page = await context.newPage();
    const encoder = await browser.newPage();
    for (const screen of screens) {
      const size = screen.viewport === 'mobile' ? plan.MOBILE : plan.DESKTOP;
      const entry = { route: screen.route, viewport: [size.width, size.height], scale: 2, source: screen.source, ...(screen.review ? { review: screen.review } : {}) };
      const source = path.join(from, screen.source);
      if (!existsSync(source)) { results[screen.name] = { ...entry, failed: 'source not found: ' + screen.source }; console.log(`skipped ${screen.name}: ${screen.source} not found`); continue; }
      const png = await readFile(source);
      const got = pngSize(png);
      if (got.width !== size.width * 2 || got.height !== size.height * 2) {
        results[screen.name] = { ...entry, failed: `source is ${got.width}×${got.height}, expected ${size.width * 2}×${size.height * 2}` };
        console.log(`refused ${screen.name}: ${results[screen.name].failed}`);
        continue;
      }
      if (dryRun) { results[screen.name] = { ...entry, dryRun: true }; console.log(`ok ${screen.name} ← ${screen.source}`); continue; }
      if (screen.hero) {
        const clean = await render(page, png, { ...size, badge: false });
        const hero = await fitWebp(encoder, clean, { ...plan.HERO, maxBytes: BUDGET });
        const rel = `assets/hero/${screen.name}.webp`;
        await mkdir(path.join(out, 'assets/hero'), { recursive: true });
        await writeFile(path.join(out, rel), hero.buffer);
        entry.hero = { path: rel, width: hero.width, height: hero.height, bytes: hero.bytes, quality: hero.quality, sha256: sha256(hero.buffer), ...(hero.overBudget ? { overBudget: true } : {}) };
      }
      const stamped = await render(page, png, { ...size, badge: true, small: screen.viewport === 'mobile' });
      let file = await fitWebp(encoder, stamped, { width: size.width * 2, height: size.height * 2, maxBytes: BUDGET });
      if (file.overBudget) file = await fitWebp(encoder, stamped, { width: Math.round(size.width * 1.5), height: Math.round(size.height * 1.5), maxBytes: BUDGET });
      assert.deepEqual(webpSize(file.buffer), { width: file.width, height: file.height });
      const rel = `assets/product/${screen.name}.webp`;
      await mkdir(path.join(out, 'assets/product'), { recursive: true });
      await writeFile(path.join(out, rel), file.buffer);
      entry.file = { path: rel, width: file.width, height: file.height, bytes: file.bytes, quality: file.quality, sha256: sha256(file.buffer), ...(file.overBudget ? { overBudget: true } : {}) };
      results[screen.name] = entry;
      console.log(`imported ${screen.name}: ${file.width}×${file.height} ${(file.bytes / 1024).toFixed(0)} KB q${file.quality}${entry.hero ? ' + hero copy' : ''}${file.overBudget ? ' (over budget)' : ''}`);
    }
  } finally { await browser.close(); }
  if (!dryRun) {
    const manifest = { version: 2, capturedAt: new Date().toISOString(), source: { repo: 'Sentinel demo (fictitious data)', commit: '-', mode: 'imported screenshots', flagProfile: '-', locale: 'en', theme: '-' }, screens: results };
    await mkdir(path.join(out, 'tools/capture'), { recursive: true });
    await writeFile(path.join(out, 'tools/capture/sentinel-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    await buildContactSheet({ manifest, htmlPath: path.join(out, 'tools/capture/sentinel-contact-sheet.html'), pngPath: path.join(out, 'tools/capture/sentinel-contact-sheet.png'), imageBase: '../../' });
  }
  return results;
}

// Proves the mechanics on fixtures in a temporary folder: sizes, badge, hero copy, budget, refusals, contact sheet.
async function selfTest() {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'rhs-import-selftest-'));
  const from = path.join(dir, 'from');
  await mkdir(from, { recursive: true });
  const browser = await launch();
  const fixture = async (page, width, height, label) => Buffer.from(await page.evaluate(async ({ width, height, label }) => {
    const c = document.createElement('canvas'); c.width = width; c.height = height; const x = c.getContext('2d');
    x.fillStyle = '#123a2c'; x.fillRect(0, 0, width, height); x.fillStyle = '#ffffff'; x.font = `bold ${Math.round(width / 20)}px sans-serif`; x.fillText('FIXTURE ' + label, 40, height / 2);
    const blob = await new Promise(r => c.toBlob(r, 'image/png')); const b = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s);
  }, { width, height, label }), 'base64');
  try {
    const page = await browser.newPage();
    await writeFile(path.join(from, 'alerts.png'), await fixture(page, 3200, 2000, 'alerts'));
    await writeFile(path.join(from, 'alerts-mobile.png'), await fixture(page, 780, 1688, 'alerts-mobile'));
    await writeFile(path.join(from, 'rules.png'), await fixture(page, 1600, 1000, 'wrong size'));
  } finally { await browser.close(); }
  try {
    const results = await importAll({ from, out: dir });
    const alerts = results['sentinel-alerts'];
    assert.ok(alerts.file && alerts.hero, 'desktop screen imported with its hero copy');
    assert.equal(alerts.file.width / alerts.file.height, 1.6, 'desktop proportion kept');
    assert.ok(alerts.file.bytes <= BUDGET, 'within the byte budget');
    assert.deepEqual(webpSize(await readFile(path.join(dir, alerts.hero.path))), { width: 1586, height: 992 });
    const phone = results['sentinel-alerts-mobile'];
    assert.deepEqual([phone.file.width, phone.file.height], [780, 1688], 'phone screen at phone size');
    assert.match(results['sentinel-rules'].failed, /expected 3200×2000/, 'a source of the wrong size is refused');
    assert.match(results['sentinel-transactions'].failed, /not found/, 'a missing source is skipped');
    assert.ok(!existsSync(path.join(dir, 'assets/product/sentinel-rules.webp')), 'nothing written for a refused source');
    // The badge is drawn into the product file and not into the hero copy.
    const check = await launch();
    try {
      const page = await check.newPage();
      const corner = async rel => page.evaluate(async source => {
        const image = new Image(); image.src = 'data:image/webp;base64,' + source; await image.decode();
        const c = document.createElement('canvas'); c.width = image.width; c.height = image.height; const x = c.getContext('2d'); x.drawImage(image, 0, 0);
        const w = Math.round(image.width * 0.18), h = Math.round(image.height * 0.06);
        const data = x.getImageData(image.width - w, image.height - h, w, h).data; const colors = new Set();
        for (let i = 0; i < data.length; i += 16) colors.add(data[i] >> 4 << 8 | data[i + 1] >> 4 << 4 | data[i + 2] >> 4);
        return colors.size;
      }, (await readFile(path.join(dir, rel))).toString('base64'));
      assert.ok(await corner(alerts.file.path) > 3, 'badge drawn in the bottom-right corner of the product image');
      assert.ok(await corner(alerts.hero.path) <= 3, 'hero copy without the badge');
    } finally { await check.close(); }
    assert.ok(existsSync(path.join(dir, 'tools/capture/sentinel-contact-sheet.png')), 'contact sheet written');
    console.log('PASS: import self-test (sizes, badge, clean hero copy, budget, refused and missing sources, contact sheet) in ' + dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) await selfTest();
  else {
    const from = args.find(a => !a.startsWith('--'));
    if (!from) { console.error('usage: node tools/capture/import.mjs <folder with the PNGs> [--dry-run] | --self-test'); process.exit(2); }
    const results = await importAll({ from: path.resolve(from), dryRun: args.includes('--dry-run') });
    const done = Object.values(results).filter(r => r.file || r.dryRun).length;
    console.log(`${done} of ${plan.screens.length} screens ${args.includes('--dry-run') ? 'ready' : 'imported'}; review tools/capture/sentinel-contact-sheet.png before committing.`);
  }
}
