export default function EmptyState({ title, description, action }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 24px",
        border: "1px dashed var(--rule)",
        borderRadius: "6px",
      }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "20px",
          color: "var(--rule)",
          marginBottom: "16px",
          display: "block",
          letterSpacing: "0.05em",
        }}>
        [ ]
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--ink-3)",
          marginBottom: "6px",
        }}>
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: "13px",
            color: "var(--ink-4)",
            fontWeight: 300,
            marginBottom: action ? "20px" : "0",
          }}>
          {description}
        </div>
      )}
      {action && action}
    </div>
  );
}
