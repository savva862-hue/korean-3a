const CACHE_NAME = 'study-3a-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './audio/d1_0_yeo.mp3',
  './audio/d1_1_nam.mp3',
  './audio/d1_2_yeo.mp3',
  './audio/d1_3_nam.mp3',
  './audio/d1_4_yeo.mp3',
  './audio/d1_5_nam.mp3',
  './audio/d2_0_nam.mp3',
  './audio/d2_1_yeo.mp3',
  './audio/d2_2_nam.mp3',
  './audio/d2_3_yeo.mp3',
  './audio/d2_4_nam.mp3',
  './audio/d2_5_yeo.mp3',
  './audio/d3_0_yeo.mp3',
  './audio/d3_1_nam.mp3',
  './audio/d3_2_yeo.mp3',
  './audio/d3_3_nam.mp3',
  './audio/d3_4_yeo.mp3',
  './audio/d3_5_nam.mp3',
  './audio/d4_0_nam.mp3',
  './audio/d4_1_yeo.mp3',
  './audio/d4_2_nam.mp3',
  './audio/d4_3_yeo.mp3',
  './audio/d4_4_nam.mp3',
  './audio/d4_5_yeo.mp3',
  './audio/d5_0_yeo.mp3',
  './audio/d5_1_nam.mp3',
  './audio/d5_2_yeo.mp3',
  './audio/d5_3_nam.mp3',
  './audio/d5_4_yeo.mp3',
  './audio/d5_5_nam.mp3',
  './audio/d6_0_nam.mp3',
  './audio/d6_1_yeo.mp3',
  './audio/d6_2_nam.mp3',
  './audio/d6_3_yeo.mp3',
  './audio/d6_4_nam.mp3',
  './audio/d6_5_yeo.mp3',
  './audio/d7_0_yeo.mp3',
  './audio/d7_1_nam.mp3',
  './audio/d7_2_yeo.mp3',
  './audio/d7_3_nam.mp3',
  './audio/d7_4_yeo.mp3',
  './audio/d7_5_nam.mp3',
  './audio/d8_0_nam.mp3',
  './audio/d8_1_yeo.mp3',
  './audio/d8_2_nam.mp3',
  './audio/d8_3_yeo.mp3',
  './audio/d8_4_nam.mp3',
  './audio/d8_5_yeo.mp3',
  './audio/d9_0_yeo.mp3',
  './audio/d9_1_nam.mp3',
  './audio/d9_2_yeo.mp3',
  './audio/d9_3_nam.mp3',
  './audio/d9_4_yeo.mp3',
  './audio/d9_5_nam.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }
  // Network-first for HTML/JSON, cache-first for audio (audio never changes once generated)
  const isAudio = url.pathname.endsWith('.mp3');
  if (isAudio) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
