const CACHE_NAME = 'color-shift-v1';
const urlsToCache = [
    './',
    './index.html',
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
