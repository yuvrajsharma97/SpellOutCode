import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  style = {},
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        ...style,
      }}>
      <Search
        size={13}
        style={{
          position: "absolute",
          left: "10px",
          color: "var(--ink-4)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: "30px",
          paddingRight: "12px",
          paddingTop: "6px",
          paddingBottom: "6px",
          border: "1px solid var(--rule)",
          borderRadius: "4px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          background: "var(--paper)",
          color: "var(--ink)",
          outline: "none",
          width: "100%",
          transition: "border-color var(--transition)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--ink-4)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--rule)")}
      />
    </div>
  );
}
