/**
 * bitcoinbutton-entangleit-demo
 *
 * Test page hosted at:
 *   https://bitcoinbutton.entangleit.com/entangleit-demo
 * (also answers /entangleit-demo/ with trailing slash)
 *
 * Serves a static demo that embeds the exact BitcoinButton iframe from the
 * request, plus tip / mint / unlock variants so payments and stream NFTs
 * can be exercised in one place.
 *
 * Routing: this worker owns only the /entangleit-demo* path via
 * Cloudflare Worker Routes (more specific than the catch-all
 * bitcoinbutton.entangleit.com/* -> bitcoinbutton worker), so the main
 * Next.js app is untouched.
 */

const WIDGET_BASE = "https://entangleit.com/bitcoinbutton/embed/widget";

// Exact snippet from the request — must stay verbatim in section 1.
const EXACT_IFRAME_SRC =
  "https://entangleit.com/bitcoinbutton/embed/widget?amount=0.0001&to=richard.hein%40entangleit.com&action=pay&currency=BSV&label=Pay+with+Bitcoin&stream=entangleit-live&compact=1";

const EXACT_SNIPPET = `<iframe
  src="${EXACT_IFRAME_SRC}"
  title="BitcoinButton"
  width="320"
  height="200"
  style="border:0;border-radius:16px;overflow:hidden;max-width:100%;"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

function widgetUrl(params) {
  const q = new URLSearchParams(params);
  return `${WIDGET_BASE}?${q.toString()}`;
}

function iframeFor(params, height = 200) {
  const src = widgetUrl(params);
  return `<iframe src="${src}" title="BitcoinButton" width="320" height="${height}" style="border:0;border-radius:16px;overflow:hidden;max-width:100%;background:#0b0f14;" loading="lazy" allow="clipboard-write"></iframe>`;
}

function pageHtml() {
  const pay = {
    amount: "0.0001",
    to: "richard.hein@entangleit.com",
    action: "pay",
    currency: "BSV",
    label: "Pay with Bitcoin",
    stream: "entangleit-live",
    compact: "1",
  };
  const tip = {
    amount: "0.001",
    to: "richard.hein@entangleit.com",
    action: "tip",
    currency: "BSV",
    label: "Tip the stream",
    stream: "entangleit-live",
    compact: "1",
  };
  const mint = {
    amount: "0.01",
    to: "richard.hein@entangleit.com",
    action: "mint",
    currency: "BSV",
    label: "Mint stream NFT",
    stream: "entangleit-live",
    compact: "1",
  };
  const unlock = {
    amount: "0.005",
    to: "richard.hein@entangleit.com",
    action: "unlock",
    currency: "BSV",
    label: "Unlock holder room",
    stream: "entangleit-live",
    compact: "1",
  };
  const fullSize = {
    amount: "0.0001",
    to: "richard.hein@entangleit.com",
    action: "pay",
    currency: "BSV",
    label: "Pay with Bitcoin",
    stream: "entangleit-live",
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>BitcoinButton — EntangleIT Demo (payments + NFTs)</title>
<meta name="description" content="Test page for BitcoinButton embeds: live payment button plus mint/unlock stream-NFT variants on entangleit-live." />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>₿</text></svg>" />
<style>
  :root { color-scheme: dark; --bg:#07090c; --panel:#12171f; --line:rgba(255,255,255,.1); --amber:#f0a500; --amber-soft:#ffc857; --muted:#9aa3b2; --fg:#f4f0e6; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }
  .wrap { max-width:960px; margin:0 auto; padding:32px 20px 64px; }
  header { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
  .mark { display:grid; place-items:center; width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,#ffc043,#e8940a); color:#1a1408; font-weight:800; }
  h1 { font-size:clamp(1.6rem,4vw,2.4rem); margin:.2em 0; letter-spacing:-.02em; }
  .sub { color:var(--muted); max-width:60ch; }
  .pill { display:inline-block; font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--amber-soft); border:1px solid rgba(240,165,0,.35); background:rgba(240,165,0,.1); border-radius:999px; padding:4px 12px; }
  .grid { display:grid; gap:20px; margin-top:28px; }
  @media(min-width:760px){ .grid.two { grid-template-columns:1fr 1fr; } }
  .card { background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:20px; }
  .card h2 { margin:0 0 4px; font-size:1.15rem; }
  .card p { margin:6px 0 14px; color:var(--muted); font-size:.92rem; }
  .tag { font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:var(--amber-soft); }
  pre { background:#0b0f14; border:1px solid var(--line); border-radius:12px; padding:14px; overflow:auto; font-size:12.5px; line-height:1.5; }
  code { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; }
  .row { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
  a.btn, button.btn { appearance:none; border:1px solid rgba(240,165,0,.4); background:rgba(240,165,0,.12); color:var(--amber-soft); border-radius:999px; padding:8px 16px; font-size:.9rem; cursor:pointer; text-decoration:none; }
  a.btn:hover, button.btn:hover { background:rgba(240,165,0,.22); }
  a.btn.primary { background:linear-gradient(180deg,#ffc043,#e8940a); color:#1a1408; border:0; font-weight:700; }
  footer { margin-top:36px; color:var(--muted); font-size:.85rem; border-top:1px solid var(--line); padding-top:16px; }
  .note { font-size:.85rem; color:var(--muted); }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <span class="mark">₿</span>
    <span><strong>BitcoinButton</strong> <span class="note">/ entangleit-demo</span></span>
  </header>
  <span class="pill">Test page — payments + stream NFTs</span>
  <h1>EntangleIT demo</h1>
  <p class="sub">Live embed test for <code>stream=entangleit-live</code> → <code>richard.hein@entangleit.com</code>.
  Section 1 is the exact snippet from the request. Sections 2–3 are tip / mint / unlock variants so payments and NFTs can be tried side by side.</p>
  <div class="row">
    <a class="btn primary" href="https://entangleit.com/bitcoinbutton/embed/widget?amount=0.0001&to=richard.hein%40entangleit.com&action=pay&currency=BSV&label=Pay+with+Bitcoin&stream=entangleit-live&compact=1" target="_blank" rel="noreferrer">Open widget directly</a>
    <a class="btn" href="https://entangleit.com/bitcoinbutton/embed" target="_blank" rel="noreferrer">Embed docs</a>
    <a class="btn" href="https://bitcoinbutton.entangleit.com/bitcoinbutton/stream/genesis-live" target="_blank" rel="noreferrer">Sample stream room</a>
  </div>

  <div class="grid">
    <section class="card">
      <span class="tag">1 · Exact snippet (pay · 0.0001 BSV)</span>
      <h2>Pay with Bitcoin</h2>
      <p>The verbatim iframe from the request. If this charges, the rail is good.</p>
      ${EXACT_SNIPPET}
      <p class="note">src → entangleit.com/bitcoinbutton/embed/widget · action=pay · stream=entangleit-live</p>
    </section>

    <section class="card">
      <span class="tag">2 · Payments — tip variant</span>
      <h2>Tip the stream</h2>
      <p>Same payee/stream, <code>action=tip</code>, 0.001 BSV. Use to confirm tips land separately from pays.</p>
      ${iframeFor(tip)}
    </section>
  </div>

  <div class="grid two">
    <section class="card">
      <span class="tag">3a · NFT — mint</span>
      <h2>Mint stream NFT</h2>
      <p><code>action=mint</code> on <code>entangleit-live</code>. Tests the mint path for the live-video NFT.</p>
      ${iframeFor(mint, 220)}
    </section>
    <section class="card">
      <span class="tag">3b · NFT — unlock holder room</span>
      <h2>Unlock holder room</h2>
      <p><code>action=unlock</code>. Tests gated-room access after mint.</p>
      ${iframeFor(unlock, 220)}
    </section>
  </div>

  <div class="grid">
    <section class="card">
      <span class="tag">4 · Full-size (non-compact) pay button</span>
      <h2>Full layout</h2>
      <p>Same payment without <code>compact=1</code> — useful to compare embed sizing.</p>
      ${iframeFor(fullSize, 280)}
    </section>

    <section class="card">
      <span class="tag">Copy / paste</span>
      <h2>Embed code</h2>
      <p>Exact snippet embedded in section 1:</p>
      <pre><code id="snippet">${EXACT_SNIPPET.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
      <div class="row"><button class="btn" id="copy">Copy snippet</button></div>
    </section>
  </div>

  <footer>
    bitcoinbutton.entangleit.com/entangleit-demo · payee richard.hein@entangleit.com · stream entangleit-live ·
    widget served from entangleit.com/bitcoinbutton/embed/widget · actions: pay | tip | unlock | mint
  </footer>
</div>
<script>
document.getElementById('copy').addEventListener('click', async () => {
  const text = document.getElementById('snippet').textContent;
  try { await navigator.clipboard.writeText(text); } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
  const b = document.getElementById('copy');
  b.textContent = 'Copied ✓';
  setTimeout(() => b.textContent = 'Copy snippet', 1500);
});
window.addEventListener('message', (ev) => {
  if (ev && ev.data && ev.data.source === 'bitcoinbutton') console.log('[bitcoinbutton]', ev.data);
});
</script>
</body>
</html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Accept both hosts:
    //   bitcoinbutton.entangleit.com/entangleit-demo
    //   entangleit.com/bitcoinbutton/entangleit-demo
    let path = url.pathname.replace(/\/+$/, "") || "/";
    path = path.replace(/^\/bitcoinbutton(?=\/)/, "");
    if (path !== "/entangleit-demo") {
      return new Response("Not found — try /entangleit-demo", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
      });
    }
    return new Response(pageHtml(), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-demo": "bitcoinbutton-entangleit-demo",
      },
    });
  },
};
