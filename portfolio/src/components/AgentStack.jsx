import React from 'react'
import { AGENT_STACK } from '../site'

export default function AgentStack() {
  return (
    <section id="stack" className="stack-section" aria-labelledby="stack-label">
      <div className="section-inner">
        <p id="stack-label" className="stack-label">
          Agent Economy Stack — what&rsquo;s in the $750 install
        </p>
        <ol className="stack-flow">
          {AGENT_STACK.map((step, index) => (
            <li key={step.name} className="stack-step">
              {index > 0 && (
                <span className="stack-arrow" aria-hidden="true">
                  →
                </span>
              )}
              <a className="stack-card" href={step.href}>
                <strong>{step.name}</strong>
                <span>{step.role}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
