// Placeholders for every screen of the capture plan, at the exact path and size of the real capture:
// assets/product/<name>.webp (3200×2000; phones 780×1688), a dark frame labeled "Screenshot pending: <name>".
// The capture overwrites the file; nothing else changes. Their SHA-256 go to placeholders.json so the tools
// tell a placeholder from a capture. A file that is already a capture is never overwritten (unless --force).
//   node tools/capture/placeholders.mjs [--force]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { launch, sha256, webpSize, siteRoot as root } from './lib.mjs';
import { screens, DESKTOP, MOBILE, PRODUCT_DIR } from './screens.config.mjs';

export const LABEL = 'Screenshot pending: ';
const registryPath = path.join(root, 'tools/capture/placeholders.json');
const force = process.argv.includes('--force');
const registry = existsSync(registryPath) ? JSON.parse(await readFile(registryPath, 'utf8')) : { files: {} };
const fonts = {};
for (const file of ['sora-latin-600-normal.woff2', 'dm-sans-latin-500-normal.woff2']) fonts[file] = (await readFile(path.join(root, 'assets/fonts', file))).toString('base64');

await mkdir(path.join(root, PRODUCT_DIR), { recursive: true });
const browser = await launch();
const written = [], kept = [];
try {
  const page = await browser.newPage();
  await page.setContent('<!DOCTYPE html><title>placeholders</title>');
  await page.evaluate(async fonts => {
    for (const [family, file] of [['Sora', 'sora-latin-600-normal.woff2'], ['DM Sans', 'dm-sans-latin-500-normal.woff2']]) {
      const face = new FontFace(family, `url(data:font/woff2;base64,${fonts[file]})`);
      document.fonts.add(await face.load());
    }
  }, fonts);
  for (const screen of screens) {
    const rel = `${PRODUCT_DIR}/${screen.name}.webp`;
    const file = path.join(root, rel);
    if (existsSync(file) && !force && registry.files[rel] !== sha256(await readFile(file))) { kept.push(screen.name); continue; }
    const size = screen.viewport === 'mobile' ? MOBILE : DESKTOP;
    const [width, height] = [size.width * 2, size.height * 2];
    const base64 = await page.evaluate(async ({ width, height, label, name, phone }) => {
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const c = canvas.getContext('2d');
      const glow = c.createRadialGradient(width * .7, height * .62, 0, width * .7, height * .62, Math.max(width, height) * .75);
      glow.addColorStop(0, '#0b2c41'); glow.addColorStop(1, '#061222');
      c.fillStyle = glow; c.fillRect(0, 0, width, height);
      const unit = Math.min(width, height) / 100;
      const inset = unit * 4;
      c.lineWidth = Math.max(2, unit * .25);
      c.strokeStyle = '#1d4b58';
      c.beginPath(); c.roundRect(inset, inset, width - inset * 2, height - inset * 2, unit * 2); c.stroke();
      c.setLineDash([unit * 1.6, unit * 1.2]); c.strokeStyle = 'rgba(45,218,202,.45)';
      c.beginPath(); c.roundRect(inset * 2, inset * 2, width - inset * 4, height - inset * 4, unit * 1.5); c.stroke();
      c.setLineDash([]);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      const lines = phone ? [label.trim(), name] : [label + name];
      const fontSize = phone ? unit * 5.2 : unit * 4.6;
      lines.forEach((line, i) => {
        c.fillStyle = i === lines.length - 1 && phone ? '#2ee6d6' : '#e8f6f7';
        c.font = `600 ${fontSize}px Sora, sans-serif`;
        c.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * fontSize * 1.5);
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.9));
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      return btoa(binary);
    }, { width, height, label: LABEL, name: screen.name, phone: screen.viewport === 'mobile' });
    const buffer = Buffer.from(base64, 'base64');
    const dims = webpSize(buffer);
    if (dims.width !== width || dims.height !== height) throw new Error(`${rel}: expected ${width}×${height}`);
    await writeFile(file, buffer);
    registry.files[rel] = sha256(buffer);
    written.push(screen.name);
  }
} finally { await browser.close(); }
registry.version = 1;
registry.label = LABEL + '<name>';
registry.files = Object.fromEntries(Object.entries(registry.files).sort());
await writeFile(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Placeholders written: ${written.length}${kept.length ? `; real captures kept: ${kept.join(', ')}` : ''}. Registry: tools/capture/placeholders.json`);
