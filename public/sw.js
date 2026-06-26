// ResumeBooster Service Worker
// Strategy:
//   - /api/* → Network-only (AI endpoints must never serve stale data)
//   - Navigation requests → Network-first → Cache fallback → /offline
//   - Static assets (fonts, icons, CSS, JS) → Cache-first
//   - All other fetches → Network-first → Cache fallback

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `resumebooster-static-${CACHE_VERSION}`;
const PAGES_CACHE = `resumebooster-pages-${CACHE_VERSION}`;

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
];

// ─── Install: Pre-cache critical assets ───────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        // Don't fail install if pre-cache partially fails
        console.warn('[SW] Pre-cache failed for some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: Clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, PAGES_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: Route-based caching strategies ────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests entirely
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (auth providers, external CDNs handled separately)
  if (url.origin !== self.location.origin) {
    // Exception: cache Google Fonts for offline support
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    }
    return;
  }

  // ── 1. API routes: Network-only (never cache AI/auth responses) ──
  if (url.pathname.startsWith('/api/')) {
    // Let the browser handle it naturally — no caching
    return;
  }

  // ── 2. Static assets: Cache-first (immutable assets) ──
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // ── 3. Navigation (HTML pages): Network-first → Cache → Offline ──
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // ── 4. Everything else: Network-first → Cache fallback ──
  event.respondWith(networkFirstStrategy(request, PAGES_CACHE));
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/fonts/') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf|css)$/.test(pathname)
  );
}

async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Asset not available offline.', { status: 503 });
  }
}

async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response('Not available offline.', { status: 503 });
  }
}

async function networkFirstWithOfflineFallback(request) {
  const pagesCache = await caches.open(PAGES_CACHE);
  const staticCache = await caches.open(STATIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      pagesCache.put(request, response.clone());
    }
    return response;
  } catch {
    // Try pages cache first
    const cached = await pagesCache.match(request);
    if (cached) return cached;

    // Try static cache (pre-cached pages like '/')
    const staticCached = await staticCache.match(request);
    if (staticCached) return staticCached;

    // Last resort: serve offline page
    const offlinePage = await staticCache.match('/offline');
    if (offlinePage) return offlinePage;

    return new Response(
      `<!DOCTYPE html><html><head><title>Offline - ResumeBooster</title></head>
      <body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h1>You are offline</h1>
        <p>Please check your internet connection.</p>
        <a href="/">Try again</a>
      </body></html>`,
      { status: 503, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
