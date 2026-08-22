import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "480px",
  dismissible = true,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape" && dismissible) onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, dismissible]);

  if (!isOpen) return null;

  return (
    <div
      className="flex items-center justify-center p-3 sm:p-6"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20, 18, 16, 0.4)",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}>
      <div
        className="max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)]"
        style={{
          background: "var(--paper)",
          borderRadius: "8px",
          border: "1px solid var(--rule)",
          width: "100%",
          maxWidth: width,
          boxShadow: "0 8px 40px rgba(20, 18, 16, 0.12)",
          animation: "fadeUp 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Header */}
        <div
          className="px-4 py-4 sm:px-6 sm:py-5"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
        <div
          className="px-4 py-4 sm:px-6 sm:py-6"
          style={{ overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
