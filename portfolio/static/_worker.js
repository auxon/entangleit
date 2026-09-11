/**
 * Cloudflare Pages Advanced Mode worker for entangleit.com.
 * Routes /ASLTutor/* to the SignFlow SPA, /vibecoded/* to the Vibecoded SPA,
 * /x402market/* to the x402market SPA, /agentpay/* to the agentpay SPA, and
 * /bitcoinzip/* to the BitcoinZip SPA.
 * /satsbridge is offline pending regulatory review (410 Gone).
 * Portfolio SPA owns / and /about (and any other non-asset path) via index.html fallback.
 *
 * NOTE: /auth/* and /api/* are served by separate Workers via Cloudflare
 * Worker Routes (vibecoded-api, x402market-api). This Pages worker only serves
 * static assets + SPA fallbacks, so it must NOT intercept those paths.
 *
 * Uses env.ASSETS (Pages asset binding) — required for Advanced Mode.
 */
const ASL_STATIC_EXT =
  /\.(js|mjs|css|wasm|task|png|jpg|jpeg|gif|svg|ico|webp|json|webmanifest|map|txt|woff2?)$/i;

function canonicalAslPath(pathname) {
  // Match /asltutor, /ASLTutor, /AsLtUtOr/..., any case.
  const match = pathname.match(/^\/asltutor(\/.*)?$/i);
  if (!match) return null;
  const rest = match[1] || '/';
  return rest === '/' ? '/ASLTutor/' : `/ASLTutor${rest}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // API/auth belong to the vibecoded-api Worker (Worker Routes).
    // Don't SPA-fallback them here.
    if (
      pathname === '/auth' ||
      pathname.startsWith('/auth/') ||
      pathname.startsWith('/api/')
    ) {
      // satsbridge is offline pending regulatory review (2026-09-10).
      if (pathname.startsWith('/api/satsbridge')) {
        return new Response('satsbridge is offline.', { status: 410 });
      }
      const asset = await env.ASSETS.fetch(request);
      return asset.status !== 404
        ? asset
        : new Response('Not found', { status: 404 });
    }

    if (pathname === '/vibecoded' || pathname === '/vibecoded/') {
      return env.ASSETS.fetch(new URL('/vibecoded/index.html', url));
    }

    if (pathname.startsWith('/vibecoded/')) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      if (ASL_STATIC_EXT.test(pathname)) {
        return new Response('Not found', { status: 404 });
      }
      return env.ASSETS.fetch(new URL('/vibecoded/index.html', url));
    }

    if (pathname === '/x402market' || pathname === '/x402market/') {
      return env.ASSETS.fetch(new URL('/x402market/index.html', url));
    }

    if (pathname.startsWith('/x402market/')) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      if (ASL_STATIC_EXT.test(pathname)) {
        return new Response('Not found', { status: 404 });
      }
      return env.ASSETS.fetch(new URL('/x402market/index.html', url));
    }

    if (pathname === '/agentpay' || pathname === '/agentpay/') {
      return env.ASSETS.fetch(new URL('/agentpay/index.html', url));
    }

    if (pathname.startsWith('/agentpay/')) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      if (ASL_STATIC_EXT.test(pathname)) {
        return new Response('Not found', { status: 404 });
      }
      return env.ASSETS.fetch(new URL('/agentpay/index.html', url));
    }

    if (pathname === '/bitcoinzip' || pathname === '/bitcoinzip/') {
      return env.ASSETS.fetch(new URL('/bitcoinzip/index.html', url));
    }

    if (pathname.startsWith('/bitcoinzip/')) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
      if (ASL_STATIC_EXT.test(pathname)) {
        return new Response('Not found', { status: 404 });
      }
      return env.ASSETS.fetch(new URL('/bitcoinzip/index.html', url));
    }

    // satsbridge is offline pending regulatory review (2026-09-10).
    if (pathname === '/satsbridge' || pathname.startsWith('/satsbridge/')) {
      return new Response('satsbridge is offline.', { status: 410 });
    }

    const canonical = canonicalAslPath(pathname);
    if (canonical && canonical !== pathname) {
      url.pathname = canonical;
      return Response.redirect(url.toString(), 301);
    }

    if (pathname === '/ASLTutor/' || pathname.startsWith('/ASLTutor/')) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;

      // Never SPA-fallback binary/static assets — MediaPipe hangs if .wasm/.task
      // responses are HTML.
      if (ASL_STATIC_EXT.test(pathname) || pathname.includes('/mediapipe/')) {
        return new Response('Not found', { status: 404 });
      }

      return env.ASSETS.fetch(new URL('/ASLTutor/index.html', url));
    }

    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;
    // Never SPA-fallback images or other static files — LinkedIn/Twitter
    // unfurls turn HTML-for-png into a blank white preview.
    if (ASL_STATIC_EXT.test(pathname) || pathname.endsWith('.pdf')) {
      return new Response('Not found', { status: 404 });
    }
    return env.ASSETS.fetch(new URL('/index.html', url));
  },
};
