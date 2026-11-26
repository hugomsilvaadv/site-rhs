const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const{spawnSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const result=spawnSync(process.execPath,['tools/stage.mjs'],{cwd:root,env:{...process.env,PUBLIC_SITE_ORIGIN:'https://example.test'},encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
for(const p of ['docs','tools','tests','.agents','.github','assets/hero-v6-fragment.html'])assert.equal(fs.existsSync(path.join(root,'public',p)),false,p);
const sitemap=fs.readFileSync(path.join(root,'public/sitemap.xml'),'utf8');
assert.ok(sitemap.includes('https://example.test/es/'));assert.ok(sitemap.includes('https://example.test/'));
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');assert.ok(html.includes('rel="canonical" href="https://example.test/"'));assert.ok(html.includes('property="og:image" content="https://example.test/assets/og-image-en.jpg"'));assert.ok(html.includes('name="twitter:image" content="https://example.test/assets/og-image-en.jpg"'));
const es=fs.readFileSync(path.join(root,'public/es/index.html'),'utf8');assert.ok(es.includes('property="og:image" content="https://example.test/assets/og-image-es.jpg"'));
// Open Graph images: JPEG, 1200x630 (dimensions from the start-of-frame marker).
const jpegSize=b=>{assert.equal(b.readUInt16BE(0),0xffd8,'JPEG');for(let i=2;i<b.length;){const m=b.readUInt16BE(i),len=b.readUInt16BE(i+2);if(m>=0xffc0&&m<=0xffcf&&![0xffc4,0xffc8,0xffcc].includes(m))return [b.readUInt16BE(i+7),b.readUInt16BE(i+5)];i+=2+len;}};
for(const lang of ['en','es']){const jpg=fs.readFileSync(path.join(root,'public/assets/og-image-'+lang+'.jpg'));assert.deepEqual(jpegSize(jpg),[1200,630],'Open Graph image is 1200x630');assert.ok(jpg.length<250*1024,'Open Graph image under 250 KB');}
const bad=spawnSync(process.execPath,['tools/stage.mjs'],{cwd:root,env:{...process.env,PUBLIC_SITE_ORIGIN:'http://localhost:8000/path'},encoding:'utf8'});assert.notEqual(bad.status,0,'invalid production origin is rejected');
console.log('PASS: deployment allowlist, sitemap, absolute metadata and invalid-origin guard');
