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
 *
 * /demo-audit (POST) is served by THIS worker: the homepage demo audit agent.
 * Inference: Workers AI binding `AI` first (free tier, no key), then OpenRouter
 * via the OPENROUTER_API_KEY secret. Neither configured -> 503 engine_offline
 * and the frontend shows its graceful offline panel.
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

/* ------------------------------------------------------------------ */
/* Demo audit agent: POST /demo-audit                                    */
/* ------------------------------------------------------------------ */

const DEMO_MAX_INPUT = 2000;
const DEMO_MAX_OUTPUT_TOKENS = 700;
const DEMO_MAX_USER_TURNS = 2; // one description + one round of answers
const DEMO_REQ_PER_DAY = 10; // per IP; a full audit costs 2 requests
const DEMO_DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_JSON = { 'content-type': 'application/json', 'cache-control': 'no-store' };

const demoRate = new Map(); // ip -> { count, reset }

function demoRateOk(ip) {
  const now = Date.now();
  const rec = demoRate.get(ip);
  if (!rec || now > rec.reset) {
    demoRate.set(ip, { count: 1, reset: now + DEMO_DAY_MS });
    return true;
  }
  if (rec.count >= DEMO_REQ_PER_DAY) return false;
  rec.count += 1;
  return true;
}

function demoPrune() {
  if (demoRate.size < 1000) return;
  const now = Date.now();
  for (const [k, v] of demoRate) if (now > v.reset) demoRate.delete(k);
}

function demoBad() {
  return new Response(JSON.stringify({ error: 'bad_request' }), { status: 400, headers: DEMO_JSON });
}

const DEMO_QUESTIONS_SYSTEM = [
  'You are the EntangleIT demo audit agent, live on entangleit.com.',
  'A visitor just described their business. Your ONLY job in this reply: ask up to 3 sharp clarifying questions that pin down (a) where the repetitive knowledge work actually is, (b) its volume and frequency, and (c) the tools and data involved.',
  'Make every question specific to what they wrote. Never ask anything generic they already answered. Do NOT deliver any audit, recommendation, score, or verdict yet.',
  'Reply as JSON ONLY, no prose, no code fences:',
  '{"type":"questions","intro":"one short sentence acknowledging their business","questions":["...","...","..."]}',
].join('\n');

const DEMO_AUDIT_SYSTEM = [
  'You are the EntangleIT demo audit agent, live on entangleit.com.',
  'You asked clarifying questions and the visitor answered. Now deliver the mini-audit.',
  'Pick ONE workflow: the single highest-ROI automation candidate from what they described. Be concrete and honest. If nothing they described is a good fit for an AI agent, say so plainly with fit "poor" and name what would be a better use of their money.',
  'Sketch the ROI with simple arithmetic from their own numbers (hours per week x blended hourly cost x 50 weeks). Keep every field tight: one or two sentences each.',
  'Reply as JSON ONLY, no prose, no code fences, exactly these fields:',
  '{"type":"audit","workflow":"...","why":"...","timeSaved":"...","roiSketch":"...","fit":"strong|borderline|poor","fitReason":"...","suggestedBuild":"..."}',
].join('\n');

function demoMock(phase) {
  if (phase === 'questions') {
    return {
      type: 'questions',
      intro: 'Got it — thanks for the detail.',
      questions: [
        'Which step of that workflow eats the most staff hours per week, and roughly how many?',
        'Where does the source data live today (email, PDFs, a CRM, spreadsheets)?',
        'What does "done right" look like — is there a human review step you would want to keep?',
      ],
    };
  }
  return {
    type: 'audit',
    workflow: 'Example: auto-extracting policy details from PDFs into the CRM.',
    why: 'High volume, structured output, and a clear human review checkpoint make this the safest first automation.',
    timeSaved: '6–10 staff hours per week.',
    roiSketch: '8 hrs/wk × $45/hr × 50 wks ≈ $18,000/yr in reclaimed time.',
    fit: 'strong',
    fitReason: 'Repetitive, rules-based, and measurable — exactly what a production agent is for.',
    suggestedBuild: 'A document-intake agent: watches the inbox, extracts fields, drafts CRM entries for one-click approval.',
  };
}

function demoExtractJson(text) {
  const clean = String(text || '')
    .replace(/^\s*```(?:json)?/i, '')
    .replace(/```\s*$/, '')
    .trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function demoWorkersAI(env, system, messages) {
  const out = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'system', content: system }, ...messages],
    max_tokens: DEMO_MAX_OUTPUT_TOKENS,
  });
  return (out && out.response) || '';
}

async function demoOpenRouter(env, system, messages) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://entangleit.com/',
      'X-Title': 'EntangleIT demo audit agent',
    },
    body: JSON.stringify({
      model: env.DEMO_MODEL || 'openai/gpt-4o-mini',
      max_tokens: DEMO_MAX_OUTPUT_TOKENS,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`openrouter ${res.status}`);
  const data = await res.json();
  return (data && data.choices && data.choices[0] && data.choices[0].message.content) || '';
}

async function handleDemoAudit(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!(request.headers.get('content-type') || '').includes('application/json')) return demoBad();

  let body;
  try {
    body = await request.json();
  } catch {
    return demoBad();
  }
  const messages = body && Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0 || messages.length > 5) return demoBad();

  const llmMessages = [];
  let userTurns = 0;
  for (const m of messages) {
    if (
      !m ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      !m.content.trim() ||
      m.content.length > DEMO_MAX_INPUT
    ) {
      return demoBad();
    }
    if (m.role === 'user') userTurns += 1;
    llmMessages.push({ role: m.role, content: m.content.slice(0, DEMO_MAX_INPUT) });
  }
  if (userTurns === 0 || userTurns > DEMO_MAX_USER_TURNS) return demoBad();

  demoPrune();
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (!demoRateOk(ip)) {
    return new Response(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: DEMO_JSON,
    });
  }

  const phase = userTurns === 1 ? 'questions' : 'audit';

  // DEMO_MOCK=1 lets the UI be tested end-to-end before any inference is wired up.
  if (env.DEMO_MOCK === '1') {
    return new Response(JSON.stringify(demoMock(phase)), { headers: DEMO_JSON });
  }

  const system = phase === 'questions' ? DEMO_QUESTIONS_SYSTEM : DEMO_AUDIT_SYSTEM;
  let raw = '';
  try {
    if (env.AI) raw = await demoWorkersAI(env, system, llmMessages);
    else if (env.OPENROUTER_API_KEY) raw = await demoOpenRouter(env, system, llmMessages);
    else {
      return new Response(JSON.stringify({ error: 'engine_offline' }), {
        status: 503,
        headers: DEMO_JSON,
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'engine_error' }), {
      status: 502,
      headers: DEMO_JSON,
    });
  }

  const parsed = demoExtractJson(raw);
  if (parsed && parsed.type === phase) {
    return new Response(JSON.stringify(parsed), { headers: DEMO_JSON });
  }
  if (parsed && parsed.type === 'audit' && parsed.workflow) {
    // Model skipped ahead and delivered the audit early; take the win.
    return new Response(JSON.stringify(parsed), { headers: DEMO_JSON });
  }
  return new Response(JSON.stringify({ type: 'text', text: String(raw).slice(0, 4000) }), {
    headers: DEMO_JSON,
  });
}

/* ------------------------------------------------------------------ */

const PORTFOLIO = new Set(["/", "/about", "/about/"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const meta = metaFor(pathname);

    // Homepage demo audit agent (handled by this worker; not /api/*).
    if (pathname === "/demo-audit") {
      return handleDemoAudit(request, env);
    }

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
