import { useParams, Link } from "react-router-dom";
import { ExternalLink, Github } from "lucide-react";
import { usePublicProject } from "../hooks/useProjects";
import { usePublicUpdates } from "../hooks/useUpdates";
import StatusBadge from "../components/ui/StatusBadge";
import UpdateTimeline from "../components/update/UpdateTimeline";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/LoadingSkeleton";
import { formatDate } from "../utils/dates";

export default function ProjectDetailPage() {
  const { username, slug } = useParams();

  const {
    data: projectData,
    isLoading: projectLoading,
    isError,
  } = usePublicProject(username, slug);
  const { data: updatesData, isLoading: updatesLoading } = usePublicUpdates(
    username,
    slug,
  );

  const project = projectData?.project;
  const updates = updatesData?.updates || [];

  if (isError) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--ink-4)",
          }}>
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        padding: "48px 32px",
      }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--ink-4)",
          letterSpacing: "0.02em",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
        <Link
          to={`/${username}`}
          style={{
            color: "var(--ink-4)",
            textDecoration: "none",
            transition: "color var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-4)")}>
          {username}
        </Link>
        <span style={{ color: "var(--rule)" }}>/</span>
        <span style={{ color: "var(--ink-3)" }}>{slug}</span>
      </div>

      {/* Project header */}
      {projectLoading ? (
        <ProjectHeaderSkeleton />
      ) : project ? (
        <div
          style={{
            marginBottom: "48px",
            paddingBottom: "40px",
            borderBottom: "1px solid var(--rule)",
          }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: "12px",
            }}>
            {project.title}
          </h1>

          {project.description && (
            <p
              style={{
                fontSize: "15px",
                color: "var(--ink-3)",
                lineHeight: 1.7,
                maxWidth: "560px",
                fontWeight: 300,
                marginBottom: "20px",
              }}>
              {project.description}
            </p>
          )}

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}>
            <StatusBadge status={project.status} />

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--ink-4)",
              }}>
              Started {formatDate(project.createdAt)}
            </span>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--ink-4)",
              }}>
              {updates.length} {updates.length === 1 ? "update" : "updates"}
            </span>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  transition: "opacity var(--transition)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                <Github size={12} />
                GitHub
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  transition: "opacity var(--transition)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                <ExternalLink size={12} />
                Live demo
              </a>
            )}
          </div>

          {/* Tech stack */}
          {project.techStack?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--ink-4)",
                    border: "1px solid var(--rule)",
                    padding: "2px 8px",
                    borderRadius: "2px",
                    letterSpacing: "0.02em",
                  }}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Updates */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--ink-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}>
        Update log
        {!updatesLoading &&
          ` — ${updates.length} ${updates.length === 1 ? "entry" : "entries"}`}
      </div>

      {updatesLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : updates.length === 0 ? (
        <EmptyState
          title="No updates yet."
          description="The author hasn't posted any updates for this project."
        />
      ) : (
        <UpdateTimeline
          updates={updates}
          username={username}
          projectSlug={slug}
        />
      )}
    </div>
  );
}

function ProjectHeaderSkeleton() {
  return (
    <div
      style={{
        marginBottom: "48px",
        paddingBottom: "40px",
        borderBottom: "1px solid var(--rule)",
      }}>
      <div
        className="skeleton"
        style={{
          height: "36px",
          width: "55%",
          borderRadius: "3px",
          marginBottom: "16px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "14px",
          width: "100%",
          borderRadius: "3px",
          marginBottom: "8px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "14px",
          width: "80%",
          borderRadius: "3px",
          marginBottom: "24px",
        }}
      />
      <div style={{ display: "flex", gap: "10px" }}>
        {[60, 90, 80, 70].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "20px", width: `${w}px`, borderRadius: "2px" }}
          />
        ))}
      </div>
    </div>
  );
}
