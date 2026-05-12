const CACHE_NAME = 'rpgboxd-v1.0.4';

const urlsToCache = [
  '/',
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
  console.log('SW: Instalando versao', CACHE_NAME);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cacheando arquivos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('SW: Instalacao concluida!');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('SW: Erro ao cachear arquivos:', error);
      })
  );
});

// ATIVAÇÃO

self.addEventListener('activate', (event) => {
  console.log('SW: Ativando versao', CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('SW: Cache limpo e ativado!');
      return self.clients.claim();
    })
  );
});

// FETCH (BUSCA)
// Estratégia: Cache First com fallback

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') return;

  // Ignora requisições para o Chrome DevTools e extensões
  if (url.protocol === 'chrome-extension:' || url.protocol === 'chrome-devtools:') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se encontrou no cache, retorna do cache
        if (cachedResponse) {
          console.log('SW: Cache hit -', event.request.url);
          return cachedResponse;
        }

        // Se não está no cache, busca na rede
        console.log('SW: Cache miss - buscando na rede:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Verifica se a resposta é válida
            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type !== 'basic'
            ) {
              return networkResponse;
            }

            // Clona a resposta para salvar no cache
            const responseClone = networkResponse.clone();

            // Salva no cache para próxima vez
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.log('SW: Offline - erro na rede:', error);
            
            // Fallback offline para navegação (páginas HTML)
            if (event.request.mode === 'navigate') {
              console.log('SW: Retornando index.html offline');
              return caches.match('./index.html');
            }
            
            // Fallback para imagens offline
            if (event.request.destination === 'image') {
              console.log('SW: Retornando icone padrao offline');
              return caches.match('./source/icons/192x192.png');
            }
            
            // Fallback genérico
            return new Response('Conteúdo não disponível offline', {
              status: 404,
              statusText: 'Not Found',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});