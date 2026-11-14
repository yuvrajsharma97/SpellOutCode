import { sanitizeHtml } from "../../utils/sanitizeHtml";

export default function RichTextRenderer({ content }) {
  if (!content) return null;

  const clean = sanitizeHtml(content);

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: clean }}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        lineHeight: 1.75,
        color: "var(--ink-2)",
        fontWeight: 300,
      }}
    />
  );
}
