'use strict';
const PREFIX='edunova-v24-career-pwa-'+self.registration.scope+'-';
const CACHE=PREFIX+'5';
const FILES=["./", "./index.html", "./style.css?v=4", "./content.js?v=4", "./repository.js?v=4", "./app.js?v=4", "./manifest.json", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./assets/academy_study_cover.webp", "./assets/answer_correct.wav", "./assets/answer_incorrect.wav", "./assets/portrait_01.webp", "./assets/portrait_02.webp", "./assets/portrait_03.webp", "./assets/portrait_04.webp", "./assets/portrait_05.webp", "./assets/portrait_06.webp", "./assets/portrait_07.webp", "./assets/portrait_08.webp", "./assets/portrait_09.webp", "./assets/portrait_10.webp", "./assets/portrait_11.webp", "./assets/portrait_12.webp", "./assets/portrait_13.webp", "./assets/portrait_14.webp", "./assets/portrait_15.webp", "./assets/portrait_16.webp"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(path,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;

  const manifest = new URL('./manifest.json', self.registration.scope);
  // Each Website Studio publish can change the manifest without changing this worker.
  if (url.href === manifest.href) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request, {cache: 'no-store'});
        if (response.ok) {
          await cache.put(manifest, response.clone()).catch(() => {});
          return response;
        }
        return (await cache.match(manifest)) || response;
      } catch {
        return (await cache.match(manifest)) || Response.error();
      }
    })());
    return;
  }
  if (request.mode === 'navigate') {
    const index = new URL('./index.html', self.registration.scope);
    event.respondWith(fetch(request).catch(() => caches.match(index)));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache =>
    (await cache.match(request)) || fetch(request)
  ));
});
