// Removing language controls, workspace views or mobile-menu behavior must fail these tests.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const page = await browser.newPage({viewport:{width:390,height:844}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8000/',{waitUntil:'networkidle'});
 assert.ok(await page.locator('[data-language="es"]').count(),'Spanish control is present');
 await page.locator('[data-language="es"]').last().click();
 assert.equal(await page.locator('html').getAttribute('lang'),'es');
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('html').getAttribute('lang'),'es','language persists');
 await page.locator('[data-language="en"]').last().click();
 await page.locator('#menu-toggle').click();
 assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
 assert.ok(await page.evaluate(()=>{document.querySelector('[data-view="overview"]').click();return document.querySelector('#mock-panel').getAnimations().length>0;}),'workspace transition starts on selection');
 for(const view of ['overview','withdrawal','player','alerts','links','policies','audit']){
  const btn=page.locator(`[data-view="${view}"]`); await btn.click();
  await page.waitForTimeout(250);
  assert.equal(await btn.getAttribute('aria-selected'),'true',view);
  assert.ok((await page.locator('#mock-heading').innerText()).length>0);
 }
 await page.locator('[data-language="es"]').last().click();
 await page.locator('[data-view="player"]').click(); await page.waitForTimeout(250);
 assert.match(await page.locator('#mock-status').innerText(),/ILUSTRATIV|SIMULAD/i);
 assert.equal(await page.locator('a[href^="mailto:sales@rhs-labs.com"]').count()>0,true);
 assert.equal(await page.locator('input,form').count(),0,'no simulated lead collection');
 await page.locator('#motion-toggle').click();
 assert.equal(await page.locator('.backlight').evaluate(el=>getComputedStyle(el).animationPlayState),'paused','pause includes CSS backlight');
 assert.deepEqual(errors,[]);
 await page.emulateMedia({reducedMotion:'reduce'}); await page.reload({waitUntil:'networkidle'});
 const before=await page.locator('.product-screen').first().getAttribute('style');
 await page.waitForTimeout(500);
 assert.equal(await page.locator('.product-screen').first().getAttribute('style'),before,'reduced motion is static');
 console.log('PASS: language persistence, mobile menu, seven workspace views, contact, console and reduced motion');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
