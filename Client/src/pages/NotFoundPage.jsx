import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        background: "var(--paper)",
        textAlign: "center",
      }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--ink-4)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}>
        404 — Not found
      </div>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "32px",
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}>
        This page doesn't exist.
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-4)",
          marginBottom: "36px",
          fontWeight: 300,
        }}>
        The URL may have changed or the content was removed.
      </p>
      <Link
        to="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--ink-3)",
          textDecoration: "none",
          borderBottom: "1px solid var(--rule)",
          paddingBottom: "2px",
          transition: "color var(--transition)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-3)")}>
        ← Back to home
      </Link>
    </div>
  );
}
