// لما تعدّل أي حاجة في الموقع، غيّر رقم النسخة هنا عشان التحديث يوصل للناس
const VERSION = 'khatma-v1';
// آيات المصحف اللي اتفتحت قبل كده بتتحفظ هنا، وما بتتمسحش مع التحديثات
const QURAN_CACHE = 'quran-text-v1';
const FILES = [
  './',
  './index.html',
  './quran.js',
  './quran.css',
  './manifest.webmanifest',
  './fonts/amiri-400.woff2',
  './fonts/amiri-700.woff2',
  './fonts/amiri-quran.woff2',
  './fonts/plex-400.woff2',
  './fonts/plex-500.woff2',
  './fonts/plex-600.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== QURAN_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // نص المصحف: من المحفوظ لو موجود، ولو لأ من النت ونحفظه
  if (url.hostname === 'api.alquran.cloud') {
    e.respondWith(
      caches.open(QURAN_CACHE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) c.put(req, res.clone());
        return res;
      })))
    );
    return;
  }

  if (url.origin !== location.origin) return;
  // الختمة المشتركة: دايمًا من النت
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/mp3q/')) return;

  // الصفحة والملفات اللي بتتغير: من النت أولًا، ولو مفيش نت من النسخة المحفوظة
  const fresh = req.mode === 'navigate' || /\/(index\.html|quran\.js|quran\.css)?$/.test(url.pathname);
  if (fresh) {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html')))
    );
  } else {
    // الخطوط والصور: من المحفوظ أولًا (أسرع)
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  }
});
