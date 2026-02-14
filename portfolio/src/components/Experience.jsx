import React from 'react'

const experiences = [
  {
    company: 'EntangleIT Inc',
    role: 'Founder',
    period: 'Mar 2017 – Present',
    location: 'Greater Ottawa',
    highlights: [
      'Full-stack software development, AI, and blockchain solutions since 1998',
      'Open source Generative AI chatbot with RAG for Swarms Agent AI framework',
      'P2P GPU marketplace, Memento (Git-controlled conversational AI), AI-powered inventory with AR',
      'Bitcoin micropayments for MyMovies.us, AI chat agents for Roofstock',
    ],
  },
  {
    company: 'Roofstock',
    role: 'Senior AI Engineer',
    period: 'Jan 2025 – May 2025',
    location: 'Ottawa',
    highlights: [
      'Generative AI software for real estate',
      'AI conversation chat agents with Slack and knowledge base integration',
    ],
  },
  {
    company: 'Cognilore Inc',
    role: 'Senior Full Stack Engineer, Generative AI Tech Lead',
    period: 'Sep 2021 – Feb 2024',
    location: 'Ontario',
    highlights: [
      'Lead developer on LLM RAG Generative AI chatbot "Project Professor"',
      'Multimodal chat with large-context digital publications',
      'Tech stack: Python, LangChain, vLLM, ChromaDB, React, LangGraph, MemGPT',
    ],
  },
  {
    company: 'Sitecore',
    role: 'Senior Full Stack Engineer',
    period: 'Nov 2013 – Dec 2016',
    location: 'Gatineau',
    highlights: [
      'Sitecore Commerce Server, AWS/Azure cloud deployments',
      'CoreXT to MSBuild migration, build times from hours to 7 minutes',
    ],
  },
  {
    company: 'TrialStat Corporation',
    role: 'Senior .NET Developer',
    period: 'Sep 2005 – Mar 2007',
    location: 'Ottawa',
    highlights: [
      'Field-level cryptographic system for clinical trial data (Health Canada contracts)',
      'Patent: Method of and System for Security and Privacy Protection in Medical Forms',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section-inner">
        <h2 className="section-title">Experience</h2>
        <div className="timeline">
          {experiences.map((exp, i) => (
            <article key={i} className="timeline-item">
              <div className="timeline-marker" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{exp.role} · {exp.company}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <p className="timeline-location">{exp.location}</p>
                <ul>
                  {exp.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
