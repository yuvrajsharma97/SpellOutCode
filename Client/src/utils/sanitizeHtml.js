import DOMPurify from "dompurify";

/**
 * Strict allowlist for update content. It matches what the TipTap editor
 * (StarterKit + Link) can produce. Forms, inputs, buttons, <style>, inline
 * style attributes, images, iframes, SVG and anything else are removed, so
 * stored HTML cannot draw overlays or fake sign-in forms on our origin.
 */
const CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "s", "strike", "code",
    "pre", "blockquote",
    "ul", "ol", "li",
    "a",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "start", "class"],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
};

// Links that open a new tab must not get a handle on this window.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    if (node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer nofollow");
    } else {
      node.removeAttribute("target");
    }
  }
  // Only TipTap's code-block language class is kept.
  if (node.hasAttribute && node.hasAttribute("class")) {
    const cls = node.getAttribute("class");
    if (!(node.tagName === "CODE" && /^language-[a-z0-9+#-]{1,30}$/i.test(cls))) {
      node.removeAttribute("class");
    }
  }
});

export const sanitizeHtml = (html) => DOMPurify.sanitize(html || "", CONFIG);
