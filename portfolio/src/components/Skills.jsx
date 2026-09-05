import React from 'react'

const skillCategories = [
  {
    title: 'Cloudflare & Payments',
    skills: [
      'Cloudflare Workers',
      'Durable Objects',
      'Stripe Checkout',
      'Stripe webhooks',
      'Vite',
    ],
  },
  {
    title: 'AI & Machine Learning',
    skills: [
      'LLM & RAG', 'LangChain', 'LangGraph', 'vLLM', 'ChromaDB',
      'Generative AI', 'MemGPT', 'Autogen', 'Stable Diffusion',
    ],
  },
  {
    title: 'Languages & Frameworks',
    skills: [
      'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js',
      'Elixir', 'Phoenix LiveView', 'C#', '.NET', 'Swift',
      'Electron', 'ShadCN', 'v0.dev', 'Vite',
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    skills: ['Cloudflare Workers', 'AWS', 'Azure', 'Docker', 'Linux', 'CI/CD'],
  },
  {
    title: 'Blockchain & Security',
    skills: ['Bitcoin', 'BSV', 'Hyperledger', 'Ethereum', 'Cryptography'],
  },
  {
    title: 'Data & Backend',
    skills: ['SQL Server', 'SQLite', 'Redis', 'ChromaDB'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section-inner">
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {skillCategories.map((cat) => (
            <div key={cat.title} className="skill-category">
              <h3>{cat.title}</h3>
              <div className="skill-tags">
                {cat.skills.map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
