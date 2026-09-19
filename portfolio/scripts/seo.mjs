/**
 * SEO source of truth for entangleit.com.
 *
 * - APP_ROUTES: sitemap + edge meta injection for SPA shells served by the
 *   Pages worker (build-content.mjs injects the runtime map into _worker.js).
 * - jsonLdFor(): structured data per page type, shared by the builder.
 * - Worker-served SPAs (bsvbounties, x402gateway, usenet, leak...) carry their
 *   own head tags in their own repos.
 */

export const SITE = "https://entangleit.com";
export const OG_DEFAULT = "/og-card.png";
export const ORG = {
  "@type": "Organization",
  name: "EntangleIT",
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  description:
    "Agent-first software factory building the rails agents run on: prepaid wallets, pay-per-call APIs, discovery markets, gateways, and MCP tools.",
  sameAs: ["https://github.com/auxon"],
};

/** Surfaces the Pages worker serves (edge meta injection + sitemap). */
export const APP_ROUTES = [
  {
    path: "/",
    type: "home",
    title: "EntangleIT — Software for an agent economy",
    description:
      "An agent-first software factory: prepaid agent wallets, pay-per-call APIs, discovery markets, gateways, and MCP tools — live on Cloudflare, Stripe, and Bitcoin SV.",
    og: "/og-card.png",
    summary:
      "EntangleIT builds the rails agents run on: agentpay (prepaid USD wallets), x402market (paid API discovery), x402 Gateway (sell any API to agents), BSVBounties (paid work with on-chain escrow), and bsvOS (an operating system with a built-in wallet).",
    links: [
      { href: "/agentpay/", label: "agentpay — prepaid USD wallets for AI agents" },
      { href: "/x402gateway/", label: "x402 Gateway — turn any API into a paid endpoint" },
      { href: "/x402market/", label: "x402market — paid APIs for agents" },
      { href: "/bsvbounties/", label: "BSVBounties — paid work with escrow" },
      { href: "/bsvos/", label: "bsvOS — an operating system with a built-in wallet" },
      { href: "/infographics/agent-economy-stack.png", label: "How the projects connect" },
    ],
    sitemap: { priority: 1.0, changefreq: "weekly" },
  },
  {
    path: "/about/",
    type: "about",
    title: "About — EntangleIT, an agent-first software factory",
    description:
      "Who builds EntangleIT, why the factory is agent-first, and what ships: wallets, gateways, markets, and bounty rails on Cloudflare, Stripe, and Bitcoin SV.",
    og: "/og-card.png",
    summary:
      "EntangleIT is an agent-first software factory. Every product runs live on this origin: wallets, pay-per-call APIs, a discovery market, a seller gateway, and an agent job board with on-chain escrow.",
    links: [
      { href: "/", label: "Home — Software for an agent economy" },
      { href: "/agentpay/", label: "agentpay" },
      { href: "/bsvbounties/", label: "BSVBounties" },
      { href: "/factory/agent-ready-api/", label: "Agent-ready API in 48 hours" },
    ],
    sitemap: { priority: 0.6, changefreq: "monthly" },
  },
  {
    path: "/agentpay/",
    type: "app",
    name: "agentpay",
    title: "agentpay — prepaid USD wallets for AI agents",
    description:
      "Card-funded prepaid wallets for AI agents: scoped keys with daily limits and approval gates, x402/BSV pay-per-call settlement, proof-of-spend attestations, and 22 MCP tools for earning and spending.",
    og: "/og/agentpay.png",
    summary:
      "agentpay gives an agent a prepaid USD wallet and a scoped key. It spends per call over x402 on BSV, earns from work on BSVBounties, and proves activity with signed attestations — all over one MCP endpoint.",
    links: [
      { href: "/agentpay/docs/", label: "agentpay documentation" },
      { href: "/agentpay/mcp/", label: "agentpay MCP tool reference" },
      { href: "/guide/agent-wallets/", label: "Guide: what is an agent wallet?" },
      { href: "/x402gateway/", label: "x402 Gateway — sell any API to agents" },
      { href: "/x402market/", label: "x402market — paid APIs agents can buy" },
      { href: "/bsvbounties/", label: "BSVBounties — paid work with escrow" },
    ],
    sitemap: { priority: 0.9, changefreq: "weekly" },
  },
  {
    path: "/x402gateway/",
    type: "app",
    name: "x402 Gateway",
    title: "x402 Gateway — turn any API into a paid endpoint for AI agents",
    description:
      "A hosted gateway that wraps your API in x402: agent auth, replay protection, SSRF guards, pricing, and an analytics dashboard. Free tier plus Pro at $9/mo.",
    og: "/og/x402gateway.png",
    summary:
      "x402 Gateway makes any HTTP API agent-payable: add your upstream, set a sat price, and agents discover and pay per call over x402 with BSV settlement. Includes analytics and a free tier.",
    links: [
      { href: "/x402gateway/docs/", label: "x402 Gateway documentation" },
      { href: "/guide/sell-api-to-agents/", label: "Guide: sell your API to AI agents" },
      { href: "/x402market/", label: "List your gateway service in x402market" },
      { href: "/agentpay/", label: "agentpay — wallets that settle these routes" },
      { href: "/bsvbounties/", label: "BSVBounties — paid work with escrow" },
    ],
    sitemap: { priority: 0.9, changefreq: "weekly" },
  },
  {
    path: "/x402market/",
    type: "app",
    name: "x402market",
    title: "x402market — paid APIs for AI agents, discoverable and quotable",
    description:
      "A registry of verified pay-per-call x402 services for AI agents: manifests in, live 402 challenges out, sats settlement on BSV. Agents list and quote for free.",
    og: "/og/x402market.png",
    summary:
      "x402market is the discovery layer: verified paid x402 services with live 402 quotes — payTo, price in sats, MCP-ready. Agents call service_quote before they spend, sellers get distribution.",
    links: [
      { href: "/x402market/docs/", label: "x402market documentation" },
      { href: "/x402gateway/", label: "Hosted: x402 Gateway" },
      { href: "/agentpay/", label: "Pay from an agentpay wallet" },
      { href: "/bsvbounties/", label: "BSVBounties — paid work with escrow" },
      { href: "/guide/x402-payments/", label: "Guide: how x402 payments work" },
    ],
    sitemap: { priority: 0.9, changefreq: "weekly" },
  },
  {
    path: "/bsvbounties/",
    type: "app",
    name: "BSVBounties",
    title: "BSVBounties — paid work for AI agents with on-chain escrow",
    description:
      "Post or claim paid tasks with real sats escrow, deterministic verification, LLM arbitration, and portable reputation. Humans and agents work the same board over MCP.",
    og: "/og/bsvbounties.png",
    summary:
      "BSVBounties is an agent job board: bounties with real BSV escrow, sealed submissions, verifiable acceptance, and reputation that carries across jobs. Claim work over MCP — payouts land in sats or an agentpay balance.",
    links: [
      { href: "/bsvbounties/docs/", label: "BSVBounties documentation" },
      { href: "/guide/agent-bounties/", label: "Guide: hiring agents with escrow" },
      { href: "/agentpay/", label: "Earn into an agentpay balance" },
      { href: "/x402market/", label: "Spend earnings on paid x402 APIs" },
      { href: "/x402gateway/", label: "x402 Gateway — sell any API to agents" },
    ],
    sitemap: { priority: 0.9, changefreq: "weekly" },
  },
  {
    path: "/bitcoinzip/",
    type: "app",
    name: "BitcoinZip",
    title: "BitcoinZip — send BTC by paying a few sats of BSV",
    description:
      "BitcoinZip moves BTC with a pre-signed check delivered over BSV: create a dedicated gift wallet, sign the sweep, encrypt it to the recipient. No custody, no counterparty.",
    og: "/og-card.png",
    summary:
      "BitcoinZip sends BTC by paying a few sats of BSV: a pre-signed sweep transaction is encrypted to the recipient and delivered in a BSV OP_RETURN. No custody, no liquidity needed.",
    links: [
      { href: "/", label: "Home — Software for an agent economy" },
      { href: "/x402market/", label: "x402market — paid APIs for agents" },
      { href: "/agentpay/", label: "agentpay — prepaid wallets for agents" },
    ],
    sitemap: { priority: 0.5, changefreq: "monthly" },
  },
  {
    path: "/wot/",
    type: "app",
    name: "Wheel of Time",
    title: "The Wheel of Time — MMO",
    description:
      "A browser MMO in the world of the Wheel of Time — the Wheel weaves as the Wheel wills. Play free in your browser.",
    og: "/og-card.png",
    summary:
      "A browser-based Wheel of Time MMO with game API, auth, and real-time play. The Wheel weaves as the Wheel wills.",
    links: [
      { href: "/", label: "Home — Software for an agent economy" },
      { href: "/gachago", label: "GatchaGo — draw and animate chibi characters" },
      { href: "/ASLTutor/", label: "ASLTutor — learn American Sign Language" },
    ],
    sitemap: { priority: 0.4, changefreq: "monthly" },
  },
  {
    path: "/gachago/",
    type: "app",
    name: "GatchaGo",
    title: "GatchaGo — draw, customize, and animate chibi characters",
    description:
      "Design chibi characters, customize parts, and animate them in the browser. A playful build from the EntangleIT factory.",
    og: "/og-card.png",
    summary:
      "GatchaGo is a browser toy for drawing, customizing, and animating chibi characters.",
    links: [
      { href: "/", label: "Home — Software for an agent economy" },
      { href: "/wot/", label: "The Wheel of Time — MMO" },
      { href: "/ASLTutor/", label: "ASLTutor — learn American Sign Language" },
    ],
    sitemap: { priority: 0.4, changefreq: "monthly" },
  },
  {
    path: "/usenetbsv/",
    type: "app",
    name: "UsenetBSV",
    title: "UsenetBSV — newsgroups with micropayments",
    description:
      "Paid newsgroups on Bitcoin SV: read and post over NNTP or HTTP, pay per action with x402, no accounts and no ads.",
    og: "/og-card.png",
    summary:
      "UsenetBSV revives newsgroups with micropayments: an NNTP gateway plus an x402 HTTP API where reading and posting settle in sats. No accounts, no ads.",
    links: [
      { href: "/usenetbsv/", label: "UsenetBSV" },
      { href: "/guide/x402-payments/", label: "Guide: how x402 payments work" },
    ],
    sitemap: { priority: 0.6, changefreq: "monthly" },
  },
  {
    path: "/vibecoded/",
    type: "app",
    name: "Vibecoded",
    title: "Vibecoded — apps built with AI, with the prompts behind them",
    description:
      "A directory of apps generated with AI: browse by model, pricing, and prompt. See what was vibecoded and how.",
    og: "/og-card.png",
    summary:
      "Vibecoded is a directory of AI-built apps: the model, the prompt, pricing, and links. Browse free, freemium, paid, and trial apps.",
    links: [{ href: "/vibecoded/", label: "Browse vibecoded apps" }],
    sitemap: { priority: 0.5, changefreq: "monthly" },
  },
  {
    path: "/ASLTutor/",
    type: "app",
    name: "ASLTutor",
    title: "ASLTutor — learn American Sign Language with on-device AI",
    description:
      "An ASL learning app with on-device hand tracking, instant feedback, and a conversational tutor. No camera uploads.",
    og: "/og-card.png",
    summary:
      "ASLTutor teaches American Sign Language with on-device MediaPipe hand tracking and an AI tutor — practice, get feedback, and talk with your hands.",
    links: [{ href: "/ASLTutor/", label: "Open ASLTutor" }],
    sitemap: { priority: 0.5, changefreq: "monthly" },
  },
];

/** Strip keys the worker map doesn't need. */
export function runtimeMap() {
  return {
    site: SITE,
    routes: APP_ROUTES.map((r) => ({
      path: r.path,
      title: r.title,
      description: r.description,
      og: r.og?.startsWith("http") ? r.og : `${SITE}${r.og ?? OG_DEFAULT}`,
      summary: r.summary,
      links: r.links ?? [],
      jsonLd: jsonLdFor(r),
    })),
  };
}

export function jsonLdFor(route) {
  const url = `${SITE}${route.path}`;
  switch (route.type) {
    case "home":
      return {
        "@context": "https://schema.org",
        "@graph": [
          ORG,
          {
            "@type": "WebSite",
            name: "EntangleIT",
            url: SITE,
            description: route.description,
          },
        ],
      };
    case "about":
      return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: route.title,
        url,
        description: route.description,
        publisher: ORG,
      };
    case "app":
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: route.name ?? route.title,
        url,
        description: route.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        publisher: ORG,
      };
    case "doc":
    case "guide":
      return {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: route.title,
        url,
        description: route.description,
        dateModified: route.updated ?? new Date().toISOString().slice(0, 10),
        publisher: ORG,
      };
    case "factory":
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: route.title,
        url,
        description: route.description,
        provider: ORG,
        ...(route.price
          ? {
              offers: {
                "@type": "Offer",
                price: String(route.price),
                priceCurrency: "USD",
                url,
              },
            }
          : {}),
      };
    case "note":
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: route.title,
        url,
        description: route.description,
        datePublished: route.updated ?? undefined,
        dateModified: route.updated ?? undefined,
        author: ORG,
        publisher: ORG,
      };
    default:
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: route.title,
        url,
        description: route.description,
        publisher: ORG,
      };
  }
}

export function sitemapXml(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => r.sitemap !== false)
    .map((r) => {
      const priority = r.sitemap?.priority ?? 0.5;
      const changefreq = r.sitemap?.changefreq ?? "monthly";
      const lastmod = r.updated ?? today;
      return `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
