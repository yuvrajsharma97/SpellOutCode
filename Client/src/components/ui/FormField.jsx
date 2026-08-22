import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FormField({ label, error, children, hint }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: error ? "var(--danger)" : "var(--ink-3)",
            letterSpacing: "0.04em",
            marginBottom: "7px",
          }}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--ink-4)",
            marginTop: "5px",
            fontWeight: 300,
          }}>
          {hint}
        </p>
      )}
      {error && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--danger)",
            marginTop: "5px",
            fontFamily: "var(--font-mono)",
          }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ error, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: `1px solid ${error ? "var(--danger)" : "var(--rule)"}`,
        borderRadius: "4px",
        fontSize: "13px",
        fontFamily: "var(--font-sans)",
        background: "var(--paper)",
        color: "var(--ink)",
        outline: "none",
        transition: "border-color var(--transition)",
        fontWeight: 300,
      }}
      onFocus={(e) => {
        if (!error) e.target.style.borderColor = "var(--ink-4)";
      }}
      onBlur={(e) => {
        if (!error) e.target.style.borderColor = "var(--rule)";
      }}
    />
  );
}

export function PasswordInput({ error, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        style={{
          width: "100%",
          padding: "9px 36px 9px 12px",
          border: `1px solid ${error ? "var(--danger)" : "var(--rule)"}`,
          borderRadius: "4px",
          fontSize: "13px",
          fontFamily: "var(--font-sans)",
          background: "var(--paper)",
          color: "var(--ink)",
          outline: "none",
          transition: "border-color var(--transition)",
          fontWeight: 300,
        }}
        onFocus={(e) => {
          if (!error) e.target.style.borderColor = "var(--ink-4)";
        }}
        onBlur={(e) => {
          if (!error) e.target.style.borderColor = "var(--rule)";
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          background: "none",
          border: "none",
          padding: 0,
          color: "var(--ink-4)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-4)")}>
        {visible ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export function TextArea({ error, rows = 4, ...props }) {
  return (
    <textarea
      {...props}
      rows={rows}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: `1px solid ${error ? "var(--danger)" : "var(--rule)"}`,
        borderRadius: "4px",
        fontSize: "13px",
        fontFamily: "var(--font-sans)",
        background: "var(--paper)",
        color: "var(--ink)",
        outline: "none",
        resize: "vertical",
        lineHeight: 1.6,
        transition: "border-color var(--transition)",
        fontWeight: 300,
      }}
      onFocus={(e) => {
        if (!error) e.target.style.borderColor = "var(--ink-4)";
      }}
      onBlur={(e) => {
        if (!error) e.target.style.borderColor = "var(--rule)";
      }}
    />
  );
}

export function SelectInput({ error, children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: `1px solid ${error ? "var(--danger)" : "var(--rule)"}`,
        borderRadius: "4px",
        fontSize: "13px",
        fontFamily: "var(--font-sans)",
        background: "var(--paper)",
        color: "var(--ink)",
        outline: "none",
        transition: "border-color var(--transition)",
        cursor: "pointer",
        appearance: "none",
        fontWeight: 300,
      }}
      onFocus={(e) => {
        if (!error) e.target.style.borderColor = "var(--ink-4)";
      }}
      onBlur={(e) => {
        if (!error) e.target.style.borderColor = "var(--rule)";
      }}>
      {children}
    </select>
  );
}
