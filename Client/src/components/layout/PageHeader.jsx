export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-5 sm:mb-10 sm:pb-8"
      style={{
        borderBottom: "1px solid var(--rule)",
      }}>
      <div>
        {eyebrow && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}>
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "28px",
            fontWeight: 400,
            color: "var(--ink)",
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
            margin: 0,
          }}>
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: "14px",
              color: "var(--ink-4)",
              marginTop: "6px",
              fontWeight: 300,
              margin: "6px 0 0",
            }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
