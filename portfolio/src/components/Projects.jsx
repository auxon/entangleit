import React from 'react'

const projects = [
  {
    name: 'Memento',
    description: 'Git-controlled conversational AI system for EntangleIT',
    tech: ['Elixir', 'Phoenix', 'AI'],
    link: 'https://entangleit.com',
  },
  {
    name: 'Project Professor',
    description: 'LLM RAG Generative AI chatbot for digital publishing with multimodal chat',
    tech: ['Python', 'LangChain', 'vLLM', 'React'],
  },
  {
    name: 'MyMovies.us',
    description: 'Bitcoin micropayment integration for per-second video payments',
    tech: ['BSV', 'Handcash', 'Next.js'],
    link: 'https://mymovies.us',
  },
  {
    name: 'Swarms Agent AI',
    description: 'Open source Generative AI chatbot with RAG using Redis vector storage',
    tech: ['Python', 'Redis', 'RAG'],
  },
  {
    name: 'Roofstock AI Agents',
    description: 'AI conversation chat agents with Slack integration and knowledge base',
    tech: ['AI', 'Slack', 'Real Estate'],
    link: 'https://roofstock.com',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <h2 className="section-title">Notable Projects</h2>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <article key={i} className="project-card">
              <h3>{proj.name}</h3>
              <p>{proj.description}</p>
              <div className="project-tech">
                {proj.tech.map((t, j) => (
                  <span key={j}>{t}</span>
                ))}
              </div>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  View →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
