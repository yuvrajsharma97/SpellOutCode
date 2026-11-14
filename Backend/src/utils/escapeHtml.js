/**
 * Escape a value for safe interpolation into HTML text or a double-quoted
 * attribute. Every user-controlled string placed in an email template must
 * pass through this.
 */
const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

/**
 * Strip CR/LF so a value cannot break onto a new line in an email subject.
 */
const singleLine = (value) => String(value ?? "").replace(/[\r\n]+/g, " ");

module.exports = { escapeHtml, singleLine };
