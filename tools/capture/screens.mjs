// Captures the real Sentinel back-office (mock mode, synthetic data only) for the website.
//
//   node tools/capture/screens.mjs --dry-run       list the plan, check every route against the back-office menu
//                                                  and say which files are still placeholders
//   node tools/capture/screens.mjs [--only a,b]    capture from BACKOFFICE_URL (default http://127.0.0.1:3000)
//   node tools/capture/screens.mjs --self-test     exercise the pipeline against the local static site (temp dir only)
//
// Each capture overwrites its placeholder: assets/product/<name>.webp (desktop: 1600×1000 CSS px at 2×, so
// 3200×2000; phones: 390×844 at 2×, so 780×1688), same name and proportion, so the page needs no change.
// The "PRODUCT UI · SYNTHETIC DATA" badge (and, for the Player 360, the numbered markers) is drawn into the
// image. Hero screens also get a clean 1586×992 copy in assets/hero/ for the deliberate hero swap
// (tools/capture/hero-swap.mjs). Review the contact sheet and every image before committing.
import { mkdir, readFile, writeFile, rm, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { launch, fitWebp, sha256, webpSize, settle, scanForSensitive, visibleStates, hideText, stamp, drawMarkers, siteRoot as root, backofficeDir } from './lib.mjs';
import { buildContactSheet } from './contact-sheet.mjs';
import * as plan from './screens.config.mjs';

const here = path.join(root, 'tools/capture');
const manifestPath = path.join(here, 'manifest.json');
const placeholdersPath = path.join(here, 'placeholders.json');
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const option = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const BUDGET = 250 * 1024;

const localOnly = raw => {
  const url = new URL(raw);
  if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Captures run only against a local back-office in mock mode (localhost or 127.0.0.1), never a shared or production host.');
  return url.origin;
};
const sizeOf = screen => screen.viewport === 'mobile' ? plan.MOBILE : plan.DESKTOP;
const productFile = name => `${plan.PRODUCT_DIR}/${name}.webp`;

// Every captured route must be a real back-office screen: a menu item of src/config/navigation.ts
// (or a detail page under one), so the website never shows a screen the product does not have.
async function menuRoutes() {
  const file = path.join(backofficeDir, 'src/config/navigation.ts');
  if (!existsSync(file)) return null;
  return [...(await readFile(file, 'utf8')).matchAll(/href:\s*"([^"]+)"/g)].map(match => match[1]);
}

async function placeholderState() {
  const known = existsSync(placeholdersPath) ? JSON.parse(await readFile(placeholdersPath, 'utf8')).files : {};
  const state = {};
  for (const screen of plan.screens) {
    const file = path.join(root, productFile(screen.name));
    state[screen.name] = !existsSync(file) ? 'missing' : known[productFile(screen.name)] === sha256(await readFile(file)) ? 'placeholder' : 'captured';
  }
  return state;
}

async function dryRun() {
  const routes = await menuRoutes();
  const files = await placeholderState();
  const rows = plan.screens.map(screen => {
    const base = new URL(screen.path, 'http://x').pathname;
    return { name: screen.name, path: screen.path, viewport: screen.viewport ?? 'desktop', hero: Boolean(screen.hero), markers: Object.keys(screen.markers ?? {}).length, inMenu: routes ? routes.some(route => base === route || base.startsWith(route + '/')) : null, file: files[screen.name] };
  });
  console.table(rows);
  if (!routes) console.log('Back-office checkout not found next to the site (set BACKOFFICE_DIR): routes not checked.');
  const names = rows.map(row => row.name);
  assert.equal(new Set(names).size, names.length, 'screen names are unique');
  const outside = rows.filter(row => row.inMenu === false);
  if (outside.length) { console.error('Not a back-office menu route: ' + outside.map(row => row.name).join(', ')); process.exitCode = 1; }
  console.log(`${rows.filter(row => row.file === 'captured').length} captured, ${rows.filter(row => row.file === 'placeholder').length} placeholders, ${rows.filter(row => row.file === 'missing').length} missing.`);
}

// WebP within the budget: full 2× first, then three quarters of it, same proportion as the placeholder.
async function encode(encoder, png, { width, height }) {
  let result = await fitWebp(encoder, png, { width, height, maxBytes: BUDGET });
  if (result.overBudget) result = await fitWebp(encoder, png, { width: Math.round(width * 0.75), height: Math.round(height * 0.75), maxBytes: BUDGET });
  return result;
}

async function captureAll({ base, screens, outDir, rel, heroDir, heroRel, contexts, phrases = [], crop, css = '', options = {}, signIn }) {
  const browser = await launch();
  const results = {};
  try {
    const encoder = await browser.newPage();
    const sessions = {};
    for (const kind of ['desktop', 'mobile']) {
      if (!screens.some(screen => (screen.viewport ?? 'desktop') === kind)) continue;
      const context = await browser.newContext({ viewport: kind === 'mobile' ? plan.MOBILE : plan.DESKTOP, deviceScaleFactor: 2, colorScheme: 'dark', reducedMotion: 'reduce', locale: 'en-US', ...options, ...(kind === 'mobile' ? { isMobile: true, hasTouch: true } : {}) });
      await contexts?.(context, base);
      sessions[kind] = await context.newPage();
      await signIn?.(sessions[kind], base);
    }
    for (const screen of screens) {
      const page = sessions[screen.viewport ?? 'desktop'];
      const size = sizeOf(screen);
      const warnings = [];
      try {
        await page.setViewportSize(size);
        await page.goto(base + screen.path, { waitUntil: 'networkidle', timeout: 300000 });
        if (screen.prepare) await screen.prepare(page);
        if (screen.ready) await page.locator(screen.ready).first().waitFor({ state: 'visible', timeout: 15000 });
        await settle(page, { css });
        if (screen.hide?.length) {
          const hidden = await hideText(page, screen.hide);
          if (hidden) warnings.push(`hid ${hidden} element(s) matching: ${screen.hide.join(' | ')}`);
        }
        // Crop the top of the page (the shell's first header row): the viewport grows by that much, so the
        // image keeps its size.
        const top = crop && !screen.keepHeader ? Math.ceil(await crop(page)) : 0;
        if (top > 0) { await page.setViewportSize({ width: size.width, height: size.height + top }); await settle(page, { css }); }
        const clip = { x: 0, y: top, width: size.width, height: size.height };
        const states = await visibleStates(page, phrases);
        warnings.push(...states.alerts.map(text => 'visible alert: ' + text.slice(0, 80)), ...states.phrases.map(text => 'error/empty text: ' + text));
        const sensitive = await scanForSensitive(page);
        const shown = sensitive.filter(f => f.visible);
        if (screen.expectSensitive) assert.ok(shown.some(f => f.kind === screen.expectSensitive), 'scanner finds the expected ' + screen.expectSensitive);
        else if (shown.length) throw new Error('sensitive text on screen: ' + shown.map(f => f.kind + ' ' + f.sample).join(', '));
        warnings.push(...sensitive.filter(f => !f.visible).map(f => `outside the image: ${f.kind} ${f.sample}`));
        const entry = { route: screen.path, viewport: [size.width, size.height], scale: 2, ...(top ? { cropTop: top } : {}) };
        // The hero copy is clean: the orbit has its own badge line under it.
        if (screen.hero && heroDir) {
          const clean = await page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide', clip });
          const hero = await fitWebp(encoder, clean, { width: plan.HERO.width, height: plan.HERO.height, maxBytes: BUDGET });
          await writeFile(path.join(heroDir, `${screen.name}.webp`), hero.buffer);
          entry.hero = { path: heroRel + `${screen.name}.webp`, width: plan.HERO.width, height: plan.HERO.height, bytes: hero.bytes, quality: hero.quality, sha256: sha256(hero.buffer) };
        }
        if (screen.markers) {
          entry.markers = await drawMarkers(page, screen.markers);
          for (const key of Object.keys(screen.markers)) if (!entry.markers.includes(key)) warnings.push('marker target not found: ' + key);
        }
        await stamp(page, { small: screen.viewport === 'mobile' });
        const png = await page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide', clip });
        const result = await encode(encoder, png, { width: size.width * 2, height: size.height * 2 });
        await writeFile(path.join(outDir, `${screen.name}.webp`), result.buffer);
        assert.deepEqual(webpSize(result.buffer), { width: result.width, height: result.height });
        entry.file = { path: rel + `${screen.name}.webp`, width: result.width, height: result.height, bytes: result.bytes, quality: result.quality, overBudget: result.overBudget, sha256: sha256(result.buffer) };
        results[screen.name] = { ...entry, warnings, ...(screen.review ? { review: screen.review } : {}) };
        console.log(`captured ${screen.name}: ${result.width}×${result.height} ${(result.bytes / 1024).toFixed(0)} KB q${result.quality}${entry.hero ? ' + hero copy' : ''}${warnings.length ? ` — ${warnings.length} warning(s)` : ''}`);
      } catch (error) {
        console.error(`FAILED ${screen.name}: ${error.message.split('\n')[0]}`);
        results[screen.name] = { route: screen.path, failed: error.message.split('\n')[0] };
      }
    }
  } finally { await browser.close(); }
  return results;
}

async function selfTest() {
  // Proves the mechanics (navigation, crop, hide, scanner, hero copy, markers, badge, WebP size and budget,
  // contact sheet) against the local static website. Writes only to a temporary directory.
  const site = localOnly(process.env.SITE_URL ?? 'http://127.0.0.1:8000');
  const dir = await mkdtemp(path.join(os.tmpdir(), 'rhs-capture-selftest-'));
  await mkdir(path.join(dir, 'hero'), { recursive: true });
  const screens = [
    { name: 'site-home', path: '/', ready: '#home h1', hero: true, markers: { heading: '#home h1', carousel: '#hero-carousel', absent: '#no-such-element' } },
    { name: 'site-contact', path: '/#contact', ready: '#contact', expectSensitive: 'email', keepHeader: true },
    { name: 'site-contact-hidden', path: '/#contact', ready: '#contact', hide: ['sales@rhs-labs.com'], keepHeader: true },
    { name: 'site-home-mobile', path: '/es/', viewport: 'mobile', ready: '#home h1' },
  ];
  const crop = page => page.evaluate(() => document.querySelector('header').getBoundingClientRect().bottom);
  const results = await captureAll({ base: site, screens, outDir: dir, rel: '', heroDir: path.join(dir, 'hero'), heroRel: 'hero/', crop });
  for (const screen of screens) {
    const entry = results[screen.name];
    assert.ok(entry && !entry.failed, `${screen.name} captured (${entry?.failed ?? ''})`);
    const buffer = await readFile(path.join(dir, entry.file.path));
    assert.deepEqual(webpSize(buffer), { width: entry.file.width, height: entry.file.height });
    assert.equal(sha256(buffer), entry.file.sha256);
    const expected = sizeOf(screen);
    assert.equal(entry.file.width * expected.height, entry.file.height * expected.width, `${screen.name} keeps the placeholder proportion`);
  }
  assert.deepEqual([results['site-home'].file.width, results['site-home'].file.height], [3200, 2000], 'desktop file is 3200×2000');
  assert.deepEqual([results['site-home-mobile'].file.width, results['site-home-mobile'].file.height], [780, 1688], 'phone file is 780×1688');
  assert.deepEqual(webpSize(await readFile(path.join(dir, 'hero/site-home.webp'))), { width: plan.HERO.width, height: plan.HERO.height }, 'clean hero copy');
  assert.deepEqual(results['site-home'].markers, ['heading', 'carousel'], 'markers on the parts that exist');
  assert.ok(results['site-home'].warnings.includes('marker target not found: absent'), 'a missing marker target is reported');
  assert.ok(results['site-home'].cropTop > 0 && !results['site-contact'].cropTop, 'header crop applied unless kept');
  assert.ok(results['site-contact-hidden'].warnings.some(w => w.startsWith('hid ')), 'hidden text is reported, and the hidden e-mail no longer fails the scanner');
  const manifest = { version: 2, capturedAt: new Date().toISOString(), source: { repo: 'self-test (static website)', commit: '-', mode: 'static', flagProfile: '-', locale: 'en/es', theme: 'dark' }, screens: results };
  await buildContactSheet({ manifest, htmlPath: path.join(dir, 'contact-sheet.html'), pngPath: path.join(dir, 'contact-sheet.png'), imageBase: '' });
  assert.ok(existsSync(path.join(dir, 'contact-sheet.png')));
  console.log('PASS: capture self-test (crop, hide, scanner, clean hero copy, markers, badge, 3200×2000 and 780×1688 files, budget, contact sheet) in ' + dir);
  if (!flag('--keep')) await rm(dir, { recursive: true, force: true });
}

async function capture() {
  const base = localOnly(process.env.BACKOFFICE_URL ?? 'http://127.0.0.1:3000');
  const only = option('--only')?.split(',').map(name => name.trim()).filter(Boolean);
  const screens = plan.screens.filter(screen => !only || only.includes(screen.name));
  assert.ok(screens.length, 'no screen selected');
  const outDir = path.join(root, plan.PRODUCT_DIR);
  const heroDir = path.join(root, plan.HERO_DIR);
  await mkdir(outDir, { recursive: true });
  await mkdir(heroDir, { recursive: true });
  const results = await captureAll({ base, screens, outDir, rel: plan.PRODUCT_DIR + '/', heroDir, heroRel: plan.HERO_DIR + '/', contexts: plan.prepareContext, phrases: await plan.errorPhrases?.() ?? [], crop: plan.headerCrop, css: plan.CAPTURE_CSS ?? '', options: plan.CONTEXT ?? {}, signIn: plan.signIn });
  const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : { screens: {} };
  let commit = '-';
  try { commit = execFileSync('git', ['-C', backofficeDir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {}
  Object.assign(manifest, { version: 2, capturedAt: new Date().toISOString(), source: { repo: 'back-office', commit, mode: 'mock', flagProfile: 'homologacao', locale: 'en', theme: 'dark' } });
  manifest.screens = { ...manifest.screens, ...results };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  await buildContactSheet({ manifest, htmlPath: path.join(here, 'contact-sheet.html'), pngPath: path.join(here, 'contact-sheet.png'), imageBase: '../../' });
  const failed = Object.entries(results).filter(([, entry]) => entry.failed).map(([name]) => name);
  console.log(`Saved in ${plan.PRODUCT_DIR}/. Review tools/capture/contact-sheet.png and every image before committing.${failed.length ? ' Failed (placeholder kept): ' + failed.join(', ') : ''}`);
  if (failed.length) process.exitCode = 1;
}

if (flag('--dry-run')) await dryRun();
else if (flag('--self-test')) await selfTest();
else await capture();
