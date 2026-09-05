export const EMAIL = 'richard.hein@gmail.com'
export const MAILTO = `mailto:${EMAIL}`
export const LINKEDIN = 'https://www.linkedin.com/in/richardhein/'
export const DIY_KIT = 'https://richardheinz.gumroad.com/l/yycmri'
export const RESUME = '/resume.pdf'
export const YEARS = 28

export const TITLE = 'Founder · EntangleIT'

export const offers = [
  {
    id: 'install',
    price: '$750',
    name: '48-hour install',
    summary: 'WitnessCam or SignFlow on your Cloudflare account. Checkout and webhooks live in 48 hours.',
  },
  {
    id: 'week',
    price: '$2,500',
    name: 'Custom CF + Stripe week',
    summary: 'Workers, Checkout, webhooks, Durable Objects if you need them. One week, one owner.',
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
    name: 'Leak',
    lead: true,
    badge: 'Free diagnosis',
    description:
      'Failed deliveries, disabled endpoints, missing events, past-due subs — replay in one click.',
    tech: ['Cloudflare Workers', 'Stripe webhooks', 'Durable Objects'],
    href: '/leak/',
  },
  {
    name: 'WitnessCam',
    description:
      'Record. Encrypt on-device. Hash. Timestamp. Transfer custody like a lab sample.',
    tech: ['Workers', 'Stripe Checkout', 'WebCrypto'],
    href: '/witnesscam/',
  },
  {
    name: 'SignFlow Talk',
    description:
      'ASL in the browser — interactive 3D hands, camera practice, and Talk.',
    tech: ['React', 'Three.js', 'MediaPipe'],
    href: '/ASLTutor/talk',
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
    link: 'https://entangleit.com/factoryforge',
    repo: 'https://github.com/auxon/factoryforge',
  },
  {
    name: 'Rosetta Stone of Guitar',
    description:
      'Native iOS app teaching the Rosetta Stone of Guitar method via interactive fretboard visualization, pattern recognition, and audio playback.',
    tech: ['Swift', 'SwiftUI', 'iOS', 'StoreKit'],
    link: 'https://entangleit.com/rosettaStoneOfGuitar',
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
