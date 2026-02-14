# Richard Hein - Portfolio

A React portfolio website for Richard Hein, Senior AI Engineer and Founder at EntangleIT Inc.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in the `dist/` directory.

## Deploy to Cloudflare Pages

### Option 1: Git integration (recommended)

1. Push this project to a GitHub or GitLab repository
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create application → Pages → Connect to Git
3. Select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `portfolio` (if repo root is above this folder)
5. Deploy

### Option 2: Wrangler CLI

```bash
npm install -g wrangler
npx wrangler pages project create richard-hein-portfolio
npm run build
npx wrangler pages deploy dist --project-name=richard-hein-portfolio
```

### Option 3: Direct upload

Build the project and upload the `dist` folder via the Cloudflare Pages dashboard.
