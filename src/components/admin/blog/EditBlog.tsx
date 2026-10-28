"use client";

import React, { useState, useEffect } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeBlog, UpdateBlogInput } from "@/types/blog.types";
import { getMediaUrl } from "@/lib/media";

export interface EditBlogProps {
  open: boolean;
  blog: SafeBlog | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBlog({ open, blog, onClose, onSuccess }: EditBlogProps) {
  const { updateBlog } = useContentStore();

  const [title, setTitle] = useState(blog?.title || "");
  const [subtitle, setSubtitle] = useState(blog?.subtitle || "");
  const [description, setDescription] = useState(blog?.description || "");
  const [tags, setTags] = useState<string[]>(blog?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Existing image from S3
  const existingImageUrl = getMediaUrl(blog?.image?.url || blog?.image?.publickey);

  // Replacement image file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // SEO Metadata
  const [showSeo, setShowSeo] = useState(false);
  const [metaTitle, setMetaTitle] = useState(blog?.metadata?.title || "");
  const [metaDescription, setMetaDescription] = useState(blog?.metadata?.description || "");
  const [metaKeywordsInput, setMetaKeywordsInput] = useState(
    blog?.metadata?.keywords?.join(", ") || ""
  );

  // Validation & Submission
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!open || !blog) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setClientErrors((prev) => ({
          ...prev,
          image: "Only image files (JPEG, PNG, WebP) are allowed.",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setClientErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 10MB.",
        }));
        return;
      }
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveNewImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Blog title is required.";
    } else if (title.trim().length > 200) {
      errors.title = "Title cannot exceed 200 characters.";
    }

    if (subtitle.trim().length > 300) {
      errors.subtitle = "Subtitle cannot exceed 300 characters.";
    }

    if (!description.trim()) {
      errors.description = "Blog content / description is required.";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const keywords = metaKeywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const metadata = {
      title: metaTitle.trim() || undefined,
      description: metaDescription.trim() || undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
    };

    let res;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("subtitle", subtitle.trim());
      formData.append("description", description.trim());
      formData.append("image", selectedFile);
      formData.append("tags", JSON.stringify(tags));
      formData.append("metadata", JSON.stringify(metadata));

      res = await updateBlog(blog.id, formData);
    } else {
      const payload: UpdateBlogInput = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        description: description.trim(),
        tags,
        metadata,
      };
      res = await updateBlog(blog.id, payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to update blog post. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="pen" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Edit Blog Post</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Update article contents, cover banner, tags, or search metadata.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{apiError}</span>
            </div>
          )}

          {/* Cover Image Upload / Replacement */}
          <FormField
            label="Cover Image"
            hint="Replace current banner or leave as is (JPEG, PNG, WebP up to 10MB)."
            error={clientErrors.image}
          >
            {previewUrl ? (
              <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="New Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveNewImage}
                  disabled={isSubmitting}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Icon name="x" size={12} />
                  <span>Revert Image</span>
                </button>
              </div>
            ) : existingImageUrl ? (
              <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={existingImageUrl} alt={blog.title} className="w-full h-full object-cover" />
                <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm">
                  <Icon name="pen" size={12} />
                  <span>Change Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/20 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-orange-100 text-slate-400 group-hover:text-orange-600 flex items-center justify-center transition-colors">
                  <Icon name="card" size={20} />
                </div>
                <div className="text-xs text-center">
                  <span className="font-bold text-orange-600">Click to upload cover image</span>
                  <p className="text-slate-400 mt-0.5 text-[11px]">PNG, JPG or WebP (max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>
            )}
          </FormField>

          {/* Title */}
          <FormField
            label="Article Title *"
            hint="Clear, engaging title for the blog post."
            error={clientErrors.title}
          >
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title…"
              error={!!clientErrors.title}
              disabled={isSubmitting}
              maxLength={200}
            />
          </FormField>

          {/* Subtitle */}
          <FormField
            label="Subtitle / Summary (Optional)"
            hint="Short preview description displayed on cards."
            error={clientErrors.subtitle}
          >
            <TextInput
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle summary…"
              error={!!clientErrors.subtitle}
              disabled={isSubmitting}
              maxLength={300}
            />
          </FormField>

          {/* Tags */}
          <FormField
            label="Tags & Topics"
            hint="Add keyword tags to categorize the post."
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TextInput
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type a tag and press Add…"
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Btn
                  variant="ghost"
                  size="md"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isSubmitting}
                >
                  <Icon name="plus" size={13} />
                  <span>Add Tag</span>
                </Btn>
              </div>

              {tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                      >
                        <Icon name="x" size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          {/* Content / Description */}
          <FormField
            label="Article Content *"
            hint="Full body content for the blog post."
            error={clientErrors.description}
          >
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Article body content…"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 bg-white border ${
                clientErrors.description
                  ? "border-rose-400 focus:ring-rose-500/20"
                  : "border-slate-200 focus:ring-slate-400/20"
              } rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all leading-relaxed`}
            />
          </FormField>

          {/* SEO Metadata Collapsible */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-100/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon name="flag" size={13} className="text-slate-400" />
                <span>SEO & Search Engine Metadata</span>
              </div>
              <span className={`transform transition-transform duration-200 ${showSeo ? "rotate-180" : ""}`}>
                <Icon name="chev" size={12} />
              </span>
            </button>

            {showSeo && (
              <div className="p-4 border-t border-slate-200 space-y-3.5 bg-white">
                <FormField label="Meta Title" hint="Overrides article title in Google search results.">
                  <TextInput
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Search engine optimized title…"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="Meta Description" hint="Snippet shown beneath search engine results.">
                  <TextInput
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Short description for search preview…"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="Meta Keywords" hint="Comma-separated keywords for SEO indexing.">
                  <TextInput
                    value={metaKeywordsInput}
                    onChange={(e) => setMetaKeywordsInput(e.target.value)}
                    placeholder="e.g. aurus hostel, co-living bangalore, student accommodation"
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
          <Btn variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Btn>
          <Btn variant="brand" size="md" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin">
                  <Icon name="refresh" size={13} />
                </span>
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Icon name="check" size={13} />
                <span>Save Changes</span>
              </>
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
}

