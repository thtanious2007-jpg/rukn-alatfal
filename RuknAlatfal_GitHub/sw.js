/* رُكن الأطفال — service worker for safe offline use */
const CACHE_PREFIX = 'rukn-alatfal-pwa-';
const CACHE_NAME = CACHE_PREFIX + 'v8';
const BASE = self.registration.scope;
const APP_URL = new URL('index.html', BASE).href;
const CORE_URLS = [
  new URL('./', BASE).href,
  APP_URL,
  new URL('manifest.webmanifest', BASE).href,
  new URL('icons/icon-192.png', BASE).href,
  new URL('icons/icon-512.png', BASE).href,
  new URL('icons/icon-maskable-512.png', BASE).href,
  new URL('icons/apple-touch-icon.png', BASE).href,
  new URL('favicon.ico', BASE).href,
  new URL('fonts/cairo-arabic-600-normal.woff2', BASE).href,
  new URL('fonts/cairo-arabic-700-normal.woff2', BASE).href,
  new URL('fonts/cairo-arabic-900-normal.woff2', BASE).href,
  new URL('fonts/amiri-arabic-700-normal.woff2', BASE).href
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_URLS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(async () => (await caches.match(request, { ignoreSearch: true })) || (await caches.match(APP_URL)) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response && response.ok && url.origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    });
  }));
});
