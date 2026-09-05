# EntangleIT

Vite React SPA for [entangleit.com](https://entangleit.com). Homepage is products and CARD. Résumé, timeline, and older projects live on `/about`.

## Routes

- `/` — pain, CARD, $149 DIY, Leak, live proof grid
- `/about` — founder copy, experience, skills, archive
- `/resume.pdf` — static PDF (do not remove)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in the `public/` directory.

## Deploy to Cloudflare Pages

### Option 1: Git integration (recommended)

1. Push this project to a GitHub or GitLab repository
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create application → Pages → Connect to Git
3. Select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `public` (or leave blank — Cloudflare often defaults to `public`)
   - **Root directory:** `portfolio` (if repo root is above this folder)
5. Deploy

### Option 2: Wrangler CLI

```bash
npm install -g wrangler
npx wrangler pages project create richard-hein-portfolio
npm run build
npx wrangler pages deploy public --project-name=richard-hein-portfolio
```

### Option 3: Direct upload

Build the project and upload the `public` folder via the Cloudflare Pages dashboard.
