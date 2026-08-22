import { X } from "lucide-react";

const COLORS = {
  success: "#4ade80",
  error: "#f87171",
  info: "#60a5fa",
};

export default function Toast({ toast, onDismiss }) {
  return (
    <div
      className="w-full sm:w-auto sm:min-w-[240px] sm:max-w-[360px]"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        background: "var(--ink)",
        color: "var(--paper)",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: 300,
        boxShadow: "0 4px 16px rgba(20, 18, 16, 0.2)",
        animation: "fadeUp 0.2s ease",
      }}>
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: COLORS[toast.type] || COLORS.success,
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "var(--ink-4)",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}>
        <X size={13} />
      </button>
    </div>
  );
}
