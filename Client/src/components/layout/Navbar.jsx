import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header
      style={{
        height: "52px",
        borderBottom: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        padding: "0 32px",
        background: "var(--paper)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
      {/* Wordmark */}
      <Link
        to="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginRight: "auto",
          textDecoration: "none",
        }}>
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#2563a8",
            display: "inline-block",
          }}
        />
        SpellOutCode
      </Link>

      {/* Nav links — shown on landing only */}
      {isLanding && (
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            marginRight: "28px",
          }}>
          <NavLinkItem to="/#how-it-works">How it works</NavLinkItem>
        </nav>
      )}

      {/* Auth actions */}
      {user ? (
        <Link
          to="/dashboard"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            padding: "6px 14px",
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: "4px",
            textDecoration: "none",
            letterSpacing: "0.02em",
            transition: "opacity var(--transition)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          Dashboard
        </Link>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            to="/login"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--ink-3)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "color var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ink-3)")
            }>
            Sign in
          </Link>
          <Link
            to="/register"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              padding: "6px 14px",
              background: "var(--ink)",
              color: "var(--paper)",
              borderRadius: "4px",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "opacity var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}

function NavLinkItem({ to, children }) {
  return (
    <a
      href={to}
      style={{
        fontSize: "13px",
        color: "var(--ink-3)",
        textDecoration: "none",
        letterSpacing: "0.01em",
        transition: "color var(--transition)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-3)")}>
      {children}
    </a>
  );
}
