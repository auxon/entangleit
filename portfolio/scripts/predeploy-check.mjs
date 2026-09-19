#!/usr/bin/env node
/**
 * Pre-deploy guard. Refuses to deploy a public/ that would serve blank pages.
 *
 * The Sep 2026 outage shipped a public/ with no JS bundle and no 404.html;
 * Cloudflare Pages' SPA fallback then served index.html for every path,
 * including the JS asset, and the site rendered blank with no alert.
 *
 * Pass --allow-missing-mounts to deploy the core site without product apps.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_MOUNTS, APP_MOUNTS, NESTED_MOUNTS } from "./site-mounts.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public");
const allowMissingMounts = process.argv.includes("--allow-missing-mounts");

const failures = [];
const warnings = [];

const CORE_FILES = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "manifest.json",
];
for (const file of CORE_FILES) {
  if (!existsSync(join(outDir, file))) failures.push(`missing ${file}`);
}

const indexPath = join(outDir, "index.html");
const indexHtml = existsSync(indexPath) ? readFileSync(indexPath, "utf8") : "";
const refs = [...indexHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
if (!refs.length) failures.push("index.html references no /assets/ files");
for (const ref of refs) {
  const clean = ref.split("?")[0];
  if (!existsSync(join(outDir, clean))) {
    failures.push(`index.html references ${ref} but ${clean} is missing`);
  }
}

const workerPath = join(outDir, "_worker.js");
if (!existsSync(workerPath)) {
  failures.push("missing _worker.js (SPA routing + edge SEO)");
} else if (!readFileSync(workerPath, "utf8").includes('"routes":[')) {
  failures.push("_worker.js has no injected SEO map (run build-content)");
}

const missingMounts = APP_MOUNTS.filter((m) => !existsSync(join(outDir, m, "index.html")));
const missingNested = NESTED_MOUNTS.filter((m) => !existsSync(join(outDir, m)));
if (missingMounts.length && !allowMissingMounts) {
  failures.push(
    `missing product mounts: ${missingMounts.join(", ")} ` +
      "(run build:pages where the sibling repos live, or pass --allow-missing-mounts)",
  );
} else if (missingMounts.length) {
  warnings.push(`deploying without product mounts: ${missingMounts.join(", ")}`);
}
if (missingNested.length) {
  warnings.push(`missing nested mounts: ${missingNested.join(", ")}`);
}

for (const warning of warnings) console.warn(`check: warning: ${warning}`);
if (failures.length) {
  console.error("check: FAILED — refusing to deploy:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
const present = ALL_MOUNTS.length - missingMounts.length - missingNested.length;
console.log(
  `check: OK — ${CORE_FILES.length} core files, ${refs.length} referenced assets, ` +
    `_worker.js, ${present}/${ALL_MOUNTS.length} mounts`,
);
