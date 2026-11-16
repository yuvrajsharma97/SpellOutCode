import { firstName, sectionShell } from "./profileUtils";

/** "How X builds, 1-2-3": the project lifecycle with real counts. */
export default function BuildSteps({ profile, projects }) {
  if (projects.length === 0) return null;
  const name = firstName(profile.name) || profile.username;
  const count = (s) => projects.filter((p) => p.status === s).length;
  const updates = projects.reduce((sum, p) => sum + (p.updateCount || 0), 0);

  const steps = [
    { title: "Start a build", text: "Every idea gets its own project page from day one.", stat: `${count("active")} in progress` },
    { title: "Document the journey", text: "Progress, decisions and setbacks are written up as updates.", stat: `${updates} updates written` },
    { title: "Ship and reflect", text: "Finished work stays here with its full history.", stat: `${count("completed")} completed` },
  ];

  return (
    <section className={`${sectionShell} py-14 sm:py-20`}>
      <div className="md:px-8">
        <h2
          style={{
            fontSize: "clamp(20px, 2.6vw, 24px)",
            fontWeight: 600,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
            marginBottom: "28px",
          }}>
          How {name} builds, in 1-2-3.
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "999px",
                  border: "1.5px dashed var(--ink-4)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--ink-2)",
                }}>
                {i + 1}
              </span>
              <div className="min-w-0">
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>{s.title}</div>
                <p style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--ink-3)", fontWeight: 300 }}>{s.text}</p>
                <div
                  style={{
                    marginTop: "8px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--accent)",
                  }}>
                  {s.stat}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
