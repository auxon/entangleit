# EntangleIT

Vite React SPA for [entangleit.com](https://entangleit.com). Homepage is products and CARD. Résumé, timeline, and older projects live on `/about`.

## Routes

- `/` — pain, CARD, $149 DIY, Leak, live proof grid
- `/about` — founder copy, experience, skills, archive
- `/resume.pdf` — static PDF (do not remove)
- `/og-card.png` — 1200×630 Open Graph / LinkedIn preview (product branding, no personal name)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build        # standalone: vite + content pages + worker SEO
npm run build:pages  # full pipeline: also rebuilds product mounts from sibling repos
```

Output is in the `public/` directory. `npm run build` preserves any product
app mounts already in `public/` (agentpay, ASLTutor, pocketpets, …) because
their sibling repos are not present on every machine. Run `build:pages` on a
machine that has all sibling repos to rebuild those mounts from source.

## Deploy to Cloudflare Pages

Wrangler CLI (the project is a direct-upload Pages project, not Git-integrated):

```bash
npm run deploy        # build + check + wrangler pages deploy
npm run deploy:pages  # full sibling-repo build + check + deploy
```

`npm run check` is the pre-deploy guard. It refuses to upload a `public/`
that is missing the JS bundle, `_worker.js`, `404.html`, or product mounts —
the failure mode that served blank pages in Sep 2026 (Pages' SPA fallback
served `index.html` for every path, including the JS asset). Bypass with
`npm run check -- --allow-missing-mounts` only when intentionally deploying
the core site without product apps.

Manual equivalent:

```bash
npm install -g wrangler
npm run build
npm run check
npx wrangler pages deploy public --project-name=richard-hein-portfolio
```

## Monitoring

`npm run smoke` checks the live site end to end: homepage, the JS bundle's
content type (the Sep 2026 outage served HTML for it), a real 404, robots /
sitemap / manifest, and every product mount. It runs automatically after
`npm run deploy` and `npm run deploy:pages`.

`.github/workflows/site-smoke.yml` runs the same checks every 15 minutes on
GitHub Actions. A failing scheduled run emails the user who last edited the
workflow's cron schedule, so a silent outage gets caught without watching
the site. Run it manually from the Actions tab ("Run workflow").
