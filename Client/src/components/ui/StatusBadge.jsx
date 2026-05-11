const STATUS_STYLES = {
  active: {
    background: "#dcf5e8",
    color: "#2d6a4f",
  },
  paused: {
    background: "#f5f0dc",
    color: "#7a5c0a",
  },
  archived: {
    background: "var(--paper-3)",
    color: "var(--ink-4)",
  },
  completed: {
    background: "#dde8f5",
    color: "#2563a8",
  },
};

export default function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.archived;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        padding: "2px 8px",
        borderRadius: "2px",
        letterSpacing: "0.04em",
        ...styles,
      }}>
      {status}
    </span>
  );
}
