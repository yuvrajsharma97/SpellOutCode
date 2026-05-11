export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTechStack(str) {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function truncate(str, maxLen = 160) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + "…";
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}
