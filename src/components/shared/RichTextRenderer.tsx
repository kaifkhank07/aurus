"use client";

import React from "react";
import { isHtmlContent } from "@/lib/html-utils";
import "./RichTextRenderer.css";

export { isHtmlContent };

export interface RichTextRendererProps {
  content?: string | null;
  className?: string;
  fallback?: string;
}

/**
 * Safely prepares HTML by ensuring external links have target="_blank" and rel="noopener noreferrer",
 * while sanitizing unsafe script tags and inline event handlers.
 */
function sanitizeRichHtml(html: string): string {
  if (!html) return "";

  // Neutralize script tags or inline event handlers
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:[^"']*/gi, "#");

  // Ensure <a> tags have rel="noopener noreferrer" and target="_blank"
  clean = clean.replace(/<a\s+([^>]*?)>/gi, (match, attrs) => {
    let newAttrs = attrs;
    if (!/target=/i.test(newAttrs)) {
      newAttrs += ' target="_blank"';
    }
    if (!/rel=/i.test(newAttrs)) {
      newAttrs += ' rel="noopener noreferrer"';
    } else {
      newAttrs = newAttrs.replace(/rel="([^"]*)"/i, 'rel="noopener noreferrer $1"');
    }
    return `<a ${newAttrs.trim()}>`;
  });

  return clean;
}

export default function RichTextRenderer({
  content,
  className = "",
  fallback = "",
}: RichTextRendererProps) {
  const raw = (content ?? "").trim() || fallback;

  if (!raw) return null;

  // Render HTML formatted content
  if (isHtmlContent(raw)) {
    const cleanHtml = sanitizeRichHtml(raw);
    return (
      <div
        className={`rich-text-content ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  // Fallback for legacy plain-text descriptions
  const paragraphs: string[] = raw
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return (
      <div className={`rich-text-content space-y-4 ${className}`}>
        {paragraphs.map((p: string, idx: number) => (
          <p key={idx} className="whitespace-pre-line leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={`rich-text-content ${className}`}>
      <p className="whitespace-pre-line leading-relaxed">{raw}</p>
    </div>
  );
}
