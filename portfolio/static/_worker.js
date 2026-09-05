/**
 * Cloudflare Pages Advanced Mode worker for entangleit.com.
 * Routes /ASLTutor/* to the SignFlow SPA. Portfolio SPA owns / and /about
 * (and any other non-asset path) via the index.html fallback.
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
    return env.ASSETS.fetch(new URL('/index.html', url));
  },
};
