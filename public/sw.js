// Service Worker for CashTrack PWA
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Keeps the app engine responsive
});
