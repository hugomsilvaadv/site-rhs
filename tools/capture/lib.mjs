// Shared helpers for the product-screen capture pipeline (no package dependencies:
// Playwright and Chromium come from the environment, WebP is encoded by Chromium's canvas).
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
export const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const backofficeDir = path.resolve(siteRoot, process.env.BACKOFFICE_DIR ?? '../rhs-pam-backoffice');

// Playwright from this environment, or else from the back-office checkout next to the site
// (its dev dependency), so a notebook needs no extra install.
export function playwright() {
  const from = createRequire(path.join(backofficeDir, 'package.json'));
  for (const load of [() => require('playwright'), () => from('playwright'), () => from('@playwright/test')]) {
    try { return load(); } catch {}
  }
  throw new Error('Playwright not found: install the back-office dependencies next to the site (or set BACKOFFICE_DIR), or run where Playwright is available.');
}

// CHROMIUM_PATH picks a browser binary; CAPTURE_CHANNEL an installed browser ("msedge" or "chrome" on Windows).
export async function launch() {
  const { chromium } = playwright();
  if (process.env.CHROMIUM_PATH) return chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  return chromium.launch(process.env.CAPTURE_CHANNEL ? { channel: process.env.CAPTURE_CHANNEL } : {});
}

export const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');

// Width and height of a WebP file from its RIFF header (VP8, VP8L or VP8X), without decoding it.
export function webpSize(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') throw new Error('not a WebP file');
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (chunk === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  throw new Error('unknown WebP chunk ' + chunk);
}

// Encodes a PNG screenshot to WebP at the given size and quality inside a browser page.
export async function encodeWebp(page, png, { width, height, quality }) {
  const base64 = await page.evaluate(async ({ source, width, height, quality }) => {
    const image = new Image();
    image.src = 'data:image/png;base64,' + source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.type !== 'image/webp') throw new Error('this browser cannot encode WebP');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(binary);
  }, { source: png.toString('base64'), width, height, quality });
  return Buffer.from(base64, 'base64');
}

// Highest quality (starting at ~0.82) that keeps the file within the byte budget.
export async function fitWebp(page, png, { width, height, maxBytes, qualities = [0.82, 0.78, 0.74, 0.7, 0.66] }) {
  let best = null;
  for (const quality of qualities) {
    const buffer = await encodeWebp(page, png, { width, height, quality });
    best = { buffer, quality, width, height, bytes: buffer.length, overBudget: buffer.length > maxBytes };
    if (!best.overBudget) break;
  }
  return best;
}

// Text that must never appear in a published screenshot: e-mail addresses, national ids,
// tokens, credentials or internal addresses. Masked values (with * or •) do not match.
export const SENSITIVE_PATTERNS = {
  email: '[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}',
  nationalId: '\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b|\\b\\d{11}\\b',
  jwt: '\\beyJ[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}',
  bearer: '\\b(?:Bearer|Basic)\\s+[A-Za-z0-9._~+/=-]{12,}',
  secretKey: '\\b(?:sk|pk|ghp|gho|ghs|github_pat|xox[abp])[-_][A-Za-z0-9_-]{10,}',
  internalUrl: '\\b(?:https?://)?(?:localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|10\\.\\d+\\.\\d+\\.\\d+|192\\.168\\.\\d+\\.\\d+|[a-z0-9-]+\\.(?:internal|local|corp|lan))(?::\\d+)?\\b',
};

// Findings inside the viewport (what the image shows) are `visible`; the rest of the document is
// reported too, so a page that carries such text anywhere is reviewed before it is used again.
export async function scanForSensitive(page) {
  return page.evaluate(patterns => {
    const inView = rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
    const shown = element => { for (let e = element; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false; } return true; };
    const visibleParts = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue.trim() || !node.parentElement || !shown(node.parentElement)) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      if ([...range.getClientRects()].some(inView)) visibleParts.push(node.nodeValue);
    }
    const fields = [...document.querySelectorAll('input, textarea')];
    visibleParts.push(...fields.filter(field => shown(field) && inView(field.getBoundingClientRect())).map(field => field.value));
    const documentText = [document.body.innerText, document.title, ...fields.map(field => field.value)].join('\n');
    const visibleText = visibleParts.join('\n');
    const findings = [];
    for (const [kind, source] of Object.entries(patterns)) {
      const seen = new Set([...visibleText.matchAll(new RegExp(source, 'g'))].map(match => match[0]));
      for (const value of seen) findings.push({ kind, visible: true, sample: value.slice(0, 6) + '…' });
      for (const match of documentText.matchAll(new RegExp(source, 'g'))) if (!seen.has(match[0])) findings.push({ kind, visible: false, sample: match[0].slice(0, 6) + '…' });
    }
    return findings;
  }, SENSITIVE_PATTERNS);
}

// Stable frame: no toasts, carets, scrollbars or running animations; fonts loaded; nothing busy.
export const CAPTURE_CSS = `
*,*::before,*::after{caret-color:transparent!important;animation-duration:0s!important;animation-delay:0s!important;transition:none!important}
[data-sonner-toaster],[data-sonner-toast],[role="region"][aria-label*="otification"],.toaster{display:none!important}
html{scrollbar-width:none}::-webkit-scrollbar{display:none}`;

export async function settle(page, { timeout = 15000, css = '' } = {}) {
  await page.addStyleTag({ content: CAPTURE_CSS + css });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"], [data-loading="true"], .animate-pulse'), null, { timeout });
  await page.mouse.move(1, 1);
  await page.waitForTimeout(250);
}

// Visible error or empty states are reported for review instead of being published silently.
export async function visibleStates(page, phrases) {
  return page.evaluate(list => {
    const visible = element => { const r = element.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(element).visibility !== 'hidden'; };
    const alerts = [...document.querySelectorAll('[role="alert"]')].filter(visible).map(element => element.innerText.trim()).filter(Boolean);
    const text = document.body.innerText;
    return { alerts, phrases: list.filter(phrase => phrase && text.includes(phrase)) };
  }, phrases);
}

// Element boxes as fractions of the captured frame, for numbered hotspots placed over the image.
export async function boxes(page, targets, frame) {
  const result = {};
  const { x: left, y: top, width, height } = frame ?? { x: 0, y: 0, ...page.viewportSize() };
  for (const [key, target] of Object.entries(targets)) {
    const locator = typeof target === 'function' ? target(page) : page.locator(target);
    const box = await locator.first().boundingBox().catch(() => null);
    if (!box || box.y - top >= height || box.y + box.height <= top) continue;
    const round = value => Math.round(value * 10000) / 10000;
    result[key] = { x: round((box.x - left) / width), y: round(Math.max(0, box.y - top) / height), w: round(box.width / width), h: round(box.height / height) };
  }
  return result;
}

// Hides (never rewrites) every element whose text contains one of the given strings: the closest table
// row, list item or definition term/description, or the element itself. Returns how many were hidden.
export async function hideText(page, texts) {
  return page.evaluate(list => {
    const nodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let hidden = 0;
    for (const node of nodes) {
      if (!node.parentElement || !list.some(text => node.nodeValue.includes(text))) continue;
      const target = node.parentElement.closest('tr, li, [role="row"], dt, dd') || node.parentElement;
      // A term and its description go together: hiding one hides its pair.
      const pair = target.tagName === 'DD' ? target.previousElementSibling : target.tagName === 'DT' ? target.nextElementSibling : null;
      for (const element of [target, pair]) if (element && element.style.visibility !== 'hidden') { element.style.visibility = 'hidden'; hidden++; }
    }
    return hidden;
  }, texts);
}

// The one badge of every product image, drawn into the capture itself (bottom right), so the file carries it
// wherever it is used. Placeholders carry their own "Screenshot pending" label instead.
export const STAMP = 'PRODUCT UI · SYNTHETIC DATA';
export async function stamp(page, { small = false } = {}) {
  await page.evaluate(({ text, small }) => {
    const el = document.createElement('div');
    el.setAttribute('data-capture-stamp', '');
    el.textContent = text;
    Object.assign(el.style, { position: 'fixed', right: small ? '10px' : '18px', bottom: small ? '10px' : '16px', zIndex: '2147483647', pointerEvents: 'none',
      font: `700 ${small ? 9 : 11}px/1 system-ui, sans-serif`, letterSpacing: '.12em', color: '#7ff1e6', background: 'rgba(5,32,43,.94)',
      border: '1px solid #2a8d99', borderRadius: '999px', padding: small ? '6px 9px' : '7px 12px', boxShadow: '0 4px 16px rgba(0,0,0,.45)' });
    document.body.append(el);
  }, { text: STAMP, small });
}

// Numbered markers on measured parts of the page (the Player 360 parts described on the website).
export async function drawMarkers(page, targets) {
  const placed = [];
  let n = 0;
  for (const [key, target] of Object.entries(targets)) {
    n++;
    const locator = typeof target === 'function' ? target(page) : page.locator(target);
    const box = await locator.first().boundingBox().catch(() => null);
    if (!box) continue;
    await page.evaluate(({ n, x, y }) => {
      const el = document.createElement('div');
      el.setAttribute('data-capture-marker', String(n));
      el.textContent = String(n);
      Object.assign(el.style, { position: 'fixed', left: `${x}px`, top: `${y}px`, width: '30px', height: '30px', zIndex: '2147483646', pointerEvents: 'none',
        display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#21dfd2', color: '#03262b', font: '700 15px/1 system-ui, sans-serif',
        border: '3px solid #03262b', boxShadow: '0 0 0 2px rgba(33,223,210,.55), 0 0 18px rgba(33,223,210,.6)' });
      document.body.append(el);
    }, { n, x: Math.max(4, box.x + 6), y: Math.max(4, box.y + 6) });
    placed.push(key);
  }
  return placed;
}
