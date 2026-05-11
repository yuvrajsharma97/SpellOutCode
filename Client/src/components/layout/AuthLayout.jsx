import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        display: "flex",
        flexDirection: "column",
      }}>
      <header
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid var(--rule)",
        }}>
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
            width: "fit-content",
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
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}>
        <Outlet />
      </main>
    </div>
  );
}
