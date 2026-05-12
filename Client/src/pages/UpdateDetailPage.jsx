import { useParams, Link } from "react-router-dom";
import { usePublicUpdate } from "../hooks/useUpdates";
import RichTextRenderer from "../components/update/RichTextRenderer";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { formatDate } from "../utils/dates";

const TAG_COLORS = {
  milestone: { bg: "#dcf5e8", color: "#2d6a4f" },
  blocker: { bg: "#fef2f2", color: "#b91c1c" },
  decision: { bg: "#f5f0dc", color: "#7a5c0a" },
  learning: { bg: "var(--accent-dim)", color: "var(--accent)" },
  kickoff: { bg: "var(--paper-3)", color: "var(--ink-3)" },
  note: { bg: "var(--paper-3)", color: "var(--ink-3)" },
};

export default function UpdateDetailPage() {
  const { username, slug, updateId } = useParams();
  const { data, isLoading, isError } = usePublicUpdate(
    username,
    slug,
    updateId,
  );

  const update = data?.update;

  if (isError) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "var(--ink-4)",
          }}>
          Update not found.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1040px",
        margin: "0 auto",
        padding: "48px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 220px",
        gap: "80px",
        alignItems: "start",
      }}>
      {/* Main content */}
      <article>
        {/* Breadcrumb */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.02em",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}>
          <Link to={`/${username}`} style={crumbStyle}>
            {username}
          </Link>
          <span style={{ color: "var(--rule)" }}>/</span>
          <Link to={`/${username}/projects/${slug}`} style={crumbStyle}>
            {slug}
          </Link>
          <span style={{ color: "var(--rule)" }}>/</span>
          <span style={{ color: "var(--ink-3)" }}>update</span>
        </div>

        {isLoading ? (
          <div>
            <div
              className="skeleton"
              style={{
                height: "32px",
                width: "70%",
                borderRadius: "3px",
                marginBottom: "24px",
              }}
            />
            <LoadingSkeleton lines={6} />
          </div>
        ) : update ? (
          <>
            {/* Tag */}
            {update.tag && (
              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    padding: "3px 9px",
                    borderRadius: "2px",
                    letterSpacing: "0.04em",
                    ...(TAG_COLORS[update.tag] || TAG_COLORS.note),
                  }}>
                  {update.tag}
                </span>
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(24px, 3vw, 34px)",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                marginBottom: "32px",
              }}>
              {update.title}
            </h1>

            {/* Rich text body */}
            <RichTextRenderer content={update.content} />
          </>
        ) : null}
      </article>

      {/* Sticky metadata sidebar */}
      <aside
        style={{
          position: "sticky",
          top: "80px",
          alignSelf: "start",
          borderLeft: "1px solid var(--rule)",
          paddingLeft: "32px",
        }}>
        {isLoading ? (
          <LoadingSkeleton lines={4} />
        ) : update ? (
          <>
            <MetaItem label="Date" value={formatDate(update.createdAt)} />
            <MetaItem label="Project">
              <Link
                to={`/${username}/projects/${slug}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  transition: "opacity var(--transition)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
                {slug}
              </Link>
            </MetaItem>
            <MetaItem label="Author">
              <Link
                to={`/${username}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--ink-3)",
                  textDecoration: "none",
                  transition: "color var(--transition)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--ink)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink-3)")
                }>
                @{username}
              </Link>
            </MetaItem>
            {update.tag && (
              <MetaItem label="Tag">
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    padding: "2px 7px",
                    borderRadius: "2px",
                    ...(TAG_COLORS[update.tag] || TAG_COLORS.note),
                  }}>
                  {update.tag}
                </span>
              </MetaItem>
            )}

            <div
              style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid var(--rule)",
              }}>
              <Link
                to={`/${username}/projects/${slug}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--ink-4)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "color var(--transition)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--ink)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--ink-4)")
                }>
                ← All updates
              </Link>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}

function MetaItem({ label, value, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--ink-4)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "5px",
        }}>
        {label}
      </div>
      {children || (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--ink-3)",
          }}>
          {value}
        </div>
      )}
    </div>
  );
}

const crumbStyle = {
  color: "var(--ink-4)",
  textDecoration: "none",
  transition: "color 150ms",
};
