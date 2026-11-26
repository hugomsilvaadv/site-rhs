// The three orbit images must be byte-for-byte the files of the integrity manifest
// (docs/web-studio/evidence/asset-integrity.json), and the badge under the orbit must say what they are:
// concept art (the approved V6 dashboards) or product UI (approved captures, after a deliberate swap).
const fs = require('node:fs'); const path = require('node:path'); const crypto = require('node:crypto'); const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/web-studio/evidence/asset-integrity.json'), 'utf8'));
const concept = ['assets/dashboard-1.webp', 'assets/dashboard-2.webp', 'assets/dashboard-3.webp'];
for (const page of ['index.html', 'es/index.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const hero = html.slice(html.indexOf('id="carousel-track"'), html.indexOf('class="carousel-controls"'));
  const images = [...hero.matchAll(/<img src="\/([^"]+)"/g)].map(match => match[1]);
  assert.equal(images.length, 3, `${page}: three orbit images`);
  assert.deepEqual(images, manifest.map(entry => entry.file), `${page}: orbit images are the integrity manifest, in order`);
  const kind = (html.match(/class="carousel-disclosure" data-hero-images="(concept|product)"/) || [])[1];
  assert.equal(kind, images.every(file => concept.includes(file)) ? 'concept' : 'product', `${page}: the badge says what the images are`);
  if (kind === 'concept') assert.match(html, /carousel-disclosure[^>]*>[^<]*(ILLUSTRATIVE CONCEPT|CONCEPTO ILUSTRATIVO)/, `${page}: concept art is labeled as such`);
  else assert.doesNotMatch(html, /carousel-disclosure[^>]*>[^<]*(CONCEPT|CONCEPTO)/, `${page}: product captures are not called concept`);
}
for (const entry of manifest) {
  const buffer = fs.readFileSync(path.join(root, entry.file));
  assert.equal(buffer.length, entry.bytes, `${entry.file}: size`);
  assert.equal(crypto.createHash('sha256').update(buffer).digest('hex'), entry.sha256, `${entry.file}: SHA-256`);
}
console.log('PASS: orbit images match the integrity manifest byte for byte, in order, with a truthful badge (EN/ES)');
