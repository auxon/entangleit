#!/usr/bin/env node
/**
 * Content + SEO build step (runs last in `build:pages`, after vite + merges).
 *
 * - content/**.md  -> public/<path>/index.html (dark-themed static pages)
 * - public/sitemap.xml, public/llms.txt, public/llms-full.txt
 * - injects the runtime SEO map into public/_worker.js (edge meta injection)
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_ROUTES, SITE, jsonLdFor, runtimeMap, sitemapXml } from "./seo.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const contentDir = join(root, "content");
const outDir = join(root, "public");

const SECTION = { doc: "Docs", guide: "Guides", factory: "Factory", note: "Notes", about: "About" };
const SECTION_ORDER = ["Docs", "Guides", "Factory", "Notes", "About"];

// ---------- markdown ----------

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(md) {
  const lines = md.split("\n");
  let html = "";
  let inCode = false;
  let list = null;
  let para = [];
  const flush = () => {
    if (para.length) {
      html += `<p>${inline(para.join(" "))}</p>\n`;
      para = [];
    }
  };
  const closeList = () => {
    if (list) {
      html += `</${list}>\n`;
      list = null;
    }
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (line.startsWith("```")) {
      flush();
      closeList();
      if (inCode) {
        html += "</code></pre>\n";
        inCode = false;
      } else {
        const lang = line.slice(3).trim();
        html += `<pre><code${lang ? ` class="lang-${escapeHtml(lang)}"` : ""}>`;
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html += escapeHtml(raw) + "\n";
      continue;
    }
    if (!line.trim()) {
      flush();
      closeList();
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      flush();
      closeList();
      const lvl = m[1].length;
      html += `<h${lvl}>${inline(m[2])}</h${lvl}>\n`;
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flush();
      closeList();
      html += "<hr>\n";
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) {
      flush();
      closeList();
      html += `<blockquote><p>${inline(m[1])}</p></blockquote>\n`;
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flush();
      if (list !== "ul") {
        closeList();
        html += "<ul>\n";
        list = "ul";
      }
      html += `<li>${inline(m[1])}</li>\n`;
      continue;
    }
    if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flush();
      if (list !== "ol") {
        closeList();
        html += "<ol>\n";
        list = "ol";
      }
      html += `<li>${inline(m[1])}</li>\n`;
      continue;
    }
    para.push(line.trim());
  }
  flush();
  closeList();
  if (inCode) html += "</code></pre>\n";
  return html;
}

function parseFrontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: text.slice(m[0].length) };
}

function extractFaq(md) {
  const lines = md.split("\n");
  const faqs = [];
  let inFaq = false;
  let question = null;
  let answer = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);
    if (h2) {
      if (question) {
        faqs.push({ q: question, a: answer.join(" ").trim() });
        question = null;
        answer = [];
      }
      inFaq = /faq|questions/i.test(h2[1]);
      continue;
    }
    if (h3 && inFaq) {
      if (question) faqs.push({ q: question, a: answer.join(" ").trim() });
      question = h3[1];
      answer = [];
      continue;
    }
    if (question && line.trim()) answer.push(line.trim());
  }
  if (question) faqs.push({ q: question, a: answer.join(" ").trim() });
  return faqs.filter((f) => f.q && f.a);
}

// ---------- page template ----------

function structuredData(route, faqs) {
  const scripts = [];
  const base = route.jsonld ?? jsonLdFor(route);
  scripts.push(base);
  if (faqs.length) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  scripts.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: route.title, item: `${SITE}${route.path}` },
    ],
  });
  return scripts
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n    ");
}

function renderPage(route, bodyHtml, faqs) {
  const url = `${SITE}${route.path}`;
  const og = route.og?.startsWith("http") ? route.og : `${SITE}${route.og ?? "/og-card.png"}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(route.title)}</title>
    <meta name="description" content="${escapeHtml(route.description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index,follow" />
    ${route.keywords ? `<meta name="keywords" content="${escapeHtml(route.keywords)}" />` : ""}
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="EntangleIT" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:image" content="${og}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${og}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    ${structuredData(route, faqs)}
    <style>
      :root { --bg:#0a0e13; --panel:#10171f; --line:#1d2a38; --text:#e8eef5; --muted:#8a98a8; --dim:#5e6c7b; --green:#4ade80; --violet:#a78bfa; --amber:#fbbf24; --blue:#60a5fa; }
      * { box-sizing:border-box; }
      body { margin:0; background:radial-gradient(1100px 560px at 15% -10%, #12202f 0%, var(--bg) 60%); color:var(--text); font:16.5px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }
      a { color:var(--green); text-decoration:none; }
      a:hover { text-decoration:underline; }
      header { border-bottom:1px solid var(--line); background:rgba(10,14,19,.85); backdrop-filter:blur(8px); position:sticky; top:0; z-index:5; }
      .head { max-width:980px; margin:0 auto; padding:14px 22px; display:flex; align-items:center; gap:18px; }
      .brand { display:flex; align-items:center; gap:9px; font-family:Syne,sans-serif; font-weight:800; letter-spacing:.12em; font-size:13px; color:var(--text); }
      .brand i { width:9px; height:9px; border-radius:50%; background:var(--green); display:inline-block; }
      nav { margin-left:auto; display:flex; gap:16px; font-size:14px; }
      nav a { color:var(--muted); }
      nav a:hover { color:var(--text); }
      main { max-width:820px; margin:0 auto; padding:44px 22px 80px; }
      .kicker { font-family:"JetBrains Mono",monospace; font-size:12px; letter-spacing:.22em; text-transform:uppercase; color:var(--green); }
      h1 { font-family:Syne,sans-serif; font-size:40px; line-height:1.12; letter-spacing:-.8px; margin:10px 0 14px; }
      .lede { font-size:19px; color:var(--muted); margin:0 0 30px; }
      article h2 { font-family:Syne,sans-serif; font-size:25px; letter-spacing:-.3px; margin:42px 0 12px; }
      article h3 { font-size:18.5px; margin:28px 0 8px; }
      article p { color:#c7d2de; }
      article li { color:#c7d2de; margin:4px 0; }
      code { font-family:"JetBrains Mono",monospace; font-size:.88em; background:#131c26; border:1px solid var(--line); border-radius:5px; padding:1px 5px; }
      pre { background:#0d1320; border:1px solid var(--line); border-radius:12px; padding:16px 18px; overflow:auto; }
      pre code { background:none; border:0; padding:0; font-size:13px; line-height:1.6; }
      blockquote { border-left:3px solid var(--violet); margin:20px 0; padding:2px 0 2px 16px; color:var(--muted); }
      hr { border:0; border-top:1px solid var(--line); margin:36px 0; }
      .cta { margin:40px 0 0; padding:22px; background:var(--panel); border:1px solid var(--line); border-radius:14px; }
      .cta strong { font-family:Syne,sans-serif; }
      .cta a { font-weight:600; }
      .related { margin-top:46px; padding-top:26px; border-top:1px solid var(--line); }
      .related h2 { font-size:15px; text-transform:uppercase; letter-spacing:.14em; color:var(--muted); font-family:"JetBrains Mono",monospace; }
      .related ul { list-style:none; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      .related a { color:var(--text); }
      footer { border-top:1px solid var(--line); color:var(--dim); font-size:13.5px; }
      .foot { max-width:980px; margin:0 auto; padding:26px 22px 44px; display:flex; flex-wrap:wrap; gap:8px 22px; }
      .foot a { color:var(--muted); }
      @media (max-width:640px) { h1 { font-size:31px; } .related ul { grid-template-columns:1fr; } nav { display:none; } }
    </style>
  </head>
  <body>
    <header>
      <div class="head">
        <a class="brand" href="/"><i></i>ENTANGLEIT</a>
        <nav>
          <a href="/agentpay/">agentpay</a>
          <a href="/x402gateway/">x402 Gateway</a>
          <a href="/x402market/">x402market</a>
          <a href="/bsvbounties/">BSVBounties</a>
          <a href="/notes/">Notes</a>
        </nav>
      </div>
    </header>
    <main>
      <div class="kicker">${escapeHtml(SECTION[route.type] ?? "EntangleIT")}</div>
      <h1>${escapeHtml(route.title)}</h1>
      ${route.lede ? `<p class="lede">${escapeHtml(route.lede)}</p>` : ""}
      <article>
${bodyHtml}      </article>
      <div class="related">
        <h2>Keep going</h2>
        <ul>
          <li><a href="/agentpay/">agentpay — prepaid wallets for agents</a></li>
          <li><a href="/x402gateway/">x402 Gateway — sell any API to agents</a></li>
          <li><a href="/x402market/">x402market — paid API discovery</a></li>
          <li><a href="/bsvbounties/">BSVBounties — paid work with escrow</a></li>
          <li><a href="/factory/agent-ready-api/">Agent-ready API in 48 hours</a></li>
          <li><a href="/infographics/agent-economy-stack.png">The stack, in one image</a></li>
        </ul>
      </div>
    </main>
    <footer>
      <div class="foot">
        <span>© 2026 EntangleIT — software for an agent economy.</span>
        <a href="/">Home</a>
        <a href="/about/">About</a>
        <a href="/privacy.html">Privacy</a>
        <a href="https://github.com/auxon" rel="me">GitHub</a>
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/llms.txt">llms.txt</a>
      </div>
    </footer>
  </body>
</html>
`;
}

// ---------- collect content ----------

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name.endsWith(".md")) acc.push(full);
  }
  return acc;
}

function loadContent() {
  if (!existsSync(contentDir)) return [];
  return walk(contentDir).map((file) => {
    const raw = readFileSync(file, "utf8");
    const { data, body } = parseFrontMatter(raw);
    const path = (data.path ?? "/").replace(/\/?$/, "/");
    const faqs = extractFaq(body);
    return {
      file,
      path,
      type: data.type ?? "doc",
      title: data.title ?? path,
      description: data.description ?? "",
      lede: data.lede ?? data.description ?? "",
      keywords: data.keywords,
      og: data.og,
      updated: data.updated,
      priority: data.priority ? Number(data.priority) : 0.7,
      price: data.price,
      changefreq: data.changefreq ?? "monthly",
      body,
      faqs,
    };
  });
}

// ---------- build ----------

const content = loadContent();
const seen = new Set();
for (const page of content) {
  if (seen.has(page.path)) throw new Error(`duplicate content path: ${page.path}`);
  seen.add(page.path);
  const html = renderPage(page, mdToHtml(page.body), page.faqs);
  const dir = join(outDir, page.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

// sitemap: app routes + content routes
const sitemapRoutes = [
  ...APP_ROUTES.filter((r) => r.sitemap !== false),
  ...content.map((p) => ({
    path: p.path,
    updated: p.updated,
    sitemap: { priority: p.priority, changefreq: p.changefreq },
  })),
];
writeFileSync(join(outDir, "sitemap.xml"), sitemapXml(sitemapRoutes));

// llms.txt
const productLines = APP_ROUTES.filter((r) => r.type === "app")
  .map((r) => `- [${r.name}](${SITE}${r.path}): ${r.description}`)
  .join("\n");
const contentLines = SECTION_ORDER.flatMap((section) => {
  const pages = content.filter((p) => SECTION[p.type] === section);
  if (!pages.length) return [];
  return [
    `## ${section}`,
    ...pages.map((p) => `- [${p.title}](${SITE}${p.path}): ${p.description}`),
    "",
  ];
}).join("\n");
const llms = `# EntangleIT

> Agent-first software factory: prepaid agent wallets, pay-per-call x402 APIs, discovery, gateways, and paid work with on-chain BSV escrow. Everything is live on this origin.

## Products
${productLines}

${contentLines}
## Machine endpoints
- MCP (agentpay): ${SITE}/api/agentpay/mcp — 22 tools for balances, payments, services, and bounties
- x402market registry: ${SITE}/x402market/ — verified paid services with live 402 quotes
- MCP cards: ${SITE}/.well-known/mcp.json
- Infographic: ${SITE}/infographics/agent-economy-stack.png

## Optional
- [Sitemap](${SITE}/sitemap.xml)
- [GitHub](https://github.com/auxon)
`;
writeFileSync(join(outDir, "llms.txt"), llms);

// llms-full.txt: raw docs, concatenated
const full = [
  `# EntangleIT — full text`,
  ``,
  ...content.map(
    (p) => `\n\n============================================================\n# ${p.title}\nURL: ${SITE}${p.path}\n\n${p.body.trim()}\n`,
  ),
].join("\n");
writeFileSync(join(outDir, "llms-full.txt"), full);

// inject runtime SEO map into the deployed worker
const workerPath = join(outDir, "_worker.js");
if (existsSync(workerPath)) {
  const worker = readFileSync(workerPath, "utf8");
  const injected = `/*__SEO_MAP__*/${JSON.stringify(runtimeMap())}/*__SEO_END__*/`;
  const next = worker.replace(
    /\/\*__SEO_MAP__\*\/[\s\S]*?\/\*__SEO_END__\*\//,
    () => injected,
  );
  if (next === worker && !worker.includes("__SEO_MAP__")) {
    throw new Error("public/_worker.js is missing the SEO map markers");
  }
  writeFileSync(workerPath, next);
}

console.log(
  `build-content: ${content.length} pages · sitemap ${sitemapRoutes.length} urls · llms.txt · worker map injected`,
);
