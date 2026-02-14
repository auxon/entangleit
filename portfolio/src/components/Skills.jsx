import React from 'react'

const skillCategories = [
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
      'Electron', 'ShadCN', 'v0.dev',
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    skills: ['AWS', 'Azure', 'Docker', 'Linux', 'CI/CD'],
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
          {skillCategories.map((cat, i) => (
            <div key={i} className="skill-category">
              <h3>{cat.title}</h3>
              <div className="skill-tags">
                {cat.skills.map((skill, j) => (
                  <span key={j} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
