import React, { useRef, useState } from 'react'
import { MAILTO } from '../site'

const ENDPOINT = '/demo-audit'
const MAX_INPUT = 2000

const FIT_LABEL = {
  strong: 'Strong fit',
  borderline: 'Borderline fit',
  poor: 'Poor fit',
}

function AgentAvatar() {
  return (
    <span className="demo-avatar" aria-hidden="true">
      ✦
    </span>
  )
}

function QuestionsCard({ intro, questions }) {
  return (
    <div className="demo-agent-block">
      <div className="demo-msg-head">
        <AgentAvatar />
        <span>Audit agent</span>
      </div>
      {intro ? <p className="demo-text">{intro}</p> : null}
      <p className="demo-text demo-text-strong">Three quick questions:</p>
      <ol className="demo-questions">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ol>
    </div>
  )
}

function AuditCard({ audit }) {
  return (
    <div className="demo-agent-block demo-audit">
      <div className="demo-msg-head">
        <AgentAvatar />
        <span>Audit agent</span>
        <span className={`demo-fit demo-fit-${audit.fit || 'borderline'}`}>
          {FIT_LABEL[audit.fit] || 'Fit assessment'}
        </span>
      </div>
      <h3 className="demo-audit-title">The one workflow to automate first</h3>
      <p className="demo-text demo-text-strong">{audit.workflow}</p>
      <dl className="demo-audit-grid">
        {audit.why ? (
          <div>
            <dt>Why this one</dt>
            <dd>{audit.why}</dd>
          </div>
        ) : null}
        {audit.timeSaved ? (
          <div>
            <dt>Time back</dt>
            <dd>{audit.timeSaved}</dd>
          </div>
        ) : null}
        {audit.roiSketch ? (
          <div>
            <dt>ROI sketch</dt>
            <dd>{audit.roiSketch}</dd>
          </div>
        ) : null}
        {audit.fitReason ? (
          <div>
            <dt>Fit verdict</dt>
            <dd>{audit.fitReason}</dd>
          </div>
        ) : null}
        {audit.suggestedBuild ? (
          <div>
            <dt>The 14-day build</dt>
            <dd>{audit.suggestedBuild}</dd>
          </div>
        ) : null}
      </dl>
      <div className="demo-cta-row">
        <a className="btn btn-primary" href={MAILTO}>
          Book a 20-minute fit call
        </a>
        <a className="btn btn-secondary" href={MAILTO}>
          Book the $1,500 audit
        </a>
      </div>
    </div>
  )
}

export default function DemoAgent() {
  const [phase, setPhase] = useState('idle') // idle|asking|questions|auditing|audit|offline|error
  const [turns, setTurns] = useState([]) // display turns: {kind:'user'|'agent-text'|'questions'|'audit', ...}
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const logRef = useRef(null)

  const scrollDown = () => {
    requestAnimationFrame(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  async function callAgent(apiMessages) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages }),
    })
    if (res.status === 503) {
      const data = await res.json().catch(() => ({}))
      if (data.error === 'engine_offline') {
        setPhase('offline')
        return null
      }
    }
    if (res.status === 429) {
      throw new Error('Too many demo runs from this address today — the fit call has no rate limit.')
    }
    if (!res.ok) throw new Error(`The demo hit an error (HTTP ${res.status}). Try again in a moment.`)
    return res.json()
  }

  // apiMessages: [{role:'user'|'assistant', content}]
  async function runRound(apiMessages, userText) {
    setError('')
    const data = await callAgent(apiMessages)
    if (!data) return // offline handled
    if (data.type === 'questions' && Array.isArray(data.questions)) {
      setTurns((t) => [
        ...t,
        { kind: 'user', text: userText },
        { kind: 'questions', intro: data.intro || '', questions: data.questions.slice(0, 3) },
      ])
      setPhase('questions')
    } else if (data.type === 'audit' && data.workflow) {
      setTurns((t) => [...t, { kind: 'user', text: userText }, { kind: 'audit', audit: data }])
      setPhase('audit')
    } else if (data.type === 'text' && data.text) {
      setTurns((t) => [...t, { kind: 'user', text: userText }, { kind: 'agent-text', text: data.text }])
      setPhase(apiMessages.filter((m) => m.role === 'user').length >= 2 ? 'audit' : 'questions')
    } else {
      throw new Error('The demo returned something unexpected. Try again in a moment.')
    }
    setInput('')
    scrollDown()
  }

  async function submitFirst(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || phase === 'asking') return
    setPhase('asking')
    try {
      await runRound([{ role: 'user', content: text.slice(0, MAX_INPUT) }], text)
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
    scrollDown()
  }

  async function submitAnswers(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || phase === 'auditing') return
    // Rebuild the API history from display turns.
    const apiMessages = []
    for (const t of turns) {
      if (t.kind === 'user') apiMessages.push({ role: 'user', content: t.text.slice(0, MAX_INPUT) })
      else if (t.kind === 'questions')
        apiMessages.push({
          role: 'assistant',
          content: `Questions asked: ${(t.questions || []).join(' | ')}`,
        })
      else if (t.kind === 'agent-text')
        apiMessages.push({ role: 'assistant', content: t.text.slice(0, MAX_INPUT) })
    }
    apiMessages.push({ role: 'user', content: text.slice(0, MAX_INPUT) })
    setPhase('auditing')
    try {
      await runRound(apiMessages, text)
    } catch (err) {
      setError(err.message)
      setPhase('error')
    }
    scrollDown()
  }

  function reset() {
    setTurns([])
    setInput('')
    setError('')
    setPhase('idle')
  }

  const busy = phase === 'asking' || phase === 'auditing'
  const showInput = phase === 'idle' || phase === 'questions' || phase === 'error'

  return (
    <section className="section" aria-label="Live demo: mini automation audit">
      <div className="section-inner">
        <p className="section-kicker">04 / Try it</p>
        <h2 className="section-title">Don&rsquo;t take my word for it.</h2>
        <p className="section-lead">
          This page promised one useful agent — so here&rsquo;s a small one, live.
          Describe your business below, answer three questions, and get a mini
          automation audit: the single workflow an agent should take over first,
          with an ROI sketch. A taste of the $1,500 audit, free.
        </p>

        <div className="demo-shell">
          {phase === 'offline' ? (
            <div className="demo-offline">
              <p className="demo-text demo-text-strong">The live demo is taking a break.</p>
              <p className="demo-text">
                The human version has no downtime and no rate limit — a 20-minute
                fit call covers the same ground, with better questions.
              </p>
              <div className="demo-cta-row">
                <a className="btn btn-primary" href={MAILTO}>
                  Book a 20-minute fit call
                </a>
                <button className="btn btn-secondary" type="button" onClick={reset}>
                  Try the demo again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="demo-log" ref={logRef} aria-live="polite">
                {turns.length === 0 && phase === 'idle' ? (
                  <div className="demo-agent-block">
                    <div className="demo-msg-head">
                      <AgentAvatar />
                      <span>Audit agent</span>
                    </div>
                    <p className="demo-text">
                      Tell me about your business — what you do, team size, and
                      the repetitive work that eats everyone&rsquo;s time. The
                      more concrete, the sharper the audit.
                    </p>
                  </div>
                ) : null}
                {turns.map((t, i) => {
                  if (t.kind === 'user')
                    return (
                      <div key={i} className="demo-user-block">
                        <p className="demo-text">{t.text}</p>
                      </div>
                    )
                  if (t.kind === 'questions')
                    return <QuestionsCard key={i} intro={t.intro} questions={t.questions} />
                  if (t.kind === 'audit') return <AuditCard key={i} audit={t.audit} />
                  return (
                    <div key={i} className="demo-agent-block">
                      <div className="demo-msg-head">
                        <AgentAvatar />
                        <span>Audit agent</span>
                      </div>
                      <p className="demo-text">{t.text}</p>
                    </div>
                  )
                })}
                {busy ? (
                  <div className="demo-agent-block">
                    <div className="demo-msg-head">
                      <AgentAvatar />
                      <span>Audit agent</span>
                    </div>
                    <p className="demo-text demo-thinking">
                      <span className="demo-dot" />
                      <span className="demo-dot" />
                      <span className="demo-dot" />
                    </p>
                  </div>
                ) : null}
              </div>

              {error && phase === 'error' ? <p className="demo-error">{error}</p> : null}

              {showInput ? (
                <form
                  className="demo-form"
                  onSubmit={phase === 'questions' ? submitAnswers : submitFirst}
                >
                  <label className="demo-label" htmlFor="demo-input">
                    {phase === 'questions'
                      ? 'Answer the three questions above'
                      : 'Describe your business and its repetitive work'}
                  </label>
                  <textarea
                    id="demo-input"
                    className="demo-input"
                    rows={4}
                    maxLength={MAX_INPUT}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      phase === 'questions'
                        ? 'Answer each question — numbers and specifics help…'
                        : 'e.g. 12-person insurance brokerage. Our CSRs retype policy details from PDFs into the CRM, ~40 policies a week…'
                    }
                  />
                  <div className="demo-form-row">
                    <button className="btn btn-primary" type="submit" disabled={busy || !input.trim()}>
                      {phase === 'questions' ? 'Get my mini-audit' : 'Run the mini-audit'}
                    </button>
                    {turns.length > 0 ? (
                      <button className="demo-reset" type="button" onClick={reset}>
                        Start over
                      </button>
                    ) : null}
                    <span className="demo-hint">Free · ~30 seconds · nothing is stored</span>
                  </div>
                </form>
              ) : null}

              {phase === 'audit' ? (
                <div className="demo-form-row demo-after">
                  <button className="demo-reset" type="button" onClick={reset}>
                    Run it for another business
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
