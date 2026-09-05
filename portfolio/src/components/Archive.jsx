import React from 'react'
import { archiveProjects, secondaryProjects } from '../site'

export default function Archive() {
  return (
    <section id="projects" className="section">
      <div className="section-inner wide">
        <h2 className="section-title">Also shipping</h2>
        <p className="section-lead">
          Older product surfaces. The money stack is on the homepage.
        </p>
        <div className="secondary-row">
          {secondaryProjects.map((project) => (
            <a key={project.name} href={project.href} className="secondary-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span>Open →</span>
            </a>
          ))}
        </div>

        <h3 className="subsection-title">Archive</h3>
        <div className="projects-grid">
          {archiveProjects.map((proj) => (
            <article key={proj.name} className="project-card">
              <h3>{proj.name}</h3>
              <p>{proj.description}</p>
              <div className="project-tech">
                {proj.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {(proj.link || proj.repo) && (
                <div className="project-links">
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      {proj.repo ? 'Live Demo →' : 'View →'}
                    </a>
                  )}
                  {proj.repo && (
                    <a
                      href={proj.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
