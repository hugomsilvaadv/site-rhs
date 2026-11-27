// The hero swap point. Until it runs, the 3D orbit keeps the three approved concept dashboards. When the three
// Sentinel captures exist (real captures, never placeholders) and their clean hero copies were made by
// import.mjs (assets/hero/<name>.webp, 1586×992), this script rewrites the integrity manifest on purpose and
// turns the swap on (tools/capture/hero.json); the generator then uses them, front panel first, with the
// "PRODUCT UI · SYNTHETIC DATA" badge under the orbit.
//   node tools/capture/hero-swap.mjs --check     what is missing, changes nothing
//   node tools/capture/hero-swap.mjs             swap (then: python3 tools/render.py, the tests, a DECISIONS entry)
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { sha256, webpSize, siteRoot } from './lib.mjs';
import { HERO, PRODUCT_DIR, HERO_DIR } from './screens.config.mjs';

// Front panel first; the same order as HERO_PRODUCT in tools/render.py.
export const HERO_ORDER = ['sentinel-transactions', 'sentinel-alerts', 'sentinel-rules'];
const root = process.env.SITE_ROOT ? path.resolve(process.env.SITE_ROOT) : siteRoot;
const registryPath = path.join(root, 'tools/capture/placeholders.json');
const integrityPath = path.join(root, 'docs/web-studio/evidence/asset-integrity.json');
const statePath = path.join(root, 'tools/capture/hero.json');

const placeholders = existsSync(registryPath) ? JSON.parse(await readFile(registryPath, 'utf8')).files : {};
const problems = [], entries = [];
for (const name of HERO_ORDER) {
  const capture = `${PRODUCT_DIR}/${name}.webp`, copy = `${HERO_DIR}/${name}.webp`;
  if (!existsSync(path.join(root, capture))) problems.push(`${capture} is missing`);
  else if (placeholders[capture] === sha256(await readFile(path.join(root, capture)))) problems.push(`${capture} is still the placeholder`);
  if (!existsSync(path.join(root, copy))) { problems.push(`${copy} is missing (made by import.mjs with the capture)`); continue; }
  const buffer = await readFile(path.join(root, copy));
  const size = webpSize(buffer);
  if (size.width !== HERO.width || size.height !== HERO.height) problems.push(`${copy} is ${size.width}×${size.height}, not ${HERO.width}×${HERO.height}`);
  entries.push({ file: copy, sha256: sha256(buffer), bytes: buffer.length });
}
if (problems.length) {
  console.error('Hero swap not ready:\n- ' + problems.join('\n- '));
  process.exit(process.argv.includes('--check') ? 0 : 1);
}
if (process.argv.includes('--check')) { console.log('Hero swap ready: ' + entries.map(entry => entry.file).join(', ')); process.exit(0); }
assert.equal(entries.length, 3);
await writeFile(integrityPath, JSON.stringify(entries, null, 2) + '\n');
await writeFile(statePath, JSON.stringify({ active: true, screens: HERO_ORDER, swappedAt: new Date().toISOString() }, null, 2) + '\n');
console.log('Hero swap on; integrity manifest rewritten on purpose. Next: python3 tools/render.py (on Windows: py tools/render.py), node tools/og/og.mjs, the tests, and a DECISIONS.md entry.');
