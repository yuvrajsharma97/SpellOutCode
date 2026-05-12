export default function LoadingSkeleton({ lines = 4, width = "100%" }) {
  const lineWidths = ["100%", "85%", "92%", "70%", "80%", "60%"];

  return (
    <div
      style={{ width, display: "flex", flexDirection: "column", gap: "10px" }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: "12px",
            width: lineWidths[i % lineWidths.length],
            borderRadius: "3px",
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: "20px 0",
        borderBottom: "1px solid var(--rule)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <div
          className="skeleton"
          style={{ height: "20px", width: "60px", borderRadius: "2px" }}
        />
        <div
          className="skeleton"
          style={{ height: "20px", width: "80px", borderRadius: "2px" }}
        />
      </div>
      <div
        className="skeleton"
        style={{ height: "18px", width: "55%", borderRadius: "3px" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          className="skeleton"
          style={{ height: "12px", width: "100%", borderRadius: "3px" }}
        />
        <div
          className="skeleton"
          style={{ height: "12px", width: "88%", borderRadius: "3px" }}
        />
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
        {[48, 56, 44].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "20px", width: `${w}px`, borderRadius: "2px" }}
          />
        ))}
      </div>
    </div>
  );
}
