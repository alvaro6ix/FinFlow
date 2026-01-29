const CACHE_NAME = 'finflow-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  // Omitir peticiones de Firebase/Firestore para que el SDK de Firebase maneje su propio modo offline
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('firebaseinstallations.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Si falla la red y no está en caché, devolvemos el index.html para SPA
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});