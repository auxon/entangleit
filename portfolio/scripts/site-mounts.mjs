/**
 * Product app mounts merged into public/ from sibling repos (or preserved
 * from a previous build). They are separate SPAs, not Vite output, so a
 * standalone build must not silently drop them.
 */
export const APP_MOUNTS = [
  "ASLTutor",
  "agentpay",
  "bitcoinzip",
  "bittok",
  "gachago",
  "vibecoded",
  "wot",
  "x402market",
  "pocketpets",
];

/** Mount paths nested inside a core output directory. */
export const NESTED_MOUNTS = ["assets/memes"];

export const ALL_MOUNTS = [...APP_MOUNTS, ...NESTED_MOUNTS];
