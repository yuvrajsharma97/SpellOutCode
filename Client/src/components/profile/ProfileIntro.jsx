import { Link } from "react-router-dom";
import { ArrowUpRight, FolderGit2, PenLine, Zap, Hammer, Wrench, Flag } from "lucide-react";
import { formatRelativeDate } from "../../utils/dates";
import { firstName, socialLinks, byUpdatedDesc, sectionShell } from "./profileUtils";

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

function FeatureCard({ icon: Icon, title, children, to }) {
  const body = (
    <>
      <span
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "10px",
          background: "var(--paper-2)",
          color: "var(--ink-2)",
        }}>
        <Icon size={30} strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "12px", lineHeight: 1.55, fontWeight: 300, opacity: 0.85 }}>{children}</div>
      </div>
    </>
  );
  const style = {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    padding: "14px",
    borderRadius: "14px",
    background: "var(--ink-3)",
    color: "var(--paper)",
    textDecoration: "none",
    transition: "background var(--transition)",
  };
  return to ? (
    <Link
      to={to}
      style={style}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ink-3)")}>
      {body}
    </Link>
  ) : (
    <div style={style}>{body}</div>
  );
}

/** "Why follow" block: bio, links and stats on the left, feature cards right. */
export default function ProfileIntro({ profile, projects }) {
  const name = firstName(profile.name) || profile.username;
  const links = socialLinks(profile);
  const totalUpdates = projects.reduce((sum, p) => sum + (p.updateCount || 0), 0);
  const active = projects.filter((p) => p.status === "active");
  const building = [...active].sort(byUpdatedDesc)[0];
  const shipped = projects.filter((p) => p.status === "completed").sort(byUpdatedDesc)[0];
  const toolbox = profile.skills?.length
    ? profile.skills
    : [...new Set(projects.flatMap((p) => p.techStack || []))];

  return (
    <section className={`${sectionShell} py-14 sm:py-20`}>
      <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 md:px-8">
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
            Why follow {name}'s work
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

          <div className="grid grid-cols-3 gap-4 max-w-[420px]" style={{ marginTop: "44px" }}>
            <Stat icon={FolderGit2} value={projects.length} label="Projects documented" />
            <Stat icon={PenLine} value={totalUpdates} label="Progress updates" />
            <Stat icon={Zap} value={active.length} label="Building right now" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <FeatureCard
            icon={Hammer}
            title="Currently building"
            to={building ? `/${profile.username}/projects/${building.slug}` : undefined}>
            {building
              ? `${building.title}, last updated ${formatRelativeDate(building.updatedAt)}.`
              : "Nothing in progress right now. Check back soon."}
          </FeatureCard>
          <FeatureCard icon={Wrench} title="Toolbox">
            {toolbox.length ? toolbox.slice(0, 8).join(", ") : "Skills haven't been added yet."}
          </FeatureCard>
          <FeatureCard
            icon={Flag}
            title="Latest shipped"
            to={shipped ? `/${profile.username}/projects/${shipped.slug}` : undefined}>
            {shipped
              ? `${shipped.title}${shipped.summary ? `: ${shipped.summary}` : "."}`
              : "No completed projects yet. The first one is on its way."}
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
