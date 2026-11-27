// Open Graph images (1200×630 JPEG), one per published language, rendered from the generated pages so the
// text always matches the hero (headline, subtitle, availability). While the hero shows concept art, the
// image is typographic: social previews never carry concept dashboards without their label. After the
// hero swap to approved product captures, the front capture is placed beside the text.
//   python3 tools/render.py && node tools/og/og.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { launch } from '../capture/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pick = (html, pattern) => (html.match(pattern) || [])[1] || '';
const pages = [['en', 'index.html'], ['es', 'es/index.html']].filter(([, file]) => existsSync(path.join(root, file)));
// Fonts are embedded: a page set from a string cannot load file:// fonts.
const fontData = {};
for (const file of ['sora-latin-600-normal.woff2', 'dm-sans-latin-400-normal.woff2', 'dm-sans-latin-700-normal.woff2']) fontData[file] = (await readFile(path.join(root, 'assets/fonts', file))).toString('base64');
const font = (family, weight, file) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${fontData[file]}) format('woff2')}`;

const browser = await launch();
try {
  for (const [lang, file] of pages) {
    const html = await readFile(path.join(root, file), 'utf8');
    const h1 = pick(html, /<h1>([\s\S]*?)<\/h1>/).replace(/<br>\s*/g, '<br>');
    const subtitle = pick(html, /<p class="hero-subtitle">([\s\S]*?)<\/p>/);
    // The availability chip of the Sentinel section ("Available"), not the badge under the orbit, which names
    // concept art while the hero still shows it.
    const badge = pick(html, /class="rhs-status rhs-status-available">([^<]+)</).toUpperCase();
    if (!badge) throw new Error(`${file}: no availability chip`);
    const kind = pick(html, /data-hero-images="(concept|product)"/);
    const front = kind === 'product' ? pick(html, /id="carousel-track"[\s\S]*?<img src="\/([^"]+)"/) : '';
    const shot = front ? `<div class="shot"><img src="data:image/webp;base64,${(await readFile(path.join(root, front))).toString('base64')}" alt=""></div>` : '';
    const page = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><style>
${font('Sora', 600, 'sora-latin-600-normal.woff2')}${font('DM Sans', 400, 'dm-sans-latin-400-normal.woff2')}${font('DM Sans', 700, 'dm-sans-latin-700-normal.woff2')}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:'DM Sans',sans-serif;color:#eef4f8;
background:radial-gradient(ellipse 70% 80% at 78% 60%,rgba(30,235,217,.18),transparent 62%),radial-gradient(ellipse 90% 70% at 20% 0%,#0b2c41,transparent 70%),#061222}
.ring{position:absolute;width:1500px;height:560px;left:-150px;top:150px;border:1px solid rgba(45,242,209,.16);border-radius:50%;transform:rotate(-8deg)}
main{position:absolute;inset:0;padding:64px 70px;display:flex;flex-direction:column;justify-content:space-between;${front ? 'width:700px' : ''}}
.brand{display:flex;align-items:center;gap:14px;font:600 26px Sora,sans-serif}.brand em{font-style:normal;color:#34cdb8;font-weight:500}
h1{font:600 ${front ? 52 : 64}px/1.08 Sora,sans-serif;letter-spacing:-.045em;margin:0}h1 span{color:#33dcc8}
p{font-size:${front ? 21 : 24}px;line-height:1.45;color:#a8bdcb;margin:22px 0 0;max-width:${front ? 600 : 980}px}
.badge{align-self:flex-start;font:700 15px 'DM Sans',sans-serif;letter-spacing:.14em;color:#7ff1e6;border:1px solid #2a8d99;border-radius:99px;padding:9px 18px;background:rgba(5,32,43,.8)}
.shot{position:absolute;right:-60px;top:110px;width:560px;border:2px solid rgba(48,225,219,.75);border-radius:12px;overflow:hidden;box-shadow:0 30px 90px #000a,0 0 30px rgba(32,206,205,.25);transform:perspective(1400px) rotateY(-14deg)}
.shot img{display:block;width:100%}
</style></head><body><div class="ring"></div>${shot}<main>
<div class="brand"><svg width="38" height="38" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 7L7 27H27Z" fill="none" stroke="#34CDB8" stroke-width="2.2" stroke-linejoin="round"/><circle cx="17" cy="7" r="4" fill="#34CDB8"/><circle cx="7" cy="27" r="4" fill="#34CDB8"/><circle cx="27" cy="27" r="4" fill="#34CDB8"/></svg>RHS Labs <em>/ Sentinel</em></div>
<div><h1>${h1}</h1><p>${subtitle}</p></div><span class="badge">${badge}</span></main></body></html>`;
    const tab = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await tab.setContent(page, { waitUntil: 'load' });
    await tab.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => null))]));
    const out = path.join(root, `assets/og-image-${lang}.jpg`);
    await writeFile(out, await tab.screenshot({ type: 'jpeg', quality: 88 }));
    await tab.close();
    console.log(`Open Graph image: assets/og-image-${lang}.jpg (${kind === 'product' ? 'with the product hero' : 'typographic, concept hero not shown'})`);
  }
} finally { await browser.close(); }
