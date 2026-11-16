import { ArrowUpRight, FolderGit2, PenLine, Zap } from "lucide-react";
import { socialLinks, sectionShell } from "./profileUtils";

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center text-center" style={{ minWidth: 0 }}>
      <span
        className="flex items-center justify-center"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "999px",
          background: "var(--ink-2)",
          color: "var(--paper)",
          marginBottom: "12px",
        }}>
        <Icon size={18} />
      </span>
      <span style={{ fontSize: "20px", fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "6px", lineHeight: 1.35 }}>{label}</span>
    </div>
  );
}

/** "Why follow" block: intro text and links on the left, stats on the right. */
export default function ProfileIntro({ profile, projects }) {
  const links = socialLinks(profile);
  const totalUpdates = projects.reduce((sum, p) => sum + (p.updateCount || 0), 0);
  const active = projects.filter((p) => p.status === "active");

  return (
    <section className={`${sectionShell} py-14 sm:py-20`}>
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] md:items-center gap-10 md:gap-14 md:px-8">
        <div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 500,
              lineHeight: 1.3,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              marginBottom: "14px",
            }}>
            Follow my work.
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-3)", fontWeight: 300, maxWidth: "520px" }}>
            Every project here is documented as it's built: the decisions, the dead ends and what
            finally shipped. Open any project to read its full timeline of updates.
          </p>

          {links.length > 0 && (
            <div className="flex flex-wrap gap-2" style={{ marginTop: "18px" }}>
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: "1px solid var(--rule)",
                    fontSize: "12px",
                    color: "var(--ink-2)",
                    textDecoration: "none",
                    transition: "border-color var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--ink-3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--rule)")}>
                  {l.label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-[420px] md:justify-self-end">
          <Stat icon={FolderGit2} value={projects.length} label="Projects documented" />
          <Stat icon={PenLine} value={totalUpdates} label="Progress updates" />
          <Stat icon={Zap} value={active.length} label="Building right now" />
        </div>
      </div>
    </section>
  );
}
