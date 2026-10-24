const assert=require('node:assert/strict');const fs=require('node:fs');const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
const p=await b.newPage({viewport:{width:1440,height:1100}});await p.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
assert.deepEqual(await p.locator('[data-sector]').evaluateAll(els=>els.map(e=>e.dataset.sector)),['2','3','4','5','6','7','8','9'],'eight ordered lower sectors');
assert.equal(await p.locator('#platform .rhs-notebook').count(),1,'overview uses a notebook frame');
assert.equal(await p.locator('#modules .rhs-product').count(),4);
for(const text of await p.locator('#modules .rhs-product p').allTextContents())assert.ok(text.length<190,'product copy stays concise');
assert.equal(await p.locator('#intelligence [data-edge]').count(),5,'five explicitly labeled graph relationships');
assert.equal(await p.locator('#payments [data-series="deposits"]').count(),1);assert.equal(await p.locator('#payments [data-series="withdrawals"]').count(),1);
assert.equal(await p.locator('#payments .rhs-queue-item').count(),4);
assert.equal(await p.locator('#how .rhs-step').count(),4);assert.equal(await p.locator('#security .rhs-pillar').count(),3);
assert.ok(await p.locator('#company .rhs-flat-brand').count());assert.ok(await p.locator('a[href^="mailto:sales@rhs-labs.com"]').count());
assert.equal(await p.locator('link[rel="canonical"]').getAttribute('href'),'https://rhs-labs.com/');
assert.equal(await p.locator('a[href*="resources"],form').count(),0);
console.log('PASS: sectors, notebook, concise products, semantic graph/payments, flow, pillars, flat mark, sales and canonical');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
