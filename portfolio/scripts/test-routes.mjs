#!/usr/bin/env node
/**
 * Guardrails for the homepage + /pay change: SPA owns /pay,
 * product mounts like /hsci stay out of the portfolio fallback,
 * and marketing copy must not use the word "bank".
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizePath } from "../src/route.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const failures = [];
const assert = (ok, message) => {
  if (!ok) failures.push(message);
};

assert(normalizePath("/pay/") === "/pay", "normalizePath(/pay/) should be /pay");
assert(normalizePath("/pay") === "/pay", "normalizePath(/pay) should be /pay");
assert(normalizePath("/hsci/") === "/hsci", "normalizePath(/hsci/) should be /hsci");

const worker = readFileSync(join(root, "static/_worker.js"), "utf8");
assert(worker.includes('"/pay"') && worker.includes('"/pay/"'), "worker PORTFOLIO must include /pay");
assert(!/PORTFOLIO[\s\S]*?"\/hsci"/.test(worker) || !worker.includes('"/hsci"'), "worker must not SPA-own /hsci");
assert(!worker.includes('"/hsci"'), "worker must not special-case /hsci (asset mount stays first)");
assert(!worker.includes('"/peekaroom"'), "worker must not special-case /peekaroom (asset mount stays first)");

const site = readFileSync(join(root, "src/site.js"), "utf8");
assert(
  site.includes("mailto:rah@entangleit.com?subject=%24750%20agent%20install"),
  "INSTALL_MAILTO must be the $750 install mailto, not Stripe Checkout",
);

const hero = readFileSync(join(root, "src/components/Offer.jsx"), "utf8");
assert(hero.includes("Your agent takes money without you in the loop."), "hero headline missing");
assert(hero.includes("Book a $750 / 48h install"), "hero CTA missing");
assert(hero.includes("mailto:rah@entangleit.com?subject=%24750%20agent%20install") || hero.includes("INSTALL_MAILTO"), "install mailto missing");
assert(hero.includes("Demo"), "Demo link missing");
assert(hero.includes("PAY_PATH"), "Demo should point at /pay");
assert(!/hsci/i.test(hero) && !/peekaroom/i.test(hero), "HSCI/PeekARoom must stay off the hero");
assert(hero.includes("entangleit-logo") || hero.includes("LOGO"), "hero must use the fractal-brain logo");
assert(hero.includes("ReceiptMirror receipts +$99"), "pricing line missing");

const pay = readFileSync(join(root, "src/components/Pay.jsx"), "utf8");
assert(pay.includes("Human pays the deposit. Agent proves the receipt."), "pay heading missing");
assert(!/fetch\(|sk_live|sk_test|Stripe\(/i.test(pay), "pay page must stay a static demo");

const scanned = [
  "src/components/Offer.jsx",
  "src/components/Pay.jsx",
  "src/site.js",
  "src/App.jsx",
  "src/route.js",
  "scripts/seo.mjs",
  "index.html",
];
for (const file of scanned) {
  const text = readFileSync(join(root, file), "utf8");
  if (/\bbank\b/i.test(text)) failures.push(`${file} contains the word bank`);
}

if (failures.length) {
  console.error("test-routes: FAILED");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("test-routes: OK — /pay is an SPA route, /hsci stays a mount, no bank");
