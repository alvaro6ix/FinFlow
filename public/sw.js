const CACHE_NAME = 'finflow-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  // Ignorar peticiones a Firebase para que el SDK maneje el caché de datos
  if (e.request.url.includes('firestore.googleapis.com')) return;

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});