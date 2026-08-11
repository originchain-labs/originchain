import sanitizeHtml from "sanitize-html";

function unescapeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function sanitizeText(input: string): string {
  const stripped = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return unescapeEntities(stripped).trim();
}
