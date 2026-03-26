/* ============================================================
   Service Worker – The Lap PWA
   يخزن الملفات الأساسية للعمل أوف لاين
   ============================================================ */

const CACHE_NAME = 'the-lap-v1';

/* الملفات التي يتم تخزينها عند التثبيت */
const ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap'
];

/* ---- تثبيت: تخزين الملفات الأساسية ---- */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ---- تفعيل: حذف الكاش القديم ---- */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ---- الطلبات: Cache First للملفات المحلية، Network Only لـ API ---- */
self.addEventListener('fetch', e => {
  const url = e.request.url;

  /* طلبات Google Apps Script تمر مباشرة (لا تُخزن) */
  if (url.includes('script.google.com') || url.includes('fonts.g')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
