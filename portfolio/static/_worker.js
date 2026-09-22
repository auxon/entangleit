/**
 * Cloudflare Pages Advanced Mode worker for entangleit.com.
 *
 * Single routing authority. SPA/app mounts:
 *  /ASLTutor/* (SignFlow) · /vibecoded/* · /x402market/* · /agentpay/*
 *  /bitcoinzip/* · /wot/* · /gachago/*
 * Game backends (/wot/ws|health|auth, /gachago/api) proxy to service
 * bindings (WOT_API, GACHAGO_API) configured on the Pages project.
 * /satsbridge is offline pending regulatory review (410 Gone).
 * Portfolio SPA owns / and /about.
 *
 * Project merge scripts (ASLTutor, WoT, GatchaGo, ...) must only copy built
 * assets into public/<mount>/ — NEVER overwrite this file. The SEO map and
 * newer mounts live here.
 *
 * SEO:
 *  - build-content.mjs injects the route manifest between the SEO_MAP markers.
 *  - SPA shells get per-path title/description/canonical/OG/Twitter rewritten
 *    plus a <noscript> summary, so non-JS crawlers and unfurlers see real tags.
 *  - Unknown paths return public/404.html with status 404 (no soft 404s).
 *
 * NOTE: /auth/* and /api/* are served by separate Workers via Cloudflare
 * Worker Routes (vibecoded-api, x402market-api); this worker must not
 * intercept them. Uses env.ASSETS (Pages asset binding).
 */
const SEO = /*__SEO_MAP__*/{
  site: "https://entangleit.com",
  routes: [
    {
      path: "/",
      title: "EntangleIT — Software for an agent economy",
      description:
        "An agent-first software factory: prepaid agent wallets, pay-per-call APIs, discovery markets, gateways, and MCP tools — live on Cloudflare, Stripe, and Bitcoin SV.",
      og: "https://entangleit.com/og-card.png",
      summary:
        "EntangleIT builds the rails agents run on: agentpay, x402market, x402 Gateway, and BSVBounties.",
      links: [],
    },
  ],
}/*__SEO_END__*/;

const ASL_STATIC_EXT =
  /\.(js|mjs|css|wasm|task|png|jpg|jpeg|gif|svg|ico|webp|json|webmanifest|map|txt|xml|woff2?|pdf|zip|mp4|webm|mp3|wav)$/i;

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Longest-prefix match against the injected manifest. */
function metaFor(pathname) {
  const routes = SEO.routes || [];
  let best = null;
  for (const route of routes) {
    const exact = pathname === route.path || pathname === route.path.replace(/\/$/, "");
    const prefix = route.path !== "/" && pathname.startsWith(route.path);
    if ((exact || prefix) && (!best || route.path.length > best.path.length)) best = route;
  }
  return best ?? routes.find((r) => r.path === "/") ?? null;
}

function noscriptHtml(meta) {
  if (!meta) return "";
  const links = (meta.links || [])
    .map((l) => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`)
    .join("");
  return (
    `<noscript><div style="max-width:820px;margin:24px auto;padding:0 20px;font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c7d2de">` +
    `<h1 style="font-size:28px;margin:0 0 8px">${escapeHtml(meta.title)}</h1>` +
    `<p style="margin:0 0 14px">${escapeHtml(meta.summary || meta.description)}</p>` +
    (links ? `<ul>${links}</ul>` : "") +
    `</div></noscript>`
  );
}

/**
 * Rewrites head tags on SPA shells for the current path and appends missing
 * tags + JSON-LD + a noscript summary. Only runs on HTML responses.
 */
function injectSeo(response, meta) {
  const contentType = response.headers.get("content-type") || "";
  if (!meta || !contentType.includes("text/html")) return response;

  const canonical = SEO.site + meta.path;
  const og = meta.og?.startsWith("http") ? meta.og : SEO.site + (meta.og || "/og-card.png");
  const seen = {};
  const add = [];

  const rewriter = new HTMLRewriter()
    .on("title", {
      element(el) {
        seen.title = true;
        el.setInnerContent(meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        seen.description = true;
        el.setAttribute("content", meta.description);
      },
    })
    .on('link[rel="canonical"]', {
      element(el) {
        seen.canonical = true;
        el.setAttribute("href", canonical);
      },
    })
    .on('meta[property="og:title"]', {
      element(el) {
        seen.ogTitle = true;
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[property="og:description"]', {
      element(el) {
        seen.ogDescription = true;
        el.setAttribute("content", meta.description);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        seen.ogUrl = true;
        el.setAttribute("content", canonical);
      },
    })
    .on('meta[property="og:image"]', {
      element(el) {
        seen.ogImage = true;
        el.setAttribute("content", og);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(el) {
        seen.twTitle = true;
        el.setAttribute("content", meta.title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(el) {
        seen.twDescription = true;
        el.setAttribute("content", meta.description);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(el) {
        seen.twImage = true;
        el.setAttribute("content", og);
      },
    })
    .on("head", {
      element(el) {
        el.onEndTag((end) => {
          if (!seen.canonical) add.push(`<link rel="canonical" href="${escapeHtml(canonical)}">`);
          if (!seen.title) add.push(`<title>${escapeHtml(meta.title)}</title>`);
          if (!seen.description)
            add.push(`<meta name="description" content="${escapeHtml(meta.description)}">`);
          if (!seen.ogTitle)
            add.push(`<meta property="og:title" content="${escapeHtml(meta.title)}">`);
          if (!seen.ogDescription)
            add.push(`<meta property="og:description" content="${escapeHtml(meta.description)}">`);
          if (!seen.ogUrl) add.push(`<meta property="og:url" content="${escapeHtml(canonical)}">`);
          if (!seen.ogImage) add.push(`<meta property="og:image" content="${escapeHtml(og)}">`);
          if (!seen.twTitle)
            add.push(`<meta name="twitter:title" content="${escapeHtml(meta.title)}">`);
          if (!seen.twDescription)
            add.push(`<meta name="twitter:description" content="${escapeHtml(meta.description)}">`);
          if (!seen.twImage)
            add.push(`<meta name="twitter:image" content="${escapeHtml(og)}">`);
          if (meta.jsonLd)
            add.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`);
          if (add.length) end.before(add.join(""), { html: true });
        });
      },
    })
    .on("body", {
      element(el) {
        el.onEndTag((end) => {
          end.before(noscriptHtml(meta), { html: true });
        });
      },
    });

  return rewriter.transform(response);
}

/** Static files and content pages first; then ordered SPA-shell candidates. */
async function serveWithin(request, env, url, meta, allowDirect, ...shellPaths) {
  if (allowDirect) {
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) return asset;
    if (!ASL_STATIC_EXT.test(url.pathname)) {
      const asDir = await env.ASSETS.fetch(
        new URL(url.pathname.replace(/\/?$/, "/") + "index.html", url),
      );
      if (asDir.status !== 404) return asDir;
    }
  }
  if (ASL_STATIC_EXT.test(url.pathname)) return notFound(env, url);
  for (const shellPath of shellPaths) {
    const shellRes = await env.ASSETS.fetch(new URL(shellPath, url));
    if (shellRes.status !== 404) return injectSeo(shellRes, meta);
  }
  return notFound(env, url);
}

function notFound(env, url) {
  return env.ASSETS.fetch(new URL("/404.html", url)).then(
    (res) =>
      new Response(res.body, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
      }),
  );
}

function canonicalAslPath(pathname) {
  // Match /asltutor, /ASLTutor, /AsLtUtOr/..., any case.
  const match = pathname.match(/^\/asltutor(\/.*)?$/i);
  if (!match) return null;
  const rest = match[1] || "/";
  return rest === "/" ? "/ASLTutor/" : `/ASLTutor${rest}`;
}

const PORTFOLIO = new Set(["/", "/about", "/about/"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const meta = metaFor(pathname);

    // API/auth belong to their own Workers (Worker Routes).
    if (pathname === "/auth" || pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
      // satsbridge is offline pending regulatory review (2026-09-10).
      if (pathname.startsWith("/api/satsbridge")) {
        return new Response("satsbridge is offline.", { status: 410 });
      }
      const asset = await env.ASSETS.fetch(request);
      return asset.status !== 404 ? asset : new Response("Not found", { status: 404 });
    }

    // Game backends proxy to service bindings on the Pages project.
    if (
      pathname === "/wot/ws" ||
      pathname === "/wot/health" ||
      pathname.startsWith("/wot/auth/")
    ) {
      if (!env.WOT_API) {
        return new Response("WoT API binding missing", { status: 502 });
      }
      const upstream = new URL(request.url);
      upstream.pathname = pathname.replace(/^\/wot/, "") || "/";
      return env.WOT_API.fetch(new Request(upstream.toString(), request));
    }

    if (pathname === "/gachago/api" || pathname.startsWith("/gachago/api/")) {
      if (!env.GACHAGO_API) {
        return new Response("GatchaGo API binding missing", { status: 502 });
      }
      const upstream = new URL(request.url);
      upstream.pathname = pathname.replace(/^\/gachago/, "") || "/";
      return env.GACHAGO_API.fetch(new Request(upstream.toString(), request));
    }

    if (pathname === "/vibecoded" || pathname === "/vibecoded/") {
      return serveWithin(request, env, url, meta, false, "/vibecoded/index.html");
    }
    if (pathname.startsWith("/vibecoded/")) {
      return serveWithin(request, env, url, meta, true, "/vibecoded/index.html");
    }

    if (pathname === "/x402market" || pathname === "/x402market/") {
      return serveWithin(request, env, url, meta, false, "/x402market/index.html");
    }
    if (pathname.startsWith("/x402market/")) {
      return serveWithin(request, env, url, meta, true, "/x402market/index.html");
    }

    if (pathname === "/agentpay" || pathname === "/agentpay/") {
      return serveWithin(request, env, url, meta, false, "/agentpay/index.html");
    }
    if (pathname.startsWith("/agentpay/")) {
      return serveWithin(request, env, url, meta, true, "/agentpay/index.html");
    }

    if (pathname === "/bitcoinzip" || pathname === "/bitcoinzip/") {
      return serveWithin(request, env, url, meta, false, "/bitcoinzip/index.html");
    }
    if (pathname.startsWith("/bitcoinzip/")) {
      return serveWithin(request, env, url, meta, true, "/bitcoinzip/index.html");
    }

    if (pathname === "/wot" || pathname === "/wot/") {
      return serveWithin(request, env, url, meta, false, "/wot/index.html", "/wot/app.html");
    }
    if (pathname.startsWith("/wot/")) {
      return serveWithin(request, env, url, meta, true, "/wot/index.html", "/wot/app.html");
    }

    if (pathname === "/gachago") {
      url.pathname = "/gachago/";
      return Response.redirect(url.toString(), 301);
    }
    if (pathname.startsWith("/gachago/")) {
      return serveWithin(
        request,
        env,
        url,
        meta,
        true,
        "/gachago/index.html",
        "/gachago/shell.html",
        "/gachago/app.html",
      );
    }

    // satsbridge is offline pending regulatory review (2026-09-10).
    if (pathname === "/satsbridge" || pathname.startsWith("/satsbridge/")) {
      return new Response("satsbridge is offline.", { status: 410 });
    }

    const canonical = canonicalAslPath(pathname);
    if (canonical && canonical !== pathname) {
      url.pathname = canonical;
      return Response.redirect(url.toString(), 301);
    }

    if (pathname === "/ASLTutor" || pathname === "/ASLTutor/") {
      return serveWithin(request, env, url, meta, false, "/ASLTutor/index.html");
    }
    if (pathname.startsWith("/ASLTutor/")) {
      // Never SPA-fallback binary/static assets — MediaPipe hangs if
      // .wasm/.task responses are HTML.
      if (pathname.includes("/mediapipe/")) {
        return serveWithin(request, env, url, meta, true);
      }
      return serveWithin(request, env, url, meta, true, "/ASLTutor/index.html");
    }

    // Portfolio SPA home gets per-path injection.
    if (pathname === "/") {
      return serveWithin(request, env, url, meta, false, "/index.html");
    }

    // Legal pages are linked with .html; Pages clean URLs would 308 them to
    // the extensionless path. Serve the assets directly so exact URLs return 200.
    if (pathname === "/privacy.html" || pathname === "/tos.html") {
      const legal = await env.ASSETS.fetch(new URL(pathname.slice(0, -".html".length), url));
      if (legal.status !== 404) return legal;
    }

    // Static assets (sitemap.xml, llms.txt, og/…) and content pages first.
    const direct = await env.ASSETS.fetch(request);
    if (direct.status !== 404) return direct;
    if (!ASL_STATIC_EXT.test(pathname)) {
      const asDir = await env.ASSETS.fetch(
        new URL(pathname.replace(/\/?$/, "/") + "index.html", url),
      );
      if (asDir.status !== 404) return asDir;
    }

    // Never SPA-fallback static files: PDFs/images unfurl as blank HTML.
    if (ASL_STATIC_EXT.test(pathname)) return notFound(env, url);

    // Portfolio SPA owns /about/ and /lab/; anything else is a real 404.
    if (
      pathname === "/about" ||
      pathname === "/about/" ||
      pathname === "/lab" ||
      pathname === "/lab/"
    ) {
      return serveWithin(request, env, url, meta, true, "/index.html");
    }

    return notFound(env, url);
  },
};
