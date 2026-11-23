/** Escape text for use inside HTML. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
}

/** Lightweight inline formatting: **bold**, *accent (italic)*, new lines. */
export function richHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([\s\S]+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

/** Backend descriptions may contain HTML; show them as plain text. */
export function plainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** "example.com" -> "https://example.com"; full URLs are kept. */
export function externalUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

/** Attributes that open a link in a new tab safely. */
export const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" } as const;
