"use client";

import React, { useState, useEffect } from "react";
import { useMasterStore } from "@/store/useMasterStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { CreateAmenityInput } from "@/types/amenity.types";

export interface CreateAmenityProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAmenity({ open, onClose, onSuccess }: CreateAmenityProps) {
  const { createAmenity } = useMasterStore();

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  if (!open) return null;

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

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Amenity name is required.";
    } else if (name.trim().length > 100) {
      errors.name = "Amenity name cannot exceed 100 characters.";
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

    let res;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("isActive", String(isActive));
      formData.append("image", selectedFile);

      res = await createAmenity(formData);
    } else {
      const payload: CreateAmenityInput = {
        name: name.trim(),
        isActive,
      };
      res = await createAmenity(payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to create amenity. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Add Amenity</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Create a residence facility (e.g. High-Speed Wi-Fi, Gym, Laundry).
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

          <FormField label="Amenity Name *" error={clientErrors.name} hint="e.g. High-Speed Wi-Fi, 24/7 Security, Air Conditioning">
            <TextInput
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (clientErrors.name) {
                  setClientErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              placeholder="e.g. High-Speed Wi-Fi"
              error={Boolean(clientErrors.name)}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <input
              type="checkbox"
              id="create-amenity-isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 transition cursor-pointer"
            />
            <label
              htmlFor="create-amenity-isActive"
              className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
            >
              Active and visible in residence features
            </label>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Icon / SVG Illustration (Optional)
            </label>

            {previewUrl ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {selectedFile?.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedFile ? (selectedFile.size / 1024).toFixed(1) + " KB" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50/50 transition cursor-pointer text-center">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2">
                  <Icon name="flow" size={16} />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Click to select an icon
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  PNG, SVG, JPG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
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
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Icon name="check" size={13} />
                <span>Save Amenity</span>
              </>
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
}

