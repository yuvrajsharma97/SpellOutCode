import { Link } from "react-router-dom";
import { Layers } from "lucide-react";
import { formatRelativeDate } from "../../utils/dates";
import { coverTone } from "./profileUtils";

/**
 * Tall image-style project card: cover (image, or a generated tone with the
 * project's initial), a pill badge top-right, and title + meta over a dark
 * fade at the bottom.
 */
export default function ProjectTile({ project, username, icon: Icon, showSummary = false, className = "" }) {
  const [base, deep] = coverTone(project.slug || project.title);
  const cover = project.coverImage?.url;

  return (
    <Link
      to={`/${username}/projects/${project.slug}`}
      className={`profile-tile group relative block overflow-hidden ${className}`}
      style={{
        borderRadius: "14px",
        background: cover ? "var(--ink)" : `linear-gradient(160deg, ${base} 0%, ${deep} 100%)`,
        color: "var(--paper)",
        textDecoration: "none",
      }}>
      {cover ? (
        <img
          src={cover}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <>
          {/* Fine line texture + oversized initial stand in for a photo. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(248,246,242,0.06) 0 1px, transparent 1px 14px)",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute select-none transition-transform duration-500 group-hover:scale-[1.04]"
            style={{
              right: "-6%",
              top: "8%",
              fontFamily: "var(--font-serif)",
              fontSize: "200px",
              lineHeight: 1,
              color: "rgba(248,246,242,0.13)",
            }}>
            {project.title?.charAt(0)?.toUpperCase()}
          </span>
        </>
      )}

      {/* Bottom fade so text stays readable over any cover. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(20,18,16,0) 40%, rgba(20,18,16,0.82) 100%)" }}
      />

      {Icon && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            top: "14px",
            left: "14px",
            width: "34px",
            height: "34px",
            borderRadius: "999px",
            background: "rgba(248,246,242,0.16)",
            border: "1px solid rgba(248,246,242,0.35)",
          }}>
          <Icon size={16} />
        </span>
      )}

      <span
        className="absolute"
        style={{
          top: "14px",
          right: "14px",
          padding: "3px 10px",
          borderRadius: "999px",
          background: "rgba(248,246,242,0.92)",
          color: "var(--ink-2)",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          letterSpacing: "0.02em",
        }}>
        {project.updatedAt ? `Updated ${formatRelativeDate(project.updatedAt)}` : project.status}
      </span>

      <div className="absolute left-0 right-0 bottom-0" style={{ padding: "18px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            marginBottom: "6px",
            color: "var(--paper)",
          }}>
          {project.title}
        </h3>

        {showSummary && project.summary && (
          <p
            className="line-clamp-3"
            style={{ fontSize: "12px", lineHeight: 1.55, fontWeight: 300, opacity: 0.85, marginBottom: "8px" }}>
            {project.summary}
          </p>
        )}

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.03em",
            opacity: 0.85,
          }}>
          {project.status ? project.status[0].toUpperCase() + project.status.slice(1) : ""}
          <span style={{ opacity: 0.5, margin: "0 6px" }}>|</span>
          {project.updateCount || 0} {project.updateCount === 1 ? "update" : "updates"}
        </div>

        {!showSummary && project.techStack?.length > 0 && (
          <div
            className="flex items-center gap-1.5 truncate"
            style={{ fontSize: "11px", marginTop: "4px", opacity: 0.85 }}>
            <Layers size={11} className="flex-shrink-0" />
            <span className="truncate">{project.techStack.slice(0, 3).join(" · ")}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
