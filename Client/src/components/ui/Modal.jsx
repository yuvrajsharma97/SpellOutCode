import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "480px",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20, 18, 16, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        style={{
          background: "var(--paper)",
          borderRadius: "8px",
          border: "1px solid var(--rule)",
          width: "100%",
          maxWidth: width,
          boxShadow: "0 8px 40px rgba(20, 18, 16, 0.12)",
          animation: "fadeUp 0.2s ease",
        }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--rule)",
          }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "18px",
              fontWeight: 400,
              color: "var(--ink)",
              margin: 0,
            }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--ink-4)",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              display: "flex",
              transition: "color var(--transition)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--ink-4)")
            }>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}
