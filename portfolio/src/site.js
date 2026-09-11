export const EMAIL = 'richard.hein@gmail.com'
export const MAILTO = `mailto:${EMAIL}`
export const LINKEDIN = 'https://www.linkedin.com/in/richardhein/'
export const DIY_KIT = 'https://richardheinz.gumroad.com/l/yycmri'
export const RESUME = '/resume.pdf'
export const YEARS = 28

export const TITLE = 'Founder · EntangleIT'

export const SITE_TITLE = 'EntangleIT — Software for an agent economy'
export const SITE_DESCRIPTION =
  'An agent-first software factory: prepaid agent wallets, pay-per-call APIs, discovery markets, gateways, and MCP tools — live on Cloudflare, Stripe, and Bitcoin SV.'

export const offers = [
  {
    id: 'agent-api',
    price: '$750',
    name: 'Agent-ready API in 48 hours',
    summary:
      'We wrap your API as a paid x402 endpoint on our Gateway — sats pricing, wallet-compatible, listed in x402market, plus an MCP tool so agents can call it.',
  },
  {
    id: 'factory-week',
    price: '$2,500',
    name: 'Software factory week',
    summary:
      'One week, one owner: an agent-first product from idea to live — Workers, Stripe, BSV x402, MCP, dashboards, and the deploys.',
  },
  {
    id: 'diy',
    price: '$149',
    name: 'DIY Go-Live Kit',
    summary: 'Worker · Checkout · Webhook · go live. You run it.',
    href: DIY_KIT,
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
