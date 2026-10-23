// Offline-Speicher der Kasse. Bei jeder Änderung an den Dateien VERSION hochzählen.
const VERSION = "kasse-v8";
const FILES = ["./", "index.html", "manifest.webmanifest", "xlsx.full.min.js", "qrcode.js", "bon.html", "logo.png", "logo-bon.png",
  "barlow-latin-400-normal.woff2", "barlow-latin-500-normal.woff2", "barlow-latin-600-normal.woff2",
  "barlow-condensed-latin-600-normal.woff2", "barlow-condensed-latin-700-normal.woff2",
  "icon-180.png", "icon-192.png", "icon-512.png", "icon-512-maskable.png"];
self.addEventListener("install", e => {
  // cache: "reload" holt die Dateien frisch vom Server statt aus dem Browser-Zwischenspeicher
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    // Seite selbst: mit Internet immer die neueste Version, ohne Internet die gespeicherte
    const url = new URL(e.request.url);
    const key = url.pathname.endsWith("/bon.html") ? "bon.html" : "index.html";
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(key, copy)); }
      return r;
    }).catch(() => caches.match(key)));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
