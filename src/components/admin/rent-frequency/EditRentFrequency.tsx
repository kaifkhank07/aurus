"use client";

import React, { useState } from "react";
import { useMasterStore } from "@/store/useMasterStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeRentFrequency, UpdateRentFrequencyInput } from "@/types/rent-frequency.types";

export interface EditRentFrequencyProps {
  open: boolean;
  rentFrequency: SafeRentFrequency | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRentFrequency({
  open,
  rentFrequency,
  onClose,
  onSuccess,
}: EditRentFrequencyProps) {
  const { updateRentFrequency } = useMasterStore();

  const [name, setName] = useState(rentFrequency?.name || "");
  const [isActive, setIsActive] = useState(rentFrequency?.isActive ?? true);

  // Validation & Submission
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !rentFrequency) return null;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Rent frequency name cannot be empty.";
    } else if (name.trim().length > 100) {
      errors.name = "Rent frequency name cannot exceed 100 characters.";
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

    const payload: UpdateRentFrequencyInput = {
      name: name.trim(),
      isActive,
    };

    const res = await updateRentFrequency(rentFrequency.id, payload);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to update rent frequency. Please try again.");
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
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Edit Rent Frequency</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Update billing cycle label and active status.
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

          <FormField
            label="Rent Frequency Name *"
            error={clientErrors.name}
            hint="Display name for this rent billing cycle"
          >
            <TextInput
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (clientErrors.name) {
                  setClientErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              placeholder="e.g. Monthly"
              error={Boolean(clientErrors.name)}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <input
              type="checkbox"
              id="edit-rent-frequency-isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 transition cursor-pointer"
            />
            <label
              htmlFor="edit-rent-frequency-isActive"
              className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
            >
              Active and selectable in residence pricing plans
            </label>
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
