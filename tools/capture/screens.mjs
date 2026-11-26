// Captures the real RHS PAM back-office (mock mode, synthetic data only) for the website.
//
//   node tools/capture/screens.mjs --dry-run              list the plan and check every route against the back-office menu
//   node tools/capture/screens.mjs --self-test            exercise the pipeline against the local static site (temp dir only)
//   node tools/capture/screens.mjs [--only a,b]           capture from BACKOFFICE_URL (default http://127.0.0.1:3000)
//   node tools/capture/screens.mjs --approve a,b          mark reviewed screens as approved for the website
//
// Output: assets/product/<name>-<width>.webp, assets/hero/<name>.webp (hero size), tools/capture/manifest.json
// and the contact sheet. Nothing is published until a screen is approved after review; the hero swap is a
// separate, deliberate step (tools/capture/hero-swap.mjs). See tools/capture/README.md.
import { mkdir, readFile, writeFile, rm, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { launch, fitWebp, sha256, webpSize, settle, scanForSensitive, visibleStates, boxes, hideText } from './lib.mjs';
import { buildContactSheet } from './contact-sheet.mjs';
import * as plan from './screens.config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const manifestPath = path.join(here, 'manifest.json');
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const option = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const BUDGET = 250 * 1024;

async function readManifest() {
  return existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : { version: 1, screens: {} };
}

function localOnly(raw) {
  const url = new URL(raw);
  if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Captures run only against a local back-office in mock mode (localhost or 127.0.0.1), never a shared or production host.');
  return url.origin;
}

// Every captured route must be a real back-office screen: a menu item of src/config/navigation.ts
// (or a detail page under one), so the website never shows a screen the product does not have.
async function menuRoutes() {
  const file = path.resolve(root, process.env.BACKOFFICE_DIR ?? '../rhs-pam-backoffice', 'src/config/navigation.ts');
  if (!existsSync(file)) return null;
  const source = await readFile(file, 'utf8');
  return [...source.matchAll(/href:\s*"([^"]+)"/g)].map(match => match[1]);
}

async function dryRun() {
  const routes = await menuRoutes();
  const rows = plan.screens.map(screen => {
    const base = new URL(screen.path, 'http://x').pathname;
    const menu = routes ? routes.some(route => base === route || base.startsWith(route + '/')) : null;
    return { name: screen.name, path: screen.path, viewport: screen.viewport, hero: Boolean(screen.hero), hotspots: Object.keys(screen.hotspots ?? {}).length, inMenu: menu };
  });
  console.table(rows);
  if (!routes) console.log('Back-office checkout not found next to the site (set BACKOFFICE_DIR); routes not checked.');
  const missing = rows.filter(row => row.inMenu === false);
  if (missing.length) { console.error('Not a back-office menu route:', missing.map(row => row.name).join(', ')); process.exitCode = 1; }
  const names = rows.map(row => row.name);
  assert.equal(new Set(names).size, names.length, 'screen names are unique');
}

// Encodes one screenshot into its website files and returns the manifest entry.
async function emit(encoder, png, screen, outDir, rel) {
  const sizes = screen.viewport === 'mobile' ? [[plan.MOBILE.width * 2, plan.MOBILE.height * 2]] : [[plan.DESKTOP.width * 2, plan.DESKTOP.height * 2], [plan.DESKTOP.width, plan.DESKTOP.height]];
  const files = [];
  for (const [width, height] of sizes) {
    const result = await fitWebp(encoder, png, { width, height, maxBytes: BUDGET });
    const name = `${screen.name}-${width}.webp`;
    await writeFile(path.join(outDir, name), result.buffer);
    assert.deepEqual(webpSize(result.buffer), { width, height });
    files.push({ path: rel + name, width, height, bytes: result.bytes, quality: result.quality, overBudget: result.overBudget, sha256: sha256(result.buffer) });
  }
  return files;
}

async function heroFile(encoder, png, screen, heroDir, rel) {
  const result = await fitWebp(encoder, png, { width: plan.HERO.width, height: plan.HERO.height, maxBytes: BUDGET });
  const name = `${screen.name}.webp`;
  await writeFile(path.join(heroDir, name), result.buffer);
  return { path: rel + name, width: plan.HERO.width, height: plan.HERO.height, bytes: result.bytes, quality: result.quality, overBudget: result.overBudget, sha256: sha256(result.buffer) };
}

async function captureAll({ base, screens, outDir, heroDir, rel, heroRel, contexts, phrases, crop, css = '', options = {}, signIn }) {
  const browser = await launch();
  const results = {};
  try {
    const encoder = await browser.newPage();
    const sessions = {};
    for (const kind of ['desktop', 'mobile']) {
      if (!screens.some(screen => (screen.viewport ?? 'desktop') === kind)) continue;
      const size = kind === 'mobile' ? plan.MOBILE : plan.DESKTOP;
      const context = await browser.newContext({ viewport: size, deviceScaleFactor: 2, colorScheme: 'dark', reducedMotion: 'reduce', locale: 'en-US', ...options, ...(kind === 'mobile' ? { isMobile: true, hasTouch: true } : {}) });
      await contexts?.(context, base);
      sessions[kind] = await context.newPage();
      await signIn?.(sessions[kind], base);
    }
    for (const screen of screens) {
      const page = sessions[screen.viewport ?? 'desktop'];
      const size = screen.viewport === 'mobile' ? plan.MOBILE : plan.DESKTOP;
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
        // Crop the top of the page (e.g. the shell's first header row): the viewport grows by that much,
        // so the image keeps its frame size.
        const top = crop && !screen.keepHeader ? Math.ceil(await crop(page)) : 0;
        if (top > 0) { await page.setViewportSize({ width: size.width, height: size.height + top }); await settle(page, { css }); }
        const frame = { x: 0, y: top, width: size.width, height: size.height };
        const states = await visibleStates(page, phrases);
        warnings.push(...states.alerts.map(text => 'visible alert: ' + text.slice(0, 80)), ...states.phrases.map(text => 'error/empty text: ' + text));
        const sensitive = await scanForSensitive(page);
        const shown = sensitive.filter(f => f.visible);
        if (screen.expectSensitive) assert.ok(shown.some(f => f.kind === screen.expectSensitive), 'scanner finds the expected ' + screen.expectSensitive);
        else if (shown.length) throw new Error('sensitive text on screen: ' + shown.map(f => f.kind + ' ' + f.sample).join(', '));
        warnings.push(...sensitive.filter(f => !f.visible).map(f => `outside the image: ${f.kind} ${f.sample}`));
        const hotspots = screen.hotspots ? await boxes(page, screen.hotspots, frame) : undefined;
        if (screen.hotspots) for (const key of Object.keys(screen.hotspots)) if (!hotspots[key]) warnings.push('hotspot not found: ' + key);
        const png = await page.screenshot({ type: 'png', animations: 'disabled', caret: 'hide', clip: frame });
        const files = await emit(encoder, png, screen, outDir, rel);
        const hero = screen.hero && heroDir ? await heroFile(encoder, png, screen, heroDir, heroRel) : undefined;
        results[screen.name] = { route: screen.path, viewport: [size.width, size.height], scale: 2, ...(top ? { cropTop: top } : {}), files, ...(hero ? { hero } : {}), ...(hotspots ? { hotspots } : {}), warnings, ...(screen.review ? { review: screen.review } : {}), approved: false };
        console.log(`captured ${screen.name}: ${files.map(f => `${f.width}w ${(f.bytes / 1024).toFixed(0)}KB q${f.quality}`).join(', ')}${warnings.length ? ' — ' + warnings.length + ' warning(s)' : ''}`);
      } catch (error) {
        console.error(`FAILED ${screen.name}: ${error.message.split('\n')[0]}`);
        results[screen.name] = { route: screen.path, failed: error.message.split('\n')[0], approved: false };
      }
    }
  } finally { await browser.close(); }
  return results;
}

async function selfTest() {
  // Proves the mechanics (navigation, settle, scanner, hotspot boxes, WebP budget, contact sheet) on the
  // local static website. Writes only to a temporary directory.
  const site = localOnly(process.env.SITE_URL ?? 'http://127.0.0.1:8000');
  const dir = await mkdtemp(path.join(os.tmpdir(), 'rhs-capture-selftest-'));
  const heroDir = path.join(dir, 'hero');
  await mkdir(heroDir, { recursive: true });
  const screens = [
    { name: 'site-home', path: '/', ready: '#home h1', hero: true, hotspots: { heading: '#home h1', carousel: '#hero-carousel' } },
    { name: 'site-contact', path: '/#contact', ready: '#contact', expectSensitive: 'email', keepHeader: true },
    { name: 'site-contact-hidden', path: '/#contact', ready: '#contact', hide: ['sales@rhs-labs.com'], keepHeader: true },
    { name: 'site-home-mobile', path: '/es/', viewport: 'mobile', ready: '#home h1' },
  ];
  const crop = page => page.evaluate(() => document.querySelector('header').getBoundingClientRect().bottom);
  const results = await captureAll({ base: site, screens, outDir: dir, heroDir, rel: '', heroRel: 'hero/', phrases: [], crop });
  for (const screen of screens) {
    const entry = results[screen.name];
    assert.ok(entry && !entry.failed, `${screen.name} captured (${entry?.failed ?? ''})`);
    for (const file of entry.files) {
      const buffer = await readFile(path.join(dir, file.path));
      assert.deepEqual(webpSize(buffer), { width: file.width, height: file.height });
      assert.equal(sha256(buffer), file.sha256);
    }
  }
  assert.deepEqual(results['site-home'].files.map(f => [f.width, f.height]), [[3200, 2000], [1600, 1000]]);
  assert.deepEqual(results['site-home-mobile'].files.map(f => [f.width, f.height]), [[plan.MOBILE.width * 2, plan.MOBILE.height * 2]]);
  assert.deepEqual([results['site-home'].hero.width, results['site-home'].hero.height], [plan.HERO.width, plan.HERO.height]);
  assert.ok(results['site-home'].hotspots.heading.w > 0 && results['site-home'].hotspots.carousel.h > 0, 'hotspot boxes measured');
  assert.ok(results['site-home'].cropTop > 0 && !results['site-contact'].cropTop, 'header crop applied unless kept');
  assert.ok(results['site-contact-hidden'].warnings.some(w => w.startsWith('hid ')), 'hidden text is reported, and the hidden e-mail no longer fails the scanner');
  const manifest = { version: 1, capturedAt: new Date().toISOString(), source: { repo: 'self-test (static website)', commit: '-', mode: 'static', flagProfile: '-', locale: 'en/es', theme: 'dark' }, screens: results };
  await buildContactSheet({ manifest, htmlPath: path.join(dir, 'contact-sheet.html'), pngPath: path.join(dir, 'contact-sheet.png'), imageBase: '' });
  assert.ok(existsSync(path.join(dir, 'contact-sheet.png')));
  console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([name, entry]) => [name, entry.files.map(f => `${f.width}x${f.height} ${(f.bytes / 1024).toFixed(1)}KB q${f.quality}${f.overBudget ? ' OVER' : ''}`)])), null, 1));
  console.log('PASS: capture self-test (navigation, settle, sensitive-text scanner, hotspot boxes, WebP sizes and budget, contact sheet) in ' + dir);
  if (!flag('--keep')) await rm(dir, { recursive: true, force: true });
}

async function capture() {
  const base = localOnly(process.env.BACKOFFICE_URL ?? 'http://127.0.0.1:3000');
  const only = option('--only')?.split(',').map(name => name.trim()).filter(Boolean);
  const screens = plan.screens.filter(screen => !only || only.includes(screen.name));
  assert.ok(screens.length, 'no screen selected');
  const outDir = path.join(root, 'assets/product');
  const heroDir = path.join(root, 'assets/hero');
  await mkdir(outDir, { recursive: true });
  await mkdir(heroDir, { recursive: true });
  const results = await captureAll({ base, screens, outDir, heroDir, rel: 'assets/product/', heroRel: 'assets/hero/', contexts: plan.prepareContext, phrases: await plan.errorPhrases?.() ?? [], crop: plan.headerCrop, css: plan.CAPTURE_CSS ?? '', options: plan.CONTEXT ?? {}, signIn: plan.signIn });
  const manifest = await readManifest();
  let commit = '-';
  try { commit = execFileSync('git', ['-C', path.resolve(root, process.env.BACKOFFICE_DIR ?? '../rhs-pam-backoffice'), 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {}
  manifest.capturedAt = new Date().toISOString();
  manifest.source = { repo: 'back-office', commit, mode: 'mock', flagProfile: 'homologacao', locale: 'en', theme: 'dark' };
  manifest.screens = { ...manifest.screens, ...results };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  await buildContactSheet({ manifest, htmlPath: path.join(here, 'contact-sheet.html'), pngPath: path.join(here, 'contact-sheet.png'), imageBase: '../../' });
  const failed = Object.entries(results).filter(([, entry]) => entry.failed).map(([name]) => name);
  console.log(`Manifest: tools/capture/manifest.json. Contact sheet: tools/capture/contact-sheet.png. Review every image, then --approve.${failed.length ? ' Failed: ' + failed.join(', ') : ''}`);
  if (failed.length) process.exitCode = 1;
}

async function approve(names) {
  const manifest = await readManifest();
  for (const name of names) {
    const entry = manifest.screens[name];
    assert.ok(entry && !entry.failed && entry.files?.length, 'not a captured screen: ' + name);
    for (const file of [...entry.files, ...(entry.hero ? [entry.hero] : [])]) assert.equal(sha256(await readFile(path.join(root, file.path))), file.sha256, 'file changed after capture: ' + file.path);
    entry.approved = true;
    entry.approvedAt = new Date().toISOString();
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('Approved for the website: ' + names.join(', ') + '. Run python3 tools/render.py next.');
}

if (flag('--dry-run')) await dryRun();
else if (flag('--self-test')) await selfTest();
else if (option('--approve')) await approve(option('--approve').split(',').map(name => name.trim()).filter(Boolean));
else await capture();
