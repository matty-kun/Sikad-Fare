// ⚙️ Versioning your cache helps invalidate old assets automatically
const CACHE_NAME = 'sikad-fare-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ✅ Install event: cache essential assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing new version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ✅ Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating new version...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients for version', CACHE_NAME);
      return self.clients.claim();
    })
  );
});

// ✅ Fetch event: serve from cache first, then network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache immediately
          return cachedResponse;
        }

        // Fetch from network if not cached
        return fetch(event.request)
          .then(networkResponse => {
            // Cache the new response for future use
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));

            return networkResponse;
          })
          .catch(() => {
            // Optional: fallback response when offline
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// ✅ Optional: notify clients when new SW is installed
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
