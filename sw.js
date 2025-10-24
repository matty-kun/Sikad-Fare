// ⚙️ Versioning your cache helps invalidate old assets automatically
const CACHE_NAME = 'sikad-fare-v3';
const TILE_CACHE_NAME = 'sikad-fare-tiles-v1'; // Separate cache for tiles
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
          // Delete old app caches and all tile caches to refresh
          if (cacheName !== CACHE_NAME && cacheName !== TILE_CACHE_NAME) {
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
  const requestUrl = new URL(event.request.url);

  // Handle map tiles with a stale-while-revalidate strategy
  if (requestUrl.pathname.startsWith('/Tiles/')) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          // Return cached response immediately, while revalidating in the background
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Handle other requests with a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return networkResponse;
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
