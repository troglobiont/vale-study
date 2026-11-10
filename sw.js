const VERSION='vale-book-0.14.1';
const ROOT=new URL('./',self.location.href);
const FILES=['testing-core.js','expedition-data.js','expedition-map.js','expedition-core.js','expedition-ui.js','assets/expedition/desk.png','assets/nature/animal-crossword.jpg',"assets/nature/animals.jpg","assets/nature/belgrade.jpg","assets/nature/borders.jpg","assets/nature/cities-map.jpg","assets/nature/coats.jpg","assets/nature/conditions.jpg","assets/nature/dumps.jpg","assets/nature/energy-pictures.jpg","assets/nature/europe.jpg","assets/nature/final-map.jpg","assets/nature/flowers.jpg","assets/nature/gracanica.jpg","assets/nature/neighbours.jpg","assets/nature/parks-map.jpg","assets/nature/plant-return.jpg","assets/nature/pollution.jpg","assets/nature/pottery.jpg","assets/nature/puzzle-grid.jpg","assets/nature/relief-map.jpg","assets/nature/relief.jpg","assets/nature/resources-grid.jpg","assets/nature/rivers.jpg","assets/nature/settlements.jpg","assets/nature/soil-jar.jpg","assets/nature/spruce.jpg","assets/nature/subotica-rebus.jpg","assets/nature/tara-sign.jpg","assets/nature/tesla-rebus.jpg","assets/nature/trees-bottom.jpg","assets/nature/trees-top.jpg","assets/nature/villages.jpg","assets/nature/wind-rose.jpg","assets/nature/windsock.jpg",'./','index.html','style.css','app.js','nature-data.js','nature-core.js','nature-ui.js','math-test-core.js','math-test-ui.js','garden-core.js','garden-ui.js','core.js','avatar.js','english-data.js','english-practice.js','english-practice-ui.js','english-core.js','english.js','updates.js','book.js','book.json','icon.svg','icon-180.png','icon-192.png','icon-512.png','manifest.webmanifest',...['14','16','17','19','21','23','25','27','29','30','32'].map(s=>'assets/photo_2026-11-08 10.41.'+s+'.jpeg')];
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
