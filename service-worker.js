const CACHE_KEY = "rong-liquor-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./drops.html",
  "./vibes.html",
  "./about.html",
  "./cart.html",
  "./styles/main.css",
  "./scripts/data.js",
  "./scripts/main.js",
  "./assets/logo.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_KEY).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force activate new service worker immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === CACHE_KEY ? null : caches.delete(key))))
    )
  );
  return self.clients.claim(); // Take control of all pages immediately
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) =>
        response ||
        fetch(event.request).catch(() => caches.match("./index.html"))
    )
  );
});

