import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dates";

export default function UpdateTimeline({ updates, username, projectSlug }) {
  if (!updates?.length) return null;

  return (
    <div>
      {updates.map((update, idx) => (
        <Link
          key={update._id}
          to={`/${username}/projects/${projectSlug}/updates/${update._id}`}
          style={{
            display: "grid",
            gridTemplateColumns: "110px 1fr",
            gap: "24px",
            padding: "20px 0",
            borderTop:
              idx === 0 ? "1px solid var(--rule)" : "1px solid var(--rule)",
            textDecoration: "none",
            color: "inherit",
            transition: "opacity var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-4)",
              paddingTop: "2px",
              letterSpacing: "0.02em",
            }}>
            {formatDate(update.createdAt)}
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--ink)",
                marginBottom: "6px",
                lineHeight: 1.4,
              }}>
              {update.title}
            </div>
            {update.preview && (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--ink-3)",
                  lineHeight: 1.55,
                  fontWeight: 300,
                }}>
                {update.preview}
              </p>
            )}
            {update.tag && (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--accent)",
                  background: "var(--accent-dim)",
                  padding: "2px 7px",
                  borderRadius: "2px",
                  marginTop: "8px",
                  letterSpacing: "0.02em",
                }}>
                {update.tag}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
