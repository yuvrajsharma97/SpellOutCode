import { forwardRef, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import EmptyState from "../ui/EmptyState";
import ProjectTile from "./ProjectTile";
import { firstName, sectionShell } from "./profileUtils";

const STATUS_FILTERS = ["all", "active", "paused", "completed", "archived"];

const roundButton = {
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  border: "1px solid var(--ink-2)",
  background: "transparent",
  color: "var(--ink-2)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

/** Grey rounded panel with filters and a horizontally scrolling project row. */
const ProjectShowcase = forwardRef(function ProjectShowcase(
  { profile, projects, isLoading, search, onSearch, status, onStatus },
  ref,
) {
  const rowRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const name = firstName(profile?.name) || profile?.username || "This user";
  const filtering = search || status !== "all";

  const scroll = (dir) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: dir * Math.max(row.clientWidth * 0.8, 260), behavior: "smooth" });
  };

  return (
    <section ref={ref} id="projects" className={`${sectionShell} scroll-mt-20`}>
      <div className="px-5 py-8 sm:px-10 sm:py-10 md:px-14" style={{ borderRadius: "24px", background: "var(--paper-2)" }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-10" style={{ marginBottom: "22px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            Projects
            {!isLoading && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 400, color: "var(--ink-4)", marginLeft: "8px" }}>
                {projects.length}
              </span>
            )}
          </h2>
          <p className="md:max-w-[400px]" style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--ink-3)", fontWeight: 300 }}>
            From the first commit to the final release, browse everything {name} is building and
            has shipped.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ marginBottom: "20px" }}>
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mb-1">
            {STATUS_FILTERS.map((s) => {
              const on = status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatus(s)}
                  className="flex-shrink-0 whitespace-nowrap"
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: `1px solid ${on ? "var(--ink)" : "var(--rule)"}`,
                    background: on ? "var(--ink)" : "var(--paper)",
                    color: on ? "var(--paper)" : "var(--ink-3)",
                    fontSize: "11px",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                  }}>
                  {s}
                </button>
              );
            })}
          </div>
          <div className="w-full sm:w-[220px] flex-shrink-0">
            <SearchInput value={search} onChange={onSearch} placeholder="Search projects…" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton flex-shrink-0 w-[240px] h-[320px]" style={{ borderRadius: "14px" }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title={filtering ? "No projects match your filter." : "No projects yet."}
            description={filtering ? "Try a different search or status." : `${name} hasn't published any projects yet.`}
          />
        ) : showAll ? (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((p) => (
              <ProjectTile key={p._id} project={p} username={profile.username} className="h-[320px]" />
            ))}
          </div>
        ) : (
          <div
            ref={rowRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mb-2"
            style={{ scrollbarWidth: "none" }}>
            {projects.map((p) => (
              <ProjectTile
                key={p._id}
                project={p}
                username={profile.username}
                className="snap-start flex-shrink-0 w-[78%] min-[480px]:w-[240px] h-[320px]"
              />
            ))}
          </div>
        )}

        {!isLoading && projects.length > 0 && (
          <div className="flex items-center justify-between" style={{ marginTop: "22px" }}>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              style={{
                padding: "7px 16px",
                borderRadius: "999px",
                border: "none",
                background: "var(--ink)",
                color: "var(--paper)",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
              }}>
              {showAll ? "Show less" : "View all"}
            </button>
            {!showAll && projects.length > 1 && (
              <div className="flex gap-2">
                <button type="button" aria-label="Previous projects" onClick={() => scroll(-1)} style={roundButton}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" aria-label="Next projects" onClick={() => scroll(1)} style={roundButton}>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
});

export default ProjectShowcase;
