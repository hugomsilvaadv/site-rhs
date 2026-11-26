// Contact sheet of every captured screen (thumbnail, route, size, review state), as HTML and PNG,
// so each image can be reviewed before it is approved for the website.
//   node tools/capture/contact-sheet.mjs            (reads tools/capture/manifest.json)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { launch } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const escape = value => String(value ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const kb = bytes => (bytes / 1024).toFixed(0) + ' KB';

export function contactSheetHtml(manifest, { imageBase }) {
  const cards = Object.entries(manifest.screens ?? {}).map(([name, screen]) => {
    const preview = screen.file;
    const files = [screen.file, screen.hero].filter(Boolean).map(file => `${file.path.split('/').pop()} ${file.width}×${file.height} · ${kb(file.bytes)} · q${Math.round(file.quality * 100)}${file.overBudget ? ' · <b class="warn">over budget</b>' : ''}`).join('<br>');
    const warnings = [...(screen.warnings ?? [])].map(warning => `<li>${escape(warning)}</li>`).join('');
    return `<figure class="${screen.failed ? 'pending' : 'ok'}">
<div class="thumb">${preview ? `<img src="${escape(imageBase + preview.path)}" alt="">` : '<span>not captured: placeholder kept</span>'}</div>
<figcaption><b>${escape(name)}</b> <span class="state">${screen.failed ? 'failed' : 'captured, review'}</span>
<small>${escape(screen.route)} · ${escape(screen.viewport?.join('×'))} @${escape(screen.scale)}x</small><small>${files}</small>${screen.review ? `<p class="review">Check: ${escape(screen.review)}</p>` : ''}${screen.failed ? `<ul><li>${escape(screen.failed)}</li></ul>` : ''}${warnings ? `<ul>${warnings}</ul>` : ''}</figcaption></figure>`;
  }).join('\n');
  const source = manifest.source ?? {};
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Product screen contact sheet</title><style>
body{margin:0;padding:32px;background:#061222;color:#dbe8ef;font:13px/1.45 system-ui,sans-serif}
h1{font-size:20px;margin:0 0 4px}p{margin:0 0 22px;color:#8fb0bf}
main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
figure{margin:0;border:1px solid #1d4050;border-radius:8px;background:#08192a;overflow:hidden}
figure.ok{border-color:#2f9e8f}.thumb{position:relative;aspect-ratio:16/10;background:#020b14;overflow:hidden}
.thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.thumb span{position:absolute;inset:0;display:grid;place-items:center;color:#ef8497}figcaption{padding:10px 12px}figcaption small{display:block;color:#8fb0bf;margin-top:3px}
.state{float:right;font-size:11px;color:#e5c273}.review{margin:6px 0 0;color:#cfe3ea;font-size:12px}.ok .state{color:#4fd6c4}.warn{color:#ef8497}ul{margin:6px 0 0;padding-left:16px;color:#ef8497}
</style></head><body><h1>Product screen contact sheet</h1>
<p>${escape(source.repo)} @ ${escape(source.commit)} · mode ${escape(source.mode)} · flags ${escape(source.flagProfile)} · locale ${escape(source.locale)} · theme ${escape(source.theme)} · captured ${escape(manifest.capturedAt)}</p>
<main>${cards}</main></body></html>`;
}

export async function buildContactSheet({ manifest, htmlPath, pngPath, imageBase }) {
  await writeFile(htmlPath, contactSheetHtml(manifest, { imageBase }));
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
    await page.evaluate(() => Promise.all([...document.images].map(image => image.decode().catch(() => null))));
    await page.screenshot({ path: pngPath, fullPage: true });
  } finally { await browser.close(); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const manifest = JSON.parse(await readFile(path.join(here, 'manifest.json'), 'utf8'));
  await buildContactSheet({ manifest, htmlPath: path.join(here, 'contact-sheet.html'), pngPath: path.join(here, 'contact-sheet.png'), imageBase: '../../' });
  console.log('Contact sheet: tools/capture/contact-sheet.html and tools/capture/contact-sheet.png');
}
