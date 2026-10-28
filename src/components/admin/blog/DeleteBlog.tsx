"use client";

import React, { useState } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeBlog } from "@/types/blog.types";
import { getMediaUrl } from "@/lib/media";

export interface DeleteBlogProps {
  open: boolean;
  blog: SafeBlog | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteBlog({ open, blog, onClose, onSuccess }: DeleteBlogProps) {
  const { deleteBlog } = useContentStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !blog) return null;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    const res = await deleteBlog(blog.id);
    setIsDeleting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.message || "Failed to delete blog post. Please try again.");
    }
  };

  const imageUrl = getMediaUrl(blog.image?.url || blog.image?.publickey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Icon name="trash" size={17} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Delete Blog Post
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Permanent deletion confirmation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            {imageUrl && (
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">{blog.title}</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">/blog/{blog.slug}</p>
            </div>
          </div>

          <div className="text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              Are you sure you want to delete this blog post?
            </p>
            <p className="text-xs text-slate-500">
              This action cannot be undone. The article and its cover image will be permanently removed from S3 storage and search indexes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Btn
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Btn>
          <Btn
            variant="danger"
            size="md"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="inline-block animate-spin">
                  <Icon name="refresh" size={13} />
                </span>
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Icon name="trash" size={13} />
                <span>Delete Post</span>
              </>
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
}

