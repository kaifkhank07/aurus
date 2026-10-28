"use client";

import React, { useState } from "react";
import { SafeBlog } from "@/types/blog.types";
import { getMediaUrl } from "@/lib/media";
import { Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface BlogDetailsProps {
  open: boolean;
  blog: SafeBlog | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function BlogDetails({
  open,
  blog,
  onClose,
  onEdit,
  onDelete,
}: BlogDetailsProps) {
  const [copiedSlug, setCopiedSlug] = useState(false);

  if (!open || !blog) return null;

  const imageUrl = getMediaUrl(blog.image?.url || blog.image?.publickey);

  const handleCopySlug = () => {
    navigator.clipboard.writeText(blog.slug);
    setCopiedSlug(true);
    setTimeout(() => {
      setCopiedSlug(false);
    }, 2000);
  };

  const createdFormatted = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const updatedFormatted = blog.updatedAt
    ? new Date(blog.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200">
        {/* Cover Banner Header */}
        <div className="relative w-full h-56 bg-slate-900 shrink-0 overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover opacity-90" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
              <Icon name="fileText" size={40} />
            </div>
          )}

          {/* Close button on cover */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Date & Tags on Banner */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs gap-2">
            <span className="font-semibold text-slate-200">Published on {createdFormatted}</span>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {blog.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Subtitle */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h2>
            {blog.subtitle && (
              <p className="text-sm font-medium text-slate-500 mt-1.5 leading-relaxed">
                {blog.subtitle}
              </p>
            )}
          </div>

          {/* Slug & Metadata Bar */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">URL Slug:</span>
              <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                /blog/{blog.slug}
              </span>
              <button
                type="button"
                onClick={handleCopySlug}
                title="Copy slug"
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
              >
                {copiedSlug ? (
                  <span className="text-emerald-600 font-bold text-[11px]">Copied!</span>
                ) : (
                  <Icon name="copy" size={13} />
                )}
              </button>
            </div>

            {updatedFormatted && (
              <div className="text-slate-400 text-[11px]">
                Updated: {updatedFormatted}
              </div>
            )}
          </div>

          {/* Full Content */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Article Content
            </h4>
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
              {blog.description}
            </div>
          </div>

          {/* SEO Metadata if present */}
          {blog.metadata && (blog.metadata.title || blog.metadata.description || blog.metadata.keywords?.length) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <Icon name="flag" size={12} className="text-slate-400" />
                <span>Search Engine Preview (SEO)</span>
              </h4>
              {blog.metadata.title && (
                <div className="text-sky-700 font-bold text-sm">
                  {blog.metadata.title}
                </div>
              )}
              {blog.metadata.description && (
                <p className="text-slate-600 leading-relaxed">
                  {blog.metadata.description}
                </p>
              )}
              {blog.metadata.keywords && blog.metadata.keywords.length > 0 && (
                <div className="pt-1 flex items-center gap-1 flex-wrap">
                  <span className="text-slate-400 font-semibold">Keywords: </span>
                  {blog.metadata.keywords.map((k) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 text-[11px]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="trash" size={13} />
                <span>Delete Post</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Btn variant="brand" size="md" onClick={onEdit}>
                <Icon name="pen" size={13} />
                <span>Edit Post</span>
              </Btn>
            )}
            <Btn variant="ghost" size="md" onClick={onClose}>
              Close
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

