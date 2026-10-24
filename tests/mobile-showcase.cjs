// Mobile showcase regression for one-at-a-time screens (iPhone/Android widths).
// Chromium emulation verifies layout; this does not claim a physical Safari test.
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const out=__dirname+'/../docs/web-studio/visual-qa-current';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const reports=await Promise.all([320,375,390,430].flatMap(width=>['en','es'].map(async lang=>{
    const page=await browser.newPage({viewport:{width,height:900},isMobile:true,hasTouch:true});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
    await page.goto('http://127.0.0.1:8000/'+(lang==='es'?'es/':''),{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const inspect=()=>page.evaluate(()=>{
      const panels=[...document.querySelectorAll('.product-screen')];
      const selected=panels.filter(p=>getComputedStyle(p).visibility==='visible' && +getComputedStyle(p).opacity>.95);
      const stage=document.querySelector('#carousel-track').getBoundingClientRect();
      const r=selected[0]?.getBoundingClientRect();
      return {visible:selected.length,index:panels.indexOf(selected[0]),clipped:r?{left:r.left-stage.left,right:stage.right-r.right,top:r.top-stage.top,bottom:stage.bottom-r.bottom}:null,overflow:document.documentElement.scrollWidth-innerWidth,laptop:getComputedStyle(document.querySelector('.rhs-mobile-laptop')).display,expanded:document.querySelector('.rhs-overview').classList.contains('demo-open'),header:document.querySelector('.screen-name')?.textContent};
    });
    let first=await inspect();
    assert.equal(first.visible,1,'one screen visible: '+width+'/'+lang);
    assert.equal(first.index,0,'initial first screen '+width+'/'+lang);
    assert.ok(Object.values(first.clipped).every(v=>v>=-1),'screen boundaries '+width+'/'+lang);
    assert.equal(first.overflow,0,'horizontal scroll '+width+'/'+lang);
    assert.notEqual(first.laptop,'none','laptop image visible '+width+'/'+lang);
    assert.ok(!first.expanded,'demo collapsed initially '+width+'/'+lang);
    const pic=page.locator('.rhs-mobile-laptop img');
    assert.ok(await pic.evaluate(el=>el.complete && el.naturalWidth>0),'laptop image loaded '+width+'/'+lang);
    if([390,430].includes(width)){
      await page.locator('#home').screenshot({path:out+'/'+lang+'-mobile-hero-'+width+'.png'});
      await page.locator('#platform').screenshot({path:out+'/'+lang+'-mobile-laptop-'+width+'.png'});
    }
    await page.locator('[data-showcase="2"]').click();
    const clicked=await inspect();
    assert.equal(clicked.visible,1);
    assert.equal(clicked.index,2,'dot selects only requested screen');
    await page.locator('.rhs-demo-toggle').click();
    assert.equal(await page.locator('.rhs-demo-toggle').getAttribute('aria-expanded'),'true');
    assert.ok(await page.locator('#workspace').isVisible(),'interactive workspace expanded');
    await page.locator('.rhs-demo-toggle').click();
    assert.ok(!await page.locator('#workspace').isVisible(),'interactive workspace closed');
    assert.deepEqual(errors,[],'browser errors '+width+'/'+lang);
    await page.close();
    return {lang,width,first,clicked,errors};
  })));
  fs.writeFileSync(out+'/mobile-showcase.json',JSON.stringify(reports,null,2));
  console.log('PASS: mobile single screen, 3D collision removed, visible laptop, expand/collapse; 8 EN/ES cases');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
