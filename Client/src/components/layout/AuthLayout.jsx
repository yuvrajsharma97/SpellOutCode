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
        className="px-4 py-4 sm:px-8 sm:py-5"
        style={{
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
        className="px-4 py-8 sm:px-6 sm:py-12"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Outlet />
      </main>
    </div>
  );
}
