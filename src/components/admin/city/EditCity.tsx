"use client";

import React, { useState, useEffect } from "react";
import { useMasterStore } from "@/store/useMasterStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeCity, UpdateCityInput } from "@/types/city.types";
import { getMediaUrl } from "@/lib/media";

export interface EditCityProps {
  open: boolean;
  city: SafeCity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCity({ open, city, onClose, onSuccess }: EditCityProps) {
  const { updateCity } = useMasterStore();

  const [cityName, setCityName] = useState(city?.city || "");
  const [state, setState] = useState(city?.state || "");
  const [country, setCountry] = useState(city?.country || "India");
  const [sortOrder, setSortOrder] = useState<number>(city?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(city?.isActive ?? true);

  // Existing image from server
  const [existingImage, setExistingImage] = useState<SafeCity["image"] | null>(city?.image || null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  // New Image Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // SEO Fields
  const meta = city?.metadata;
  const [showSeo, setShowSeo] = useState(
    Boolean(meta?.title || meta?.description || (meta?.keywords && meta.keywords.length > 0))
  );
  const [seoTitle, setSeoTitle] = useState(meta?.title || "");
  const [seoDescription, setSeoDescription] = useState(meta?.description || "");
  const [seoKeywords, setSeoKeywords] = useState(meta?.keywords ? meta.keywords.join(", ") : "");

  // Validation & Submission
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!open || !city) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setClientErrors((prev) => ({
          ...prev,
          image: "Only image files (JPEG, PNG, WebP, SVG) are allowed.",
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
      setRemoveExistingImage(false);
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

  const handleRemoveExistingImage = () => {
    setRemoveExistingImage(true);
    setExistingImage(null);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!cityName.trim()) {
      errors.city = "City name cannot be empty.";
    } else if (cityName.trim().length > 100) {
      errors.city = "City name cannot exceed 100 characters.";
    }

    if (!state.trim()) {
      errors.state = "State cannot be empty.";
    } else if (state.trim().length > 100) {
      errors.state = "State cannot exceed 100 characters.";
    }

    if (!country.trim()) {
      errors.country = "Country cannot be empty.";
    } else if (country.trim().length > 100) {
      errors.country = "Country cannot exceed 100 characters.";
    }

    if (seoTitle.trim().length > 200) {
      errors.seoTitle = "SEO Title cannot exceed 200 characters.";
    }

    if (seoDescription.trim().length > 500) {
      errors.seoDescription = "SEO Description cannot exceed 500 characters.";
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

    const keywords = seoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const metadata =
      seoTitle.trim() || seoDescription.trim() || keywords.length > 0
        ? {
            title: seoTitle.trim() || undefined,
            description: seoDescription.trim() || undefined,
            keywords: keywords.length > 0 ? keywords : undefined,
          }
        : undefined;

    let res;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("city", cityName.trim());
      formData.append("state", state.trim());
      formData.append("country", country.trim());
      formData.append("sortOrder", String(Number(sortOrder) || 0));
      formData.append("isActive", String(isActive));
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata));
      }
      formData.append("image", selectedFile);

      res = await updateCity(city.id, formData);
    } else {
      const payload: UpdateCityInput = {
        city: cityName.trim(),
        state: state.trim(),
        country: country.trim(),
        sortOrder: Number(sortOrder) || 0,
        isActive,
        metadata,
      };

      if (removeExistingImage) {
        payload.image = null;
      }

      res = await updateCity(city.id, payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to update city. Please try again.");
    }
  };

  const imageUrl =
    previewUrl || getMediaUrl(existingImage?.url || existingImage?.publickey);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Edit City</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                /{city.slug}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Update information, status, cover image, and SEO details.
            </p>
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
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="City Name *" error={clientErrors.city}>
              <TextInput
                value={cityName}
                onChange={(e) => {
                  setCityName(e.target.value);
                  if (clientErrors.city) {
                    setClientErrors((prev) => ({ ...prev, city: "" }));
                  }
                }}
                placeholder="e.g. Pune"
                error={Boolean(clientErrors.city)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="State *" error={clientErrors.state}>
              <TextInput
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  if (clientErrors.state) {
                    setClientErrors((prev) => ({ ...prev, state: "" }));
                  }
                }}
                placeholder="e.g. Maharashtra"
                error={Boolean(clientErrors.state)}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Country *" error={clientErrors.country}>
              <TextInput
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (clientErrors.country) {
                    setClientErrors((prev) => ({ ...prev, country: "" }));
                  }
                }}
                placeholder="e.g. India"
                error={Boolean(clientErrors.country)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Sort Order" hint="Lower values appear first in lists">
              <TextInput
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <input
              type="checkbox"
              id="edit-city-isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 transition cursor-pointer"
            />
            <label
              htmlFor="edit-city-isActive"
              className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
            >
              Active and visible across the student platform
            </label>
          </div>

          {/* Image Management */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              City Cover Image
            </label>

            {previewUrl ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="New Preview" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {selectedFile?.name} (New)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedFile ? (selectedFile.size / 1024).toFixed(1) + " KB" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveNewImage}
                  disabled={isSubmitting}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            ) : existingImage && !removeExistingImage ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200 flex items-center justify-center">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={cityName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <Icon name="building" size={20} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Current Image
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {existingImage.publickey}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveExistingImage}
                    disabled={isSubmitting}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer text-center">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
                  <Icon name="building" size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {removeExistingImage ? "Select replacement image" : "Click to upload an image"}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>
            )}
            {clientErrors.image && (
              <span className="text-xs text-rose-600 font-medium">{clientErrors.image}</span>
            )}
          </div>

          {/* SEO Metadata Accordion */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
            <button
              type="button"
              onClick={() => setShowSeo((prev) => !prev)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon name="search" size={13} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-800">
                  SEO & Search Metadata (Optional)
                </span>
              </div>
              <span
                className={`text-slate-400 transition-transform duration-200 ${
                  showSeo ? "rotate-180" : ""
                }`}
              >
                <Icon name="chev" size={12} />
              </span>
            </button>

            {showSeo && (
              <div className="p-4 pt-1 space-y-3 bg-white border-t border-slate-100">
                <FormField label="Meta Title" error={clientErrors.seoTitle}>
                  <TextInput
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Student Hostels in Pune | Aurus Residences"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="Meta Description" error={clientErrors.seoDescription}>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description for search engines…"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition"
                  />
                </FormField>

                <FormField
                  label="Keywords"
                  hint="Separate keywords with commas (e.g. pune, hostels, students)"
                >
                  <TextInput
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="pune, student residence, luxury rooms"
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
          <Btn
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Btn>
          <Btn
            variant="brand"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin">
                  <Icon name="refresh" size={13} />
                </span>
                <span>Updating…</span>
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
