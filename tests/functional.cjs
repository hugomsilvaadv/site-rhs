// Removing language controls, the tour tabs, the pause control or mobile-menu behavior must fail these tests.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const site = process.env.SITE_URL || 'http://127.0.0.1:8000/';
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const page = await browser.newPage({viewport:{width:390,height:844}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(site,{waitUntil:'networkidle'});
 assert.ok(await page.locator('[data-language="es"]').count(),'Spanish control is present');
 await page.locator('#menu-toggle').click();
 await page.locator('#main-nav [data-language="es"]').click();
 await page.waitForURL(/\/es\/$/);
 assert.equal(await page.locator('html').getAttribute('lang'),'es');
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('html').getAttribute('lang'),'es','language persists');
 await page.goto(site,{waitUntil:'networkidle'});
 await page.waitForURL(/\/es\/$/);await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('html').getAttribute('lang'),'es','the root restores the stored language');
 await page.goto(site+'?lang=en',{waitUntil:'networkidle'});
 assert.equal(await page.locator('html').getAttribute('lang'),'en','an explicit language wins');
 // Mobile menu: open, Escape closes and returns focus; labels come from the page.
 const toggle=page.locator('#menu-toggle');
 await toggle.click();
 assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert.equal(await toggle.getAttribute('aria-label'),'Close navigation');
 await page.keyboard.press('Escape');
 assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await toggle.getAttribute('aria-label'),'Open navigation');
 assert.ok(await toggle.evaluate(el=>document.activeElement===el),'focus returns to the menu button');
 assert.deepEqual(await page.locator('#main-nav > a').evaluateAll(els=>els.map(a=>a.hash).filter(h=>!document.getElementById(h.slice(1)))),[],'menu anchors exist');
 // Tour: click each area; exactly one panel visible and labelled by its tab.
 const tabs=page.locator('#platform [role="tab"]');
 for(let i=0;i<await tabs.count();i++){
  await tabs.nth(i).click();
  const state=await page.evaluate(()=>[...document.querySelectorAll('#platform [role="tabpanel"]')].map(p=>({hidden:p.hidden,label:p.getAttribute('aria-labelledby'),visible:p.getBoundingClientRect().height>0})));
  assert.deepEqual(state.map(s=>s.hidden),state.map((_,n)=>n!==i),'one panel per click');
  assert.ok(state[i].visible,'selected panel is visible');
  assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true');
  assert.equal(await tabs.nth(i).getAttribute('tabindex'),'0');
  assert.equal(state[i].label,await tabs.nth(i).getAttribute('id'));
 }
 assert.match(page.url(),/#tour-customers$/,'the selected area is in the address');
 // Keyboard: arrows, Home and End move the selection and the focus (automatic activation).
 await tabs.first().focus();
 await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.id),'tour-tab-connections');
 assert.equal(await page.locator('#tour-connections').isVisible(),true);
 await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>document.activeElement.id),'tour-tab-customers','wraps around');
 await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.id),'tour-tab-transactions');
 await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.id),'tour-tab-customers');
 assert.equal(await page.locator('#platform [role="tab"][tabindex="0"]').count(),1,'roving tabindex');
 // Deep links: a #tour-<area> address opens that area, on load and when the address changes.
 await page.evaluate(()=>{location.hash='#tour-rules';});
 await page.waitForFunction(()=>!document.getElementById('tour-rules').hidden);
 assert.equal(await page.locator('#tour-tab-rules').getAttribute('aria-selected'),'true','a #tour link opens its area');
 const fresh=await browser.newPage({viewport:{width:1280,height:900}});
 await fresh.goto(site+'#tour-alerts',{waitUntil:'networkidle'});
 assert.equal(await fresh.locator('#tour-alerts').isVisible(),true,'a shared #tour link opens that area on load');
 assert.equal(await fresh.locator('#tour-tab-alerts').getAttribute('aria-selected'),'true');
 // The module cards lead to Sentinel (available) or to the back-office in development.
 assert.deepEqual(await fresh.locator('#modules .rhs-card-link').evaluateAll(els=>els.map(a=>a.hash).filter(h=>!document.getElementById(h.slice(1)))),[],'module links have targets');
 await fresh.close();
 // Contact and pause control.
 assert.ok(await page.locator('a[href^="mailto:sales@rhs-labs.com"]').count());
 assert.equal(await page.locator('input,form').count(),0,'no simulated lead collection');
 const motion=page.locator('#motion-toggle');
 await motion.scrollIntoViewIfNeeded();await motion.click();
 assert.equal(await motion.getAttribute('aria-pressed'),'true');assert.equal(await motion.innerText(),'Resume motion');
 assert.equal(await page.locator('.backlight').evaluate(el=>getComputedStyle(el).animationPlayState),'paused','pause includes CSS backlight');
 const frozen=await page.locator('.product-screen').first().getAttribute('style');await page.waitForTimeout(400);
 assert.equal(await page.locator('.product-screen').first().getAttribute('style'),frozen,'the orbit stops');
 await motion.click();assert.equal(await motion.getAttribute('aria-pressed'),'false');
 // Spanish strings come from the Spanish page.
 await page.goto(site+'es/',{waitUntil:'networkidle'});
 assert.equal(await page.locator('#motion-toggle').innerText(),'Pausar movimiento');
 await page.locator('#tour-tab-alerts').click();assert.equal(await page.locator('#tour-alerts').isVisible(),true);
 assert.deepEqual(errors,[]);
 await page.emulateMedia({reducedMotion:'reduce'}); await page.reload({waitUntil:'networkidle'});
 const before=await page.locator('.product-screen').first().getAttribute('style');
 await page.waitForTimeout(500);
 assert.equal(await page.locator('.product-screen').first().getAttribute('style'),before,'reduced motion is static');
 console.log('PASS: language persistence, mobile menu, tour tabs (click, keyboard, deep links), contact, pause control, console and reduced motion');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
