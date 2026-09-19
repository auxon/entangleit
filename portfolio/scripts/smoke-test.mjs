#!/usr/bin/env node
/**
 * Post-deploy smoke test / uptime monitor for entangleit.com.
 *
 * Catches the Sep 2026 outage class: a deploy that serves index.html (200)
 * for every path — including the JS bundle — so React never mounts and the
 * site renders blank. Asserts status codes, content types, that the bundle
 * is real JavaScript, that unknown paths are real 404s, and that product
 * mounts are reachable.
 *
 * Usage:
 *   node scripts/smoke-test.mjs [--url https://entangleit.com]
 *                               [--retries 2] [--retry-delay 5000]
 *
 * Exit 0 when all checks pass, 1 otherwise.
 */
const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = arg("url", "https://entangleit.com").replace(/\/+$/, "");
const RETRIES = Number(arg("retries", "2"));
const RETRY_DELAY = Number(arg("retry-delay", "5000"));

const MOUNTS = [
  "agentpay",
  "x402market",
  "ASLTutor",
  "pocketpets",
  "gachago",
  "bitcoinzip",
  "bittok",
  "vibecoded",
  "wot",
];

async function get(path) {
  const res = await fetch(BASE + path, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "entangleit-smoke-test" },
  });
  const body = await res.text();
  return {
    status: res.status,
    contentType: res.headers.get("content-type") || "",
    body,
    bytes: Buffer.byteLength(body),
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runSuite() {
  const results = [];
  const check = async (name, fn) => {
    try {
      results.push({ name, ok: true, detail: await fn() });
    } catch (error) {
      results.push({ name, ok: false, detail: error.message });
    }
  };

  let jsRef = null;

  await check("homepage", async () => {
    const res = await get("/");
    assert(res.status === 200, `status ${res.status}`);
    assert(res.contentType.includes("text/html"), `content-type ${res.contentType}`);
    assert(res.body.includes('id="root"'), "no #root mount point");
    const js = res.body.match(/src="(\/assets\/[^"]+\.js[^"]*)"/);
    assert(js, "no /assets/*.js script tag");
    jsRef = js[1];
    return `200 text/html ${res.bytes}B`;
  });

  await check("js bundle", async () => {
    assert(jsRef, "skipped: homepage exposed no JS bundle");
    const res = await get(jsRef);
    assert(res.status === 200, `status ${res.status}`);
    assert(res.contentType.includes("javascript"), `content-type ${res.contentType} (SPA fallback?)`);
    assert(res.bytes > 10000, `only ${res.bytes}B`);
    assert(!/^\s*(<!doctype|<html)/i.test(res.body), "served HTML instead of JavaScript (SPA fallback)");
    return `${jsRef} 200 ${res.contentType} ${res.bytes}B`;
  });

  await check("about page", async () => {
    const res = await get("/about/");
    assert(res.status === 200, `status ${res.status}`);
    assert(res.contentType.includes("text/html"), `content-type ${res.contentType}`);
    assert(res.bytes > 2000, `only ${res.bytes}B`);
    return `200 text/html ${res.bytes}B`;
  });

  await check("real 404s", async () => {
    const res = await get("/definitely-not-a-real-path-xyz");
    assert(res.status === 404, `status ${res.status} (soft 404 / SPA fallback?)`);
    return "404 for unknown paths";
  });

  await check("robots.txt", async () => {
    const res = await get("/robots.txt");
    assert(res.status === 200, `status ${res.status}`);
    assert(res.contentType.includes("text/plain"), `content-type ${res.contentType}`);
    assert(res.body.includes("Sitemap"), "no Sitemap directive");
    return `200 text/plain ${res.bytes}B`;
  });

  await check("sitemap.xml", async () => {
    const res = await get("/sitemap.xml");
    assert(res.status === 200, `status ${res.status}`);
    assert(res.body.includes("<urlset"), "not a urlset sitemap");
    return `200 ${res.bytes}B`;
  });

  await check("manifest.json", async () => {
    const res = await get("/manifest.json");
    assert(res.status === 200, `status ${res.status}`);
    const parsed = JSON.parse(res.body);
    assert(parsed.start_url, "no start_url");
    return `200 start_url ${parsed.start_url}`;
  });

  await check("privacy policy", async () => {
    const res = await get("/privacy.html");
    assert(res.status === 200, `status ${res.status} (redirect or missing?)`);
    assert(res.contentType.includes("text/html"), `content-type ${res.contentType}`);
    assert(res.body.includes("Privacy Policy"), "no policy content");
    return `200 text/html ${res.bytes}B`;
  });

  for (const mount of MOUNTS) {
    await check(`mount ${mount}`, async () => {
      const res = await get(`/${mount}/`);
      assert(res.status === 200, `status ${res.status}`);
      assert(res.contentType.includes("text/html"), `content-type ${res.contentType}`);
      return `200 text/html ${res.bytes}B`;
    });
  }

  return results;
}

let results = [];
for (let attempt = 1; attempt <= RETRIES + 1; attempt += 1) {
  console.log(`smoke: ${BASE} (attempt ${attempt}/${RETRIES + 1})`);
  results = await runSuite();
  if (results.every((r) => r.ok)) break;
  if (attempt <= RETRIES) {
    console.log(`smoke: failures, retrying in ${RETRY_DELAY}ms`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  }
}

for (const r of results) {
  console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? ` — ${r.detail}` : `: ${r.detail}`}`);
}
const failed = results.filter((r) => !r.ok);
console.log(
  `smoke: ${results.length - failed.length}/${results.length} checks passed${failed.length ? " — FAILED" : ""}`,
);
process.exit(failed.length ? 1 : 0);
