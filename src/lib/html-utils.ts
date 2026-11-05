/**
 * Utility functions for HTML text processing and Quill rich-text validation.
 * Pure TypeScript with no DOM/browser dependencies, safe for both server and client.
 */

/**
 * Checks whether content contains HTML tags.
 */
export function isHtmlContent(content: string | null | undefined): boolean {
  if (!content) return false;
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Checks whether content produced by Quill is effectively empty.
 * Strips all HTML tags, whitespace, and non-breaking spaces.
 */
export function isQuillEmpty(content: string | null | undefined): boolean {
  if (!content) return true;
  const stripped = content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length === 0;
}

/**
 * Strips HTML tags and normalizes spaces for previews, excerpts, and SEO snippets.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

