#!/usr/bin/env node
/**
 * Renders 1200×630 OG cards for each priority product into static/og/.
 * Run: node scripts/render-og.mjs   (requires playwright; uses the shared cache)
 */
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } =
  process.env.PLAYWRIGHT_PATH
    ? require(process.env.PLAYWRIGHT_PATH)
    : require("/Users/rah/satpress/node_modules/playwright");

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "static", "og");
mkdirSync(outDir, { recursive: true });

const CARDS = [
  {
    slug: "agentpay",
    accent: "#4ade80",
    name: "agentpay",
    tagline: "Prepaid USD wallets for AI agents",
    chips: ["Scoped keys · limits · approvals", "Spend x402 · earn bounties", "22 MCP tools"],
    url: "entangleit.com/agentpay",
  },
  {
    slug: "x402gateway",
    accent: "#38bdf8",
    name: "x402 Gateway",
    tagline: "Turn any API into a paid endpoint for agents",
    chips: ["Hosted · no Worker to deploy", "Auth injection · replay guard", "Free · Pro $9/mo"],
    url: "entangleit.com/x402gateway",
  },
  {
    slug: "x402market",
    accent: "#a78bfa",
    name: "x402market",
    tagline: "Paid APIs for AI agents, discoverable",
    chips: ["Verified manifests", "Live 402 quotes", "Sats settlement on BSV"],
    url: "entangleit.com/x402market",
  },
  {
    slug: "bsvbounties",
    accent: "#fbbf24",
    name: "BSVBounties",
    tagline: "Paid work for agents, with on-chain escrow",
    chips: ["Claim · submit · get paid", "Verifiable acceptance", "Portable reputation"],
    url: "entangleit.com/bsvbounties",
  },
];

function titleHtml(name) {
  return name.includes(" ") ? name.replace(/ ([^ ]+)$/, " <em>$1</em>") : `<em>${name}</em>`;
}

function html(card) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width: 1200px; height: 630px; overflow: hidden;
    background: radial-gradient(900px 480px at 15% -10%, #16283a 0%, #0a0e13 62%);
    color: #e8eef5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between; padding: 54px 64px; position: relative; }
  .grid { position: absolute; inset: 0; background-image:
    linear-gradient(#141e29 1px, transparent 1px), linear-gradient(90deg, #141e29 1px, transparent 1px);
    background-size: 40px 40px; opacity: .55; }
  .top, .mid, .bottom { position: relative; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: .22em; font-size: 14px; color: #9fb0c0; }
  .brand i { width: 10px; height: 10px; border-radius: 50%; background: ${card.accent}; }
  h1 { font-size: 84px; letter-spacing: -2.5px; line-height: 1; margin-bottom: 18px; }
  h1 em { font-style: normal; color: ${card.accent}; }
  .tag { font-size: 27px; color: #b9c5d2; line-height: 1.35; max-width: 880px; }
  .chips { display: flex; gap: 12px; flex-wrap: wrap; }
  .chip { border: 1px solid #26333f; background: rgba(19,28,38,.85); border-radius: 999px;
    padding: 9px 18px; font-size: 17px; color: #c7d2de; }
  .bottom { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #1d2a38; padding-top: 22px; }
  .url { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 20px; color: ${card.accent}; }
  .kicker { font-size: 15px; color: #5e6c7b; letter-spacing: .18em; text-transform: uppercase; }
</style></head><body>
  <div class="grid"></div>
  <div class="top"><div class="brand"><i></i>ENTANGLEIT</div></div>
  <div class="mid">
    <h1>${titleHtml(card.name)}</h1>
    <div class="tag">${card.tagline}</div>
  </div>
  <div class="bottom">
    <div class="chips">${card.chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
    <div class="url">${card.url}</div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const card of CARDS) {
  await page.setContent(html(card), { waitUntil: "load" });
  await page.waitForTimeout(120);
  await page.screenshot({ path: join(outDir, `${card.slug}.png`) });
  console.log(`og/${card.slug}.png`);
}
await browser.close();
