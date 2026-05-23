import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { usePublicProjects } from "../hooks/useProjects";
import { useDebounce } from "../hooks/useDebounce";
import ProfileRail from "../components/profile/ProfileRail";
import ProjectCard from "../components/project/ProjectCard";
import SearchInput from "../components/ui/SearchInput";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/LoadingSkeleton";

const STATUS_FILTERS = ["all", "active", "paused", "completed", "archived"];

export default function ProfilePage() {
  const { username } = useParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 250);

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useProfile(username);

  const { data: projects = [], isLoading: projectsLoading } =
    usePublicProjects(username);

  if (profileError) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--ink-4)",
          }}>
          Profile not found.
        </p>
      </div>
    );
  }

  const filtered = projects.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      !debouncedSearch ||
      p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.summary?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.techStack?.some((t) =>
        t.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    return matchesStatus && matchesSearch;
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "48px 32px",
        gap: "64px",
        minHeight: "calc(100vh - 52px)",
      }}>
      {/* Rail */}
      {profileLoading ? (
        <ProfileRailSkeleton />
      ) : profile ? (
        <ProfileRail profile={profile} />
      ) : null}

      {/* Main content */}
      <main>
        {/* Projects header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "1px solid var(--rule)",
            gap: "16px",
            flexWrap: "wrap",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--ink-4)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
              Projects
              {!projectsLoading && ` — ${projects.length}`}
            </span>

            {/* Status filter pills */}
            <div style={{ display: "flex", gap: "4px" }}>
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "2px",
                    border: "1px solid",
                    borderColor:
                      statusFilter === s ? "var(--ink-4)" : "transparent",
                    background:
                      statusFilter === s ? "var(--paper-3)" : "transparent",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: statusFilter === s ? "var(--ink)" : "var(--ink-4)",
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                    transition: "all var(--transition)",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search projects…"
            style={{ width: "190px" }}
          />
        </div>

        {/* Project list */}
        {projectsLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={
              debouncedSearch || statusFilter !== "all"
                ? "No projects match your filter."
                : "No projects yet."
            }
            description={
              debouncedSearch || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : `${profile?.name?.split(" ")[0] || "This user"} hasn't published any projects yet.`
            }
          />
        ) : (
          <div>
            {filtered.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                username={username}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProfileRailSkeleton() {
  return (
    <aside style={{ paddingRight: "40px" }}>
      <div
        className="skeleton"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "6px",
          marginBottom: "18px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "18px",
          width: "70%",
          marginBottom: "8px",
          borderRadius: "3px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "12px",
          width: "50%",
          marginBottom: "20px",
          borderRadius: "3px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "12px",
          width: "100%",
          marginBottom: "6px",
          borderRadius: "3px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "12px",
          width: "85%",
          marginBottom: "6px",
          borderRadius: "3px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "12px",
          width: "60%",
          marginBottom: "28px",
          borderRadius: "3px",
        }}
      />
      <div
        className="skeleton"
        style={{ height: "34px", width: "100%", borderRadius: "4px" }}
      />
    </aside>
  );
}
