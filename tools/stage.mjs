// Stage only public website files; never publish studio docs, tests, Git metadata or tools.
import {cp,mkdir,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'public');
const siteConfig=JSON.parse(await readFile(path.join(root,'site.config.json'),'utf8'));
const supplied=process.env.PUBLIC_SITE_ORIGIN || siteConfig.productionOrigin || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL : '');
let origin='';
if(supplied){
 const url=new URL(supplied);
 if(url.protocol!=='https:' || url.pathname!=='/' || url.search || url.hash || url.username || url.password || url.hostname==='localhost' || url.hostname==='127.0.0.1')throw new Error('PUBLIC_SITE_ORIGIN must be a verified HTTPS origin without a path, query or credentials.');
 origin=url.origin;
}
if(!origin && process.env.VERCEL_ENV==='production')throw new Error('Production needs PUBLIC_SITE_ORIGIN or Vercel-provided VERCEL_PROJECT_PRODUCTION_URL; do not guess the official domain.');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const name of ['index.html','es','site.css','site.js','robots.txt'])await cp(path.join(root,name),path.join(output,name),{recursive:true});
await mkdir(path.join(output,'assets'),{recursive:true});
for(const name of await readdir(path.join(root,'assets'))){
 if(name.endsWith('-fragment.html'))continue;
 await cp(path.join(root,'assets',name),path.join(output,'assets',name),{recursive:true});
}
console.log('Staged public website only in public/. No studio documents or build tools included.');

if(origin){
 for(const rel of ['index.html','es/index.html']){
  const file=path.join(output,rel); let html=await readFile(file,'utf8');
  html=html.replace(/(<link rel="(?:canonical|alternate)"[^>]*href=")(\/[^"]*)"/g,(_,before,route)=>before+origin+route+'"');
  html=html.replace('property="og:image" content="/assets/','property="og:image" content="'+origin+'/assets/');
  html=html.replace('</head>','<meta property="og:url" content="'+origin+(rel.startsWith('es/')?'/es/':'/')+'"></head>');
  await writeFile(file,html);
 }
 const xmlEscape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 const urls=['/','/es/'].map(p=>'<url><loc>'+xmlEscape(origin+p)+'</loc></url>').join('');
 await writeFile(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls+'</urlset>');
 await writeFile(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
 console.log('Generated absolute canonical/hreflang/OG metadata and sitemap from configured origin.');
}else console.log('Local staging only: official origin unverified; sitemap and absolute metadata await deployment configuration.');
