const CACHE_KEY = "rong-liquor-v5";
const CACHE_VERSION = Date.now().toString();

// Network-first strategy - always fetch fresh content
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force activate immediately
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          // Delete all old caches
          return caches.delete(key);
        })
      )
    )
  );
  return self.clients.claim(); // Take control immediately
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // For HTML, CSS, and JS files - always fetch from network first
  if (
    request.method === "GET" &&
    (url.pathname.endsWith(".html") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".js") ||
      url.pathname === "/" ||
      url.pathname.endsWith("/"))
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache in background but serve fresh content
          const responseClone = response.clone();
          caches.open(CACHE_KEY).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Only use cache if network fails
          return caches.match(request).then((response) => {
            return response || caches.match("./index.html");
          });
        })
    );
  } else {
    // For other assets (images, fonts) - network first with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_KEY).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

