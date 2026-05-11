import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge"
import { formatRelativeDate } from "@/utils/dates";

export default function ProjectCard({ project, username }) {
  return (
    <Link
      to={`/${username}/projects/${project.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "20px 0",
        borderBottom: "1px solid var(--rule)",
        color: "inherit",
        transition: "opacity var(--transition)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}>
        <StatusBadge status={project.status} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "var(--ink-4)",
            letterSpacing: "0.02em",
          }}>
          {project.updatedAt
            ? `Updated ${formatRelativeDate(project.updatedAt)}`
            : "No updates yet"}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "17px",
          fontWeight: 500,
          color: "var(--ink)",
          marginBottom: "6px",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}>
        {project.title}
      </h3>

      {/* Summary */}
      {project.summary && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--ink-3)",
            lineHeight: 1.6,
            marginBottom: "12px",
            fontWeight: 300,
          }}>
          {project.summary}
        </p>
      )}

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
    </Link>
  );
}
