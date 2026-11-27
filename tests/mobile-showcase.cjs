// Phone regression (iPhone/Android widths): the hero shows one dashboard at a time with swipe and dot
// navigation, and the product tour shows one area (and at most one image, its capture) at a time, inside the screen.
// Chromium emulation verifies layout; this does not claim a physical Safari test.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
// A file that still matches its registered placeholder is not a capture (the page never shows it).
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,'..','tools/capture/placeholders.json'),'utf8')).files;
const isCapture=rel=>fs.existsSync(path.join(__dirname,'..',rel))&&crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',rel))).digest('hex')!==registry[rel];
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
      return {visible:selected.length,index:panels.indexOf(selected[0]),clipped:r?{left:r.left-stage.left,right:stage.right-r.right,top:r.top-stage.top,bottom:stage.bottom-r.bottom}:null,overflow:document.documentElement.scrollWidth-innerWidth,header:document.querySelector('.screen-name')?.textContent};
    });
    let first=await inspect();
    assert.equal(first.visible,1,'one screen visible: '+width+'/'+lang);
    assert.equal(first.index,0,'initial first screen '+width+'/'+lang);
    assert.ok(Object.values(first.clipped).every(v=>v>=-1),'screen boundaries '+width+'/'+lang);
    assert.equal(first.overflow,0,'horizontal scroll '+width+'/'+lang);
    const pause=await page.locator('#motion-toggle').boundingBox();
    assert.ok(pause && pause.x>=0 && pause.x+pause.width<=width,'pause control inside the screen '+width+'/'+lang);
    if([390,430].includes(width))await page.locator('#home').screenshot({path:out+'/'+lang+'-mobile-hero-'+width+'.png'});
    await page.locator('[data-showcase="2"]').click();
    const clicked=await inspect();
    assert.equal(clicked.visible,1);
    assert.equal(clicked.index,2,'dot selects only requested screen');
    // Tour: the tabs wrap inside the screen; one area and its visual at a time; switching keeps that rule.
    const tour=await page.evaluate(()=>({tabs:[...document.querySelectorAll('#platform [role="tab"]')].map(t=>{const r=t.getBoundingClientRect();return {left:r.left,right:r.right}}),shown:[...document.querySelectorAll('#platform [role="tabpanel"]')].filter(p=>p.getBoundingClientRect().height>0).length}));
    assert.ok(tour.tabs.every(t=>t.left>=0&&t.right<=width+.5),'tour tabs inside the screen '+width+'/'+lang);
    assert.equal(tour.shown,1,'one tour area at a time '+width+'/'+lang);
    await page.locator('#tour-tab-alerts').click();
    // The area shows its capture when one exists (the phone capture on phones), otherwise its text and screen list.
    const shot=await page.locator('#tour-alerts img').count()>0;
    assert.equal(shot,isCapture('assets/product/sentinel-alerts.webp'),'the alerts area shows its image exactly when its capture exists '+width+'/'+lang);
    if(shot){await page.locator('#tour-alerts img').scrollIntoViewIfNeeded();await page.locator('#tour-alerts img').evaluate(img=>img.decode());}
    const switched=await page.evaluate(()=>({shown:[...document.querySelectorAll('#platform [role="tabpanel"]')].filter(p=>p.getBoundingClientRect().height>0).map(p=>p.id),images:[...document.querySelectorAll('#platform img')].filter(i=>i.getBoundingClientRect().height>0).map(i=>({src:i.currentSrc.split('/').pop(),width:i.getBoundingClientRect().width})),overflow:document.documentElement.scrollWidth-innerWidth}));
    assert.deepEqual(switched.shown,['tour-alerts'],'switching areas '+width+'/'+lang);
    if(shot){
      const phone=isCapture('assets/product/sentinel-alerts-mobile.webp');
      assert.deepEqual(switched.images.map(i=>i.src),[phone?'sentinel-alerts-mobile.webp':'sentinel-alerts.webp'],'one image at a time, the phone capture on phones when it exists '+width+'/'+lang);
      if(phone)assert.ok(switched.images[0].width<=300.5,'phone capture shown at phone size '+width+'/'+lang);
    }else{
      assert.deepEqual(switched.images,[],'no image where the capture is missing '+width+'/'+lang);
      assert.ok(await page.locator('#tour-alerts .rhs-screens').isVisible(),'the area keeps its list of screens '+width+'/'+lang);
    }
    assert.equal(switched.overflow,0,'no horizontal scroll after switching '+width+'/'+lang);
    if([390,430].includes(width))await page.locator('#platform').screenshot({path:out+'/'+lang+'-mobile-tour-'+width+'.png'});
    assert.deepEqual(errors,[],'browser errors '+width+'/'+lang);
    await page.close();
    return {lang,width,first,clicked,tour:switched,errors};
  })));
  fs.writeFileSync(out+'/mobile-showcase.json',JSON.stringify(reports,null,2));
  console.log('PASS: mobile single hero screen with pause control, tour one area and at most one image (the phone capture) at a time, no overflow; 8 EN/ES cases');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
