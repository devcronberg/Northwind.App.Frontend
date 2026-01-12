// Minimal Service Worker for PWA installation
// No caching or offline functionality

self.addEventListener('install', () => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // No caching - just pass through to network
    event.respondWith(fetch(event.request));
});
