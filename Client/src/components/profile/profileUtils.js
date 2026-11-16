// Shared helpers for the public profile page.

// Cover tones drawn from the app palette (ink, accent, success, ink-3, warn),
// each as [base, deep] for a gradient. Projects without a cover image get one
// of these, picked deterministically from the slug so a project always looks
// the same.
const COVER_TONES = [
  ["#3a3632", "#141210"],
  ["#2563a8", "#14365e"],
  ["#2d6a4f", "#173a2b"],
  ["#6b6560", "#2b2825"],
  ["#7a5c0a", "#3f3005"],
];

export function coverTone(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return COVER_TONES[Math.abs(hash) % COVER_TONES.length];
}

export function firstName(name = "") {
  return name.trim().split(/\s+/)[0] || "";
}

const SOCIAL_LABELS = {
  website: "Website",
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
};

// Social links in a stable order, only http(s) URLs.
export function socialLinks(profile) {
  const links = profile?.socialLinks || {};
  return Object.keys(SOCIAL_LABELS)
    .filter((key) => /^https?:\/\//i.test(links[key] || ""))
    .map((key) => ({ key, label: SOCIAL_LABELS[key], url: links[key] }));
}

export const byUpdatedDesc = (a, b) =>
  new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);

export const sectionShell = "w-full max-w-[1120px] mx-auto px-4 sm:px-6";
