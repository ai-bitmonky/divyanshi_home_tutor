/* TutorForMe service worker — hand-written, no build step.
   cache-first: hashed Next assets, icons, fonts · network-first: page navigations · /offline as last resort */
const VERSION = "tfm-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const PRECACHE = ["/offline", "/icons/icon-192.png", "/icons/apple-touch-icon.png", "/favicon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(PAGES)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isStatic = (url) => url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || /\.(woff2?|ttf|otf)$/.test(url.pathname);

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) caches.open(STATIC).then((c) => c.put(req, res.clone()));
  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const copy = res.clone();
      caches.open(PAGES).then((c) => c.put(req, copy));
    }
    return res;
  } catch {
    return (await caches.match(req, { ignoreSearch: true })) || (await caches.match("/offline")) || Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") e.respondWith(networkFirst(req));
  else if (isStatic(url)) e.respondWith(cacheFirst(req));
});
