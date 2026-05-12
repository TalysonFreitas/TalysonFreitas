const CACHE_NAME = 'rpgboxd-v1.0.6';

const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/script.js',
  './manifest.json',
  './hexatombe.jpg',

  './source/icons/48x48.png',
  './source/icons/72x72.png',
  './source/icons/96x96.png',
  './source/icons/144x144.png',
  './source/icons/192x192.png',
  './source/icons/512x512.png'
];

// INSTALAÇÃO
self.addEventListener('install', (event) => {
  console.log('SW instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando arquivos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ATIVAÇÃO
self.addEventListener('activate', (event) => {
  console.log('SW ativado');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH
self.addEventListener('fetch', (event) => {

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {

        // CACHE
        if (response) {
          return response;
        }

        // REDE
        return fetch(event.request)
          .then((networkResponse) => {

            // salva novo cache
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });

            return networkResponse;
          })

          // OFFLINE
          .catch(() => {

            // fallback HTML
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            // fallback imagem
            if (event.request.destination === 'image') {
              return caches.match('./source/icons/192x192.png');
            }
          });
      })
  );
});