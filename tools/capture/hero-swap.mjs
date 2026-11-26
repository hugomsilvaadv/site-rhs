// Deliberate hero swap: replaces the three concept dashboards of the 3D orbit with approved product
// captures (front: Player 360 summary; then the withdrawals queue and reports), updates the integrity
// manifest on purpose and switches the hero badge to product UI. Run only after every hero capture
// was reviewed and approved (screens.mjs --approve), then record the change in DECISIONS.md.
//   node tools/capture/hero-swap.mjs [--check]
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { sha256, webpSize } from './lib.mjs';
import { HERO } from './screens.config.mjs';

export const HERO_ORDER = ['player-360-summary', 'withdrawals-queue', 'reports'];
const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.SITE_ROOT ? path.resolve(process.env.SITE_ROOT) : path.resolve(here, '../..');
const manifestPath = path.join(root, 'tools/capture/manifest.json');
const integrityPath = path.join(root, 'docs/web-studio/evidence/asset-integrity.json');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entries = [];
for (const name of HERO_ORDER) {
  const screen = manifest.screens?.[name];
  assert.ok(screen?.approved, `hero screen not approved yet: ${name}`);
  assert.ok(screen.hero, `hero copy missing for ${name}: capture it again`);
  const buffer = await readFile(path.join(root, screen.hero.path));
  assert.equal(sha256(buffer), screen.hero.sha256, `file changed after approval: ${screen.hero.path}`);
  assert.deepEqual(webpSize(buffer), { width: HERO.width, height: HERO.height }, `${screen.hero.path} must be ${HERO.width}×${HERO.height}`);
  entries.push({ file: screen.hero.path, sha256: screen.hero.sha256, bytes: buffer.length });
}
if (process.argv.includes('--check')) { console.log('Hero swap ready: ' + entries.map(e => e.file).join(', ')); process.exit(0); }
await writeFile(integrityPath, JSON.stringify(entries, null, 2) + '\n');
manifest.hero = { active: true, screens: HERO_ORDER, swappedAt: new Date().toISOString() };
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Hero now uses product captures; integrity manifest updated on purpose. Next: python3 tools/render.py, the test suite, and a DECISIONS.md entry.');
