const VERSION='vale-book-0.7.2';
const ROOT=new URL('./',self.location.href);
const FILES=['./','index.html','style.css','app.js','core.js','avatar.js','english-data.js','english-core.js','english.js','updates.js','book.js','book.json','icon.svg','icon-180.png','icon-192.png','icon-512.png','manifest.webmanifest',...['14','16','17','19','21','23','25','27','29','30','32'].map(s=>'assets/photo_2026-11-08 10.41.'+s+'.jpeg')];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(FILES.map(x=>new URL(x,ROOT).href)))));
// No forced activation on install: an active/paused learning session keeps its version.
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// Keep previous version caches: do not remove resources of a paused session here.
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==ROOT.origin)return;
 event.respondWith(caches.open(VERSION).then(async cache=>{
  const cached=await cache.match(event.request);
  if(cached)return cached;
  try{return await fetch(event.request);}catch(error){
   if(event.request.mode==='navigate')return (await cache.match(new URL('index.html',ROOT).href))||Response.error();
   return Response.error();
  }
 }));
});
