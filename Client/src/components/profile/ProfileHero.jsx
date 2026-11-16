import { ArrowUpRight } from "lucide-react";
import { firstName, socialLinks, sectionShell } from "./profileUtils";

const pill = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 18px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 500,
  textDecoration: "none",
  cursor: "pointer",
  transition: "background var(--transition), color var(--transition)",
};

/** Full-width rounded banner with the person's first name as a wordmark. */
export default function ProfileHero({ profile, onSeeProjects }) {
  const word = (firstName(profile.name) || profile.username).toUpperCase();
  // Shrink long names so the wordmark always fits on one line.
  const len = Math.max(word.length, 4);
  const fontSize = `clamp(44px, ${Math.min(17, 92 / len)}vw, ${Math.min(176, 1040 / len)}px)`;
  const primaryLink = socialLinks(profile)[0];

  return (
    <section className={`${sectionShell} pt-4 sm:pt-6`}>
      <div
        className="relative overflow-hidden flex flex-col justify-end min-h-[380px] sm:min-h-[440px] p-6 sm:p-10 md:p-14"
        style={{
          borderRadius: "20px",
          background: "var(--ink)",
          color: "var(--paper)",
        }}>
        {/* Dot grid + soft accent glow stand in for the hero photograph. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(248,246,242,0.09) 1px, transparent 1px), radial-gradient(ellipse at 85% 10%, rgba(37,99,168,0.55), transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(45,106,79,0.35), transparent 50%)",
            backgroundSize: "22px 22px, 100% 100%, 100% 100%",
          }}
        />

        <div className="absolute flex items-center gap-3" style={{ top: "24px", left: "24px", right: "24px" }}>
          {profile.avatar?.url ? (
            <img
              src={profile.avatar.url}
              alt=""
              className="w-10 h-10 object-cover"
              style={{ borderRadius: "999px", border: "2px solid rgba(248,246,242,0.4)" }}
            />
          ) : (
            <span
              className="w-10 h-10 flex items-center justify-center"
              style={{
                borderRadius: "999px",
                background: "var(--paper)",
                color: "var(--ink)",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}>
              {profile.name?.charAt(0)?.toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate" style={{ fontSize: "14px", fontWeight: 500 }}>
              {profile.name}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: 0.7 }}>
              @{profile.username}
            </div>
          </div>
        </div>

        <div className="relative">
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize,
              lineHeight: 0.85,
              letterSpacing: "-0.045em",
              color: "var(--paper)",
              margin: 0,
              wordBreak: "break-word",
            }}>
            {word}
          </h1>

          <p
            className="max-w-[520px]"
            style={{ marginTop: "18px", fontSize: "14px", lineHeight: 1.6, fontWeight: 300, opacity: 0.85 }}>
            {profile.roleTitle ? <strong style={{ fontWeight: 500 }}>{profile.roleTitle}. </strong> : null}
            {profile.bio || `Follow ${firstName(profile.name) || profile.username}'s projects as they're built, one update at a time.`}
          </p>

          <div className="flex flex-wrap gap-3" style={{ marginTop: "22px" }}>
            <button
              type="button"
              onClick={onSeeProjects}
              style={{ ...pill, border: "none", background: "var(--paper)", color: "var(--ink)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--paper)")}>
              See projects
            </button>
            {primaryLink && (
              <a
                href={primaryLink.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...pill, border: "1px solid rgba(248,246,242,0.7)", color: "var(--paper)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,246,242,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                {primaryLink.label} <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
