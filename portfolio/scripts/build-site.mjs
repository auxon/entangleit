#!/usr/bin/env node
/**
 * Standalone site build: vite build + content pages + worker SEO injection.
 *
 * Unlike raw `vite build` (which empties public/), this preserves product app
 * mounts already in public/ (agentpay, ASLTutor, ...) that come from sibling
 * repos not present on every machine. `build:pages` remains the full pipeline
 * when those repos are available.
 *
 * A pre-deploy guard (scripts/predeploy-check.mjs) verifies the result.
 */
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { ALL_MOUNTS } from "./site-mounts.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const outDir = join(root, "public");
const preserveDir = join(root, ".mounts-preserve");

function move(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  renameSync(from, to);
}

function restoreAll() {
  for (const mount of ALL_MOUNTS) {
    const cached = join(preserveDir, mount);
    if (!existsSync(cached)) continue;
    const dest = join(outDir, mount);
    if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
    move(cached, dest);
  }
  rmSync(preserveDir, { recursive: true, force: true });
}

// Crash recovery: restore anything an interrupted previous run left behind.
if (existsSync(preserveDir)) {
  console.log("build-site: restoring mounts left by an interrupted build");
  restoreAll();
}

const preserved = [];
for (const mount of ALL_MOUNTS) {
  const src = join(outDir, mount);
  if (!existsSync(src)) continue;
  move(src, join(preserveDir, mount));
  preserved.push(mount);
}
if (preserved.length) {
  console.log(`build-site: preserving ${preserved.length} mounts (${preserved.join(", ")})`);
}

try {
  execFileSync("npx", ["vite", "build"], { cwd: root, stdio: "inherit" });
  restoreAll();
  execFileSync("node", ["scripts/build-content.mjs"], { cwd: root, stdio: "inherit" });
} catch (error) {
  if (existsSync(preserveDir)) {
    console.error("build-site: build failed, restoring preserved mounts");
    restoreAll();
  }
  throw error;
}
