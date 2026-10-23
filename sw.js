// Offline-Speicher der Kasse. Bei jeder Änderung an den Dateien VERSION hochzählen.
const VERSION = "kasse-v2";
const FILES = ["./", "index.html", "manifest.webmanifest", "xlsx.full.min.js",
  "barlow-latin-400-normal.woff2", "barlow-latin-500-normal.woff2", "barlow-latin-600-normal.woff2",
  "barlow-condensed-latin-600-normal.woff2", "barlow-condensed-latin-700-normal.woff2",
  "logo.png", "logo-bon.png", "icon-180.png", "icon-192.png", "icon-512.png", "icon-512-maskable.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).catch(() => caches.match("index.html"))));
});
