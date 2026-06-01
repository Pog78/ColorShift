const CACHE_NAME = 'color-shift-v2'; // Bumped to v2 to force the browser to update
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',           // Explicitly cache the manifest
    './assets/app-icon.png',     // Explicitly cache the app icon
    './favicon.ico',             // Explicitly cache the fallback favicon (if you added one)
    // Cache the confetti library so winning works offline!
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js' 
];

// Install the service worker and cache the files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Clean up old caches when the new service worker activates
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercept network requests and serve from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached version if found, otherwise fetch from the network
                return response || fetch(event.request);
            })
    );
});
