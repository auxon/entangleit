export const EMAIL = 'richard.hein@gmail.com'
export const MAILTO = `mailto:${EMAIL}`
export const INSTALL_MAILTO =
  'mailto:rah@entangleit.com?subject=%24750%20agent%20install'
export const LINKEDIN = 'https://www.linkedin.com/in/richardhein/'
export const DIY_KIT = 'https://richardheinz.gumroad.com/l/yycmri'
export const RESUME = '/resume.pdf'
export const YEARS = 28

export const TITLE = 'Founder · EntangleIT'

export const SITE_TITLE = 'EntangleIT — Your agent takes money without you in the loop'
export const SITE_DESCRIPTION =
  'A $750 / 48h agent install: prepaid wallets, x402 charges, tool discovery, and bounties. $2,500 / 7-day custom MVP. ReceiptMirror receipts +$99.'
export const PAY_PATH = '/pay'
export const PAY_TITLE = 'Human pays the deposit. Agent proves the receipt. — EntangleIT'
export const PAY_DESCRIPTION =
  'Stripe-for-agents demo: a human pays the deposit by card; the agent pays and proves the spend with an x402 receipt. Static walkthrough only.'
export const LOGO = '/entangleit-logo.png'
export const LOGO_HERO = '/entangleit-logo-512.webp'

export const STACK_STRIP = [
  { name: 'agentpay', role: 'wallet' },
  { name: 'x402', role: 'charge' },
  { name: 'x402market', role: 'find tools' },
  { name: 'bounties', role: 'get paid' },
]

export const MIGRATION_PATH = '/cloudflare-migration'
export const MIGRATION_TITLE = 'Cloudflare migration — EntangleIT'
export const MIGRATION_DESCRIPTION =
  'Done-for-you Cloudflare migrations for small and mid-size companies. Move apps, APIs, and sites off AWS, Vercel, Heroku, or traditional hosting onto Workers, Pages, D1, R2, KV, Durable Objects, Queues, and Workers AI. Assessment starting at $499.'
export const MIGRATION_MAILTO = `${MAILTO}?subject=${encodeURIComponent(
  'EntangleIT — Book a free Cloudflare migration assessment',
)}`

/** Starting-at prices — edit here; pages and the contact form read this list. */
export const migrationPackages = [
  {
    id: 'cf-assessment',
    name: 'Migration Assessment',
    price: 'Starting at $499',
    priceNote: 'Fixed fee',
    summary:
      'Audit the current stack, compare hosting cost, and leave with a written migration plan.',
    includes: [
      'Current stack, traffic, and dependency review',
      'Cloudflare target architecture sketch',
      'Cost comparison vs AWS, Vercel, Heroku, or the current host',
      'Phased plan with risks and rollback notes',
    ],
  },
  {
    id: 'cf-standard',
    name: 'Standard Migration',
    price: 'Starting at $2,000',
    priceNote: 'One app, API, or site',
    summary: 'One app, API, or site moved, tested, and cut over — with a rollback plan.',
    includes: [
      'One application, API, or site',
      'Deployed to Workers, Pages, or the fitting Cloudflare product',
      'Functional testing before cutover',
      'DNS or traffic cutover with a documented rollback plan',
    ],
  },
  {
    id: 'cf-full',
    name: 'Full Migration',
    price: 'Starting at $6,000+',
    priceNote: 'Multi-service',
    summary: 'Multi-service move: databases, object storage, CI/CD, and monitoring on Cloudflare.',
    includes: [
      'Multiple apps or services',
      'Data stores (D1, KV, R2, Durable Objects) where they fit',
      'CI/CD and monitoring wired up',
      'Staged cutover with rollback',
    ],
  },
  {
    id: 'cf-care',
    name: 'Monthly care plan',
    price: 'Optional retainer',
    priceNote: 'After cutover',
    summary:
      'Monitoring, dependency updates, and a named contact. Scoped to the workload after handoff.',
    includes: [
      'Runtime and uptime checks',
      'Dependency and platform updates',
      'A named contact for incidents',
    ],
    optional: true,
  },
]

export const migrationProcess = [
  { when: '01', what: 'Free 20-minute call', detail: 'Fit, scope, and whether a move is worth it.' },
  { when: '02', what: 'Assessment', detail: 'Stack audit, cost comparison, written plan.' },
  { when: '03', what: 'Migration', detail: 'Build and test the Cloudflare target in parallel.' },
  { when: '04', what: 'Cutover with rollback', detail: 'DNS or traffic switch, with a way back.' },
  { when: '05', what: 'Handoff and docs', detail: 'Runbook, accounts you own, optional care plan.' },
]

export const migrationPlatform = [
  'Workers',
  'Pages',
  'D1',
  'R2',
  'KV',
  'Durable Objects',
  'Queues',
  'Workers AI',
]

/** Live Cloudflare-hosted products already on this origin — no invented clients. */
export const migrationProof = [
  {
    name: 'agentpay',
    href: '/agentpay/',
    note: 'Prepaid agent wallets on Cloudflare Workers',
  },
  {
    name: 'x402 Gateway',
    href: '/x402gateway',
    note: 'Hosted pay-per-call API gateway on Workers',
  },
  {
    name: 'x402market',
    href: '/x402market/',
    note: 'Paid API registry on Workers',
  },
  {
    name: 'BSVBounties',
    href: '/bsvbounties/',
    note: 'Escrow job board on Workers',
  },
  {
    name: 'Brainstorm',
    href: '/brainstorm/',
    note: 'Shared idea boards on Workers and Durable Objects',
  },
  {
    name: 'Leak',
    href: '/leak/',
    note: 'Webhook diagnosis on Workers and Durable Objects',
  },
]

export const offers = [
  {
    id: 'agent-build',
    price: 'from $12,500',
    name: 'Production agent build',
    summary:
      'A focused engagement from discovery through production — one useful AI agent on your data and workflows, live in 14 days. Fixed price, you own everything.',
  },
  {
    id: 'audit',
    price: '$1,500',
    name: 'AI Opportunity Audit',
    summary:
      'A 90-minute working session finding the 3 places an AI agent pays for itself in your business, with a written report. Credited in full toward a build.',
  },
]

export const liveProducts = [
  {
    name: 'agentpay',
    lead: true,
    badge: 'Agent wallets',
    description:
      'Card-funded prepaid wallets for AI agents — scoped keys, budgets, sub-agents, approval gates, alerts, and BSV x402 payments over MCP.',
    tech: ['Cloudflare Workers', 'Stripe', 'BSV x402', 'MCP'],
    href: '/agentpay/',
  },
  {
    name: 'x402 Gateway',
    badge: 'New',
    description:
      'Point it at any upstream API, set sats prices, and get a hosted pay-per-call endpoint — with analytics, public dashboards, and auto-listing in x402market.',
    tech: ['Cloudflare Workers', 'x402', 'BSV', 'Stripe'],
    href: '/x402gateway',
  },
  {
    name: 'bsvOS',
    badge: 'Open source',
    description:
      'An operating system with a built-in wallet: OS-level custody, per-origin spending policy, and agent sub-wallets with budgets — apps and agents transact without ever touching keys.',
    tech: ['Omarchy Linux', 'BRC-100', 'BSV', 'MCP'],
    href: '/bsvos/',
  },
  {
    name: 'x402market',
    description:
      'Registry of pay-per-call APIs for agents — discover sellers, pull live 402 quotes, pay per call with receipts.',
    tech: ['Cloudflare Workers', 'x402', 'BSV'],
    href: '/x402market/',
  },
  {
    name: 'BSV Wallets',
    description:
      'A strict x402 facilitator plus 23 pay-per-call tools: image resize, fetch proxy, timestamping, QR, broadcast relay, screenshots, and chain data.',
    tech: ['Cloudflare Workers', 'BSV', 'ARC', 'x402'],
    href: '/bsv-wallets',
  },
  {
    name: 'UsenetBSV',
    badge: 'New',
    description:
      'Newsgroups where every action settles in sats — pay-to-post, pay-to-read, hash anchors, and a public NNTP gateway for classic readers.',
    tech: ['Cloudflare Workers', 'x402', 'BSV', 'NNTP'],
    href: '/usenetbsv',
  },
  {
    name: 'Brainstorm',
    description:
      'Idea boards humans and agents share — nested ideas, votes, exports, BSV-paid tools, and 1Sat NFT mints.',
    tech: ['Cloudflare Workers', 'Durable Objects', 'Stripe', 'BSV'],
    href: '/brainstorm/',
  },
  {
    name: 'Leak',
    badge: 'Free diagnosis',
    description:
      'Failed deliveries, disabled endpoints, missing events, past-due subs — replay in one click.',
    tech: ['Cloudflare Workers', 'Stripe webhooks', 'Durable Objects'],
    href: '/leak/',
  },
  {
    name: 'WitnessCam',
    description: 'Record. Encrypt on-device. Hash. Timestamp. Transfer custody like a lab sample.',
    tech: ['Workers', 'Stripe Checkout', 'WebCrypto'],
    href: '/witnesscam/',
  },
  {
    name: 'PeekARoom',
    description:
      'One-way webcam peek rooms. Host a camera, share a link, unlock with a free 15s peek, a tip, or Pass.',
    tech: ['Workers', 'Stripe', 'WebRTC'],
    href: '/peekaroom/',
  },
  {
    name: 'BSVBounties',
    description:
      'Bounties with BSV escrow or Stripe card funding. Humans and agents. Sealed proof via WitnessCam.',
    tech: ['BSV', 'Stripe Checkout', 'Workers'],
    href: '/bsvbounties/',
  },
  {
    name: 'SignFlow Talk',
    description: 'ASL in the browser — interactive 3D hands, camera practice, and Talk.',
    tech: ['React', 'Three.js', 'MediaPipe'],
    href: '/ASLTutor/talk',
  },
]

export const secondaryProjects = [
  {
    name: 'ASL Tutor',
    description: 'Learn American Sign Language with 3D hands, structured lessons, and camera practice.',
    href: '/ASLTutor/',
  },
  {
    name: 'Wheel of Time',
    description: 'Browser MMO — the Wheel weaves as the Wheel wills.',
    href: '/wot/',
  },
  {
    name: 'GatchaGo',
    description: 'Draw, customize, and animate chibi characters.',
    href: '/gachago',
  },
]

export const archiveProjects = [
  {
    name: 'FactoryForge',
    description:
      'Factorio-inspired iOS factory automation game with AI-driven factory management, from basic mining to full rocket production.',
    tech: ['Swift', 'iOS', 'AI', 'Node.js'],
    repo: 'https://github.com/auxon/factoryforge',
  },
  {
    name: 'Rosetta Stone of Guitar',
    description:
      'Native iOS app teaching the Rosetta Stone of Guitar method via interactive fretboard visualization, pattern recognition, and audio playback.',
    tech: ['Swift', 'SwiftUI', 'iOS', 'StoreKit'],
    repo: 'https://github.com/auxon/rosettastoneofguitar',
  },
  {
    name: 'MyMovies.us',
    description: 'Bitcoin micropayment integration for per-second video payments.',
    tech: ['BSV', 'Handcash', 'Next.js'],
    link: 'https://mymovies.us',
  },
  {
    name: 'Swarms Agent AI',
    description: 'Open source Generative AI chatbot with RAG using Redis vector storage.',
    tech: ['Python', 'Redis', 'RAG'],
  },
  {
    name: 'Roofstock AI Agents',
    description: 'AI conversation chat agents with Slack integration and knowledge base.',
    tech: ['AI', 'Slack', 'Real Estate'],
    link: 'https://roofstock.com',
  },
  {
    name: 'Memento',
    description: 'Git-controlled conversational AI system for EntangleIT.',
    tech: ['Elixir', 'Phoenix', 'AI'],
  },
  {
    name: 'Project Professor',
    description: 'LLM RAG Generative AI chatbot for digital publishing with multimodal chat.',
    tech: ['Python', 'LangChain', 'vLLM', 'React'],
  },
]
