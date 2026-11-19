"use client";

import React, { useState, useEffect } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import {
  SafeEnquiry,
  EnquiryStatus,
  EnquiryGender,
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABELS,
  ENQUIRY_GENDERS,
  ENQUIRY_GENDER_LABELS,
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
  const [email, setEmail] = useState("");
  const [hostelCity, setHostelCity] = useState("");
  const [gender, setGender] = useState<EnquiryGender>("boys");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<EnquiryStatus>("new");

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (enquiry) {
      setName(enquiry.name || "");
      setNumber(enquiry.number || "");
      setEmail(enquiry.email || "");
      setHostelCity(enquiry.hostelCity || "");
      setGender(enquiry.gender || "boys");
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

    if (email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!hostelCity.trim()) {
      errors.hostelCity = "Hostel city is required.";
    }

    if (!gender) {
      errors.gender = "Hostel gender category is required.";
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const payload: UpdateEnquiryInput = {
      name: name.trim(),
      number: number.trim(),
      email: email.trim() || null,
      hostelCity: hostelCity.trim(),
      gender,
      message: message.trim() || null,
      status,
    };

    try {
      const res = await updateEnquiry(enquiry.id, payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setApiError(res.message || "Failed to update enquiry. Please check your inputs.");
      }
    } catch {
      setApiError("An unexpected server error occurred while updating enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Icon name="pen" size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Edit Enquiry Lead
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Update customer contact or enquiry details
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {apiError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
                <span className="text-rose-500 shrink-0 font-bold">!</span>
                <span className="leading-relaxed">{apiError}</span>
              </div>
            )}

            {/* Name */}
            <FormField label="Sender Full Name *" error={clientErrors.name}>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sender full name"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Number */}
            <FormField label="Mobile Number *" error={clientErrors.number}>
              <TextInput
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Phone number"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Email (Optional) */}
            <FormField label="Email Address (Optional)" error={clientErrors.email}>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Hostel City */}
            <FormField label="Hostel City *" error={clientErrors.hostelCity}>
              <TextInput
                value={hostelCity}
                onChange={(e) => setHostelCity(e.target.value)}
                placeholder="Hostel city"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Gender (boys or girls) */}
            <FormField label="Hostel Gender Category *" error={clientErrors.gender}>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as EnquiryGender)}
                disabled={isSubmitting}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                {ENQUIRY_GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {ENQUIRY_GENDER_LABELS[g]}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Message (Optional) */}
            <FormField label="Message / Inquiry Notes (Optional)" error={clientErrors.message}>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enquiry message content…"
                disabled={isSubmitting}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition resize-none disabled:opacity-50"
              />
            </FormField>

            {/* Status */}
            <FormField label="Status *">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
                disabled={isSubmitting}
                className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
              >
                {ENQUIRY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ENQUIRY_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Btn
              variant="ghost"
              size="md"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Btn>
            <Btn
              variant="brand"
              size="md"
              type="submit"
              disabled={isSubmitting}
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
                  <span>Save Changes</span>
                </>
              )}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
