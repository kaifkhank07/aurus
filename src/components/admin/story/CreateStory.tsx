"use client";

import React, { useState, useEffect } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface CreateStoryProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateStory({ open, onClose, onSuccess }: CreateStoryProps) {
  const { createStory } = useContentStore();

  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [rating, setRating] = useState(5);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Photo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  if (!open) return null;

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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleFeaturedChange = (checked: boolean) => {
    setIsFeatured(checked);
    if (!checked) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Resident name is required.";
    } else if (name.trim().length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    if (!profession.trim()) {
      errors.profession = "Profession or college name is required.";
    } else if (profession.trim().length > 100) {
      errors.profession = "Profession cannot exceed 100 characters.";
    }

    if (!location.trim()) {
      errors.location = "Location or hostel name is required.";
    } else if (location.trim().length > 100) {
      errors.location = "Location cannot exceed 100 characters.";
    }

    if (!description.trim()) {
      errors.description = "Story review / testimonial content is required.";
    } else if (description.trim().length > 2000) {
      errors.description = "Review cannot exceed 2000 characters.";
    }

    if (isFeatured && !selectedFile) {
      errors.image = "A background or side card image is required for featured stories.";
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

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("profession", profession.trim());
    formData.append("rating", String(rating));
    formData.append("location", location.trim());
    formData.append("description", description.trim());
    formData.append("isActive", String(isActive));
    formData.append("isFeatured", String(isFeatured));

    if (isFeatured && selectedFile) {
      formData.append("image", selectedFile);
    }

    const res = await createStory(formData);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to create resident story. Please check the fields and try again.");
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
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Icon name="star" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Add Resident Story</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Add a new testimonial, rating, and review from an Aurus resident.
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{apiError}</span>
            </div>
          )}

          {/* Resident Details (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField
              label="Resident Name *"
              error={clientErrors.name}
            >
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                error={!!clientErrors.name}
                disabled={isSubmitting}
                maxLength={100}
              />
            </FormField>

            <FormField
              label="Profession / College *"
              error={clientErrors.profession}
            >
              <TextInput
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. Product Designer at Swiggy"
                error={!!clientErrors.profession}
                disabled={isSubmitting}
                maxLength={100}
              />
            </FormField>
          </div>

          {/* Rating & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Star Rating */}
            <FormField label="Rating (1 - 5 Stars) *">
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      disabled={isSubmitting}
                      className={`p-1 text-xl transition transform hover:scale-110 cursor-pointer ${
                        star <= rating ? "text-amber-400" : "text-slate-200 hover:text-amber-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {rating}.0 / 5.0
                </span>
              </div>
            </FormField>

            {/* Location */}
            <FormField
              label="Location / Residence *"
              error={clientErrors.location}
            >
              <TextInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Koramangala, Bangalore"
                error={!!clientErrors.location}
                disabled={isSubmitting}
                maxLength={100}
              />
            </FormField>
          </div>

          {/* Testimonial Review */}
          <FormField
            label="Story / Testimonial Description *"
            hint="Resident's feedback about living at Aurus."
            error={clientErrors.description}
          >
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write the resident's testimonial review here…"
              disabled={isSubmitting}
              maxLength={2000}
              className={`w-full px-3.5 py-2.5 bg-white border ${
                clientErrors.description
                  ? "border-rose-400 focus:ring-rose-500/20"
                  : "border-slate-200 focus:ring-slate-400/20"
              } rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all leading-relaxed`}
            />
          </FormField>

          {/* Visibility & Feature Toggles */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <div>
                <span className="text-xs font-bold text-slate-800">Active Status</span>
                <p className="text-[11px] text-slate-500">Display this story on the website community section.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => handleFeaturedChange(e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <div>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                  <span>★</span>
                  <span>Featured Review</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Highlight this testimonial in top sections (requires background / side card image).
                </p>
              </div>
            </label>
          </div>

          {/* Background / Side Card Image (Only shown when isFeatured is true) */}
          {isFeatured && (
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Icon name="star" size={13} className="text-amber-500" />
                  <span>Featured Background / Side Card Image *</span>
                </span>
                <p className="text-[11px] text-amber-700/80 mt-0.5">
                  This image is used as the background or side section card banner for featured stories.
                </p>
              </div>

              <FormField error={clientErrors.image}>
                {previewUrl ? (
                  <div className="relative w-full h-44 rounded-xl border border-amber-200 bg-white overflow-hidden group shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Background Card Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Icon name="x" size={12} />
                      <span>Remove Image</span>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-100/40 bg-white rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 group-hover:bg-amber-200 text-amber-600 flex items-center justify-center transition-colors">
                      <Icon name="card" size={20} />
                    </div>
                    <div className="text-xs text-center">
                      <span className="font-bold text-amber-800">Upload background / side section card image</span>
                      <p className="text-slate-400 mt-0.5 text-[11px]">High-resolution PNG, JPG or WebP (max 10MB)</p>
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
            </div>
          )}
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
                <span>Save Story</span>
              </>
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
}

