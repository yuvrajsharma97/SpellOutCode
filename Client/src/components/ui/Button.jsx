import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: {
    background: "var(--ink)",
    color: "var(--paper)",
    border: "none",
    hoverOpacity: 0.82,
  },
  ghost: {
    background: "transparent",
    color: "var(--ink-3)",
    border: "1px solid var(--rule)",
    hoverBg: "var(--paper-3)",
    hoverColor: "var(--ink)",
    hoverBorder: "1px solid var(--ink-4)",
  },
  danger: {
    background: "var(--danger)",
    color: "#fff",
    border: "none",
    hoverOpacity: 0.85,
  },
  accent: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    hoverOpacity: 0.85,
  },
};

const SIZES = {
  sm: { padding: "5px 12px", fontSize: "11px" },
  md: { padding: "8px 16px", fontSize: "12px" },
  lg: { padding: "11px 22px", fontSize: "13px" },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  style: extraStyle = {},
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: s.padding,
        background: v.background,
        color: v.color,
        border: v.border || "none",
        borderRadius: "4px",
        fontFamily: "var(--font-mono)",
        fontSize: s.fontSize,
        fontWeight: 500,
        letterSpacing: "0.03em",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all var(--transition)",
        width: fullWidth ? "100%" : "auto",
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (disabled || isLoading) return;
        if (v.hoverOpacity)
          e.currentTarget.style.opacity = String(v.hoverOpacity);
        if (v.hoverBg) e.currentTarget.style.background = v.hoverBg;
        if (v.hoverColor) e.currentTarget.style.color = v.hoverColor;
        if (v.hoverBorder) e.currentTarget.style.border = v.hoverBorder;
      }}
      onMouseLeave={(e) => {
        if (disabled || isLoading) return;
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.background = v.background;
        e.currentTarget.style.color = v.color;
        e.currentTarget.style.border = v.border || "none";
      }}>
      {isLoading && (
        <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} />
      )}
      {children}
    </button>
  );
}
