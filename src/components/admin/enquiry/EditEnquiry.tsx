"use client";

import React, { useState, useEffect } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import {
  SafeEnquiry,
  EnquiryStatus,
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  UpdateEnquiryInput,
} from "@/types/enquiry.types";

export interface EditEnquiryProps {
  open: boolean;
  enquiry: SafeEnquiry | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEnquiry({
  open,
  enquiry,
  onClose,
  onSuccess,
}: EditEnquiryProps) {
  const { updateEnquiry } = useHostelAndEnquiryStore();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState("");
  const [iam, setIam] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<EnquiryStatus>("new");

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (enquiry) {
      setName(enquiry.name || "");
      setNumber(enquiry.number || "");
      setLocation(enquiry.location || "");
      setIam(enquiry.iam || "");
      setMessage(enquiry.message || "");
      setStatus(enquiry.status || "new");

      setClientErrors({});
      setApiError(null);
    }
  }, [enquiry]);

  if (!open || !enquiry) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientErrors({});
    setApiError(null);

    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Sender name is required.";
    }

    if (!number.trim() || number.trim().length < 7) {
      errors.number = "A valid phone number (at least 7 characters) is required.";
    }

    if (!location.trim()) {
      errors.location = "Location is required.";
    }

    if (!iam.trim()) {
      errors.iam = "Profile / I am selection is required.";
    }

    if (!message.trim()) {
      errors.message = "Inquiry message is required.";
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const payload: UpdateEnquiryInput = {
      name: name.trim(),
      number: number.trim(),
      location: location.trim(),
      iam: iam.trim(),
      message: message.trim(),
      status,
    };

    try {
      const res = await updateEnquiry(enquiry.id, payload);

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setApiError(res.message || "Failed to update enquiry record.");
      }
    } catch {
      setApiError("An unexpected error occurred while updating the enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Icon name="pen" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Enquiry
              </h3>
              <p className="text-xs text-slate-500">
                Update lead details, contact information, and inquiry status.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender Name */}
            <FormField label="Full Name *" error={clientErrors.name}>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Phone Number */}
            <FormField label="Phone Number *" error={clientErrors.number}>
              <TextInput
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="+91 98765 11223"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <FormField label="Location *" error={clientErrors.location}>
              <TextInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Koramangala, Bangalore"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Profile / I Am */}
            <FormField label="Profile / I Am *" error={clientErrors.iam}>
              <TextInput
                value={iam}
                onChange={(e) => setIam(e.target.value)}
                placeholder="e.g. Student, Working Professional"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          {/* Message Content */}
          <FormField label="Inquiry Message *" error={clientErrors.message}>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter prospective tenant message or notes..."
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            />
          </FormField>

          {/* Status Selection */}
          <FormField label="Status *">
            <div className="grid grid-cols-3 gap-2.5">
              {ENQUIRY_STATUSES.map((s) => {
                const isSelected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    disabled={isSubmitting}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition flex items-center justify-center gap-2 cursor-pointer ${isSelected
                        ? s === "new"
                          ? "bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-200"
                          : s === "read"
                            ? "bg-sky-50 border-sky-300 text-sky-800 ring-2 ring-sky-200"
                            : "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${s === "new"
                          ? "bg-amber-500"
                          : s === "read"
                            ? "bg-sky-500"
                            : "bg-emerald-500"
                        }`}
                    />
                    <span>{ENQUIRY_STATUS_LABELS[s]}</span>
                  </button>
                );
              })}
            </div>
          </FormField>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Btn
              type="button"
              variant="ghost"
              size="md"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Btn>
            <Btn
              type="submit"
              variant="brand"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

