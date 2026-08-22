import { Link } from 'react-router-dom';

const FEATURES = [
  {
    num: '01',
    title: 'Project archive',
    desc: 'Each project gets its own space — overview, links, tech stack, and a full chronological update log.',
  },
  {
    num: '02',
    title: 'Structured updates',
    desc: 'Write rich update entries with milestones, blockers, decisions, and learnings — not just commit messages.',
  },
  {
    num: '03',
    title: 'Public by default',
    desc: 'Your profile is a permanent URL. Share it. Let your work speak through documented progress over time.',
  },
];

const EXAMPLE_UPDATES = [
  {
    date: '14 May 2025',
    title: 'Auth system refactored to JWT + refresh tokens',
    preview:
      'Moved away from session-based auth. The refresh token flow is clean now — storing in httpOnly cookie, access token in memory only.',
    tag: 'milestone',
  },
  {
    date: '8 May 2025',
    title: 'Blocked: CORS issues with production proxy',
    preview:
      'Spent two days tracking down a preflight failure. Nginx config was stripping the Authorization header. Fixed — need to document proxy rules.',
    tag: 'blocker',
  },
  {
    date: '1 May 2025',
    title: 'Project scaffolded — MERN stack, Vite, Tailwind',
    preview:
      'Initial repo setup. Decided against Next.js — overkill for this scope. React + Express keeps it simple and explicit.',
    tag: 'kickoff',
  },
];

const HOW_IT_WORKS = [
  { step: '1', text: 'Create your free archive and claim your username.' },
  { step: '2', text: 'Add projects you\'re building, with title, stack, and status.' },
  { step: '3', text: 'Post structured updates as you build — decisions, blockers, progress.' },
  { step: '4', text: 'Your profile is public. Share it. Let the log speak for itself.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--paper)' }}>
      {/* ── Hero ── */}
      <section
        className="px-5 pt-14 pb-12 sm:px-8 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          className="fade-up"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-4)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--ink-4)' }} />
          Developer progress archive
        </div>

        <h1
          className="fade-up fade-up-delay-1"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(38px, 5vw, 58px)',
            fontWeight: 400,
            lineHeight: 1.13,
            letterSpacing: '-0.025em',
            color: 'var(--ink)',
            marginBottom: '20px',
          }}
        >
          Document your<br />
          <em style={{ fontStyle: 'italic', color: 'var(--ink-2)' }}>development journey.</em>
        </h1>

        <p
          className="fade-up fade-up-delay-2"
          style={{
            fontSize: '16px',
            color: 'var(--ink-3)',
            lineHeight: 1.7,
            maxWidth: '480px',
            marginBottom: '44px',
            fontWeight: 300,
          }}
        >
          Structured progress logs for builders. Chronicle what you're making,
          how it evolves, and what you're learning — in your own permanent archive.
        </p>

        <div
          className="fade-up fade-up-delay-3"
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '10px 22px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              borderRadius: '4px',
              textDecoration: 'none',
              letterSpacing: '0.03em',
              transition: 'opacity var(--transition)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Create your archive
          </Link>
        </div>
      </section>

      {/* ── Feature trio ── */}
      <hr className="mx-5 sm:mx-8" style={{ border: 'none', borderTop: '1px solid var(--rule)' }} />

      <section
        className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--rule)] px-5 sm:px-8"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.num}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0"
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--ink-4)',
                marginBottom: '16px',
                letterSpacing: '0.05em',
              }}
            >
              {f.num}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--ink)',
              }}
            >
              {f.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65, fontWeight: 300 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* ── Example timeline ── */}
      <section
        className="px-5 py-9 sm:px-8 sm:py-12"
        style={{
          background: 'var(--paper-2)',
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--ink-4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            Example project log — Auth System by ammar
          </div>

          {EXAMPLE_UPDATES.map((u, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5 sm:grid sm:gap-6"
              style={{
                gridTemplateColumns: '130px 1fr',
                padding: '18px 0',
                borderTop: '1px solid var(--rule)',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--ink-4)',
                  paddingTop: '2px',
                  letterSpacing: '0.02em',
                }}
              >
                {u.date}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--ink)',
                    marginBottom: '4px',
                    lineHeight: 1.4,
                  }}
                >
                  {u.title}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.55, fontWeight: 300 }}>
                  {u.preview}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--accent)',
                    background: 'var(--accent-dim)',
                    padding: '2px 7px',
                    borderRadius: '2px',
                    marginTop: '8px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {u.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        id="how-it-works"
        className="px-5 py-14 sm:px-8 sm:py-16 md:py-[72px]"
        style={{ maxWidth: '860px', margin: '0 auto' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-4)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '36px',
          }}
        >
          How it works
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {HOW_IT_WORKS.map((h, i) => (
            <div
              key={h.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '20px',
                padding: '20px 0',
                borderTop: '1px solid var(--rule)',
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--ink-4)',
                  paddingTop: '2px',
                }}
              >
                {h.step}
              </div>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', fontWeight: 300, lineHeight: 1.65 }}>
                {h.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section
        className="px-5 py-14 sm:px-8 sm:py-16 md:py-[72px]"
        style={{
          borderTop: '1px solid var(--rule)',
          textAlign: 'center',
          background: 'var(--paper-2)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 400,
            color: 'var(--ink)',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          Start your archive today.
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--ink-4)',
            marginBottom: '36px',
            fontWeight: 300,
          }}
        >
          Free. No noise. Just your work, documented.
        </p>
        <Link
          to="/register"
          style={{
            display: 'inline-block',
            padding: '11px 28px',
            background: 'var(--ink)',
            color: 'var(--paper)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            borderRadius: '4px',
            textDecoration: 'none',
            letterSpacing: '0.03em',
            transition: 'opacity var(--transition)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.82')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Create your archive →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-5 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-center gap-4 sm:justify-between"
        style={{
          borderTop: '1px solid var(--rule)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--ink-4)',
          }}
        >
          SpellOutCode
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'GitHub'].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--ink-4)',
                textDecoration: 'none',
                transition: 'color var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-4)')}
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}