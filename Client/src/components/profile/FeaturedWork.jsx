import { Rocket, Sparkles } from "lucide-react";
import ProjectTile from "./ProjectTile";
import { firstName, byUpdatedDesc, sectionShell } from "./profileUtils";

/** Bento row: a large intro card plus the two most documented projects. */
export default function FeaturedWork({ profile, projects, onSeeProjects }) {
  const featured = [...projects]
    .sort((a, b) => (b.updateCount || 0) - (a.updateCount || 0) || byUpdatedDesc(a, b))
    .slice(0, 2);
  if (featured.length === 0) return null;

  const name = firstName(profile.name) || profile.username;
  const icons = [Rocket, Sparkles];

  return (
    <section className={`${sectionShell} pt-14 sm:pt-20`}>
      <div
        className={`grid grid-cols-1 gap-4 md:px-8 ${featured.length === 2 ? "sm:grid-cols-2 md:grid-cols-[1.45fr_1fr_1fr]" : "sm:grid-cols-2"}`}>
        <div
          className="flex flex-col justify-between sm:col-span-2 md:col-span-1 min-h-[220px] md:min-h-[300px]"
          style={{ padding: "26px", borderRadius: "14px", background: "var(--ink-3)", color: "var(--paper)" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "6px", color: "var(--paper)" }}>
              Featured work
            </h2>
            <p style={{ fontSize: "13px", lineHeight: 1.6, fontWeight: 300, opacity: 0.85, maxWidth: "300px" }}>
              The projects {name} has documented most closely, with the longest trail of updates.
            </p>
          </div>
          <button
            type="button"
            onClick={onSeeProjects}
            className="self-start"
            style={{
              marginTop: "20px",
              padding: "7px 16px",
              borderRadius: "999px",
              border: "none",
              background: "var(--ink)",
              color: "var(--paper)",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}>
            Browse all projects
          </button>
        </div>

        {featured.map((p, i) => (
          <ProjectTile
            key={p._id}
            project={p}
            username={profile.username}
            icon={icons[i]}
            showSummary
            className="h-[300px]"
          />
        ))}
      </div>
    </section>
  );
}
