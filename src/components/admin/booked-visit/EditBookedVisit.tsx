"use client";

import React, { useState, useEffect } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import {
  SafeBookedVisit,
  BookedVisitStatus,
  BOOKED_VISIT_STATUSES,
  BOOKED_VISIT_STATUS_LABELS,
  UpdateBookedVisitInput,
} from "@/types/booked-visit.types";

export interface EditBookedVisitProps {
  open: boolean;
  visit: SafeBookedVisit | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookedVisit({
  open,
  visit,
  onClose,
  onSuccess,
}: EditBookedVisitProps) {
  const { updateBookedVisit } = useHostelAndEnquiryStore();

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [location, setLocation] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [status, setStatus] = useState<BookedVisitStatus>("new");

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visit) {
      setName(visit.name || "");
      setNumber(visit.number || "");
      setEmail(visit.email || "");
      setCollege(visit.college || "");
      setLocation(visit.location || "");
      setStatus(visit.status || "new");

      if (visit.preferredDate) {
        try {
          const d = new Date(visit.preferredDate);
          if (!isNaN(d.getTime())) {
            setPreferredDate(d.toISOString().split("T")[0]);
          } else {
            setPreferredDate("");
          }
        } catch {
          setPreferredDate("");
        }
      } else {
        setPreferredDate("");
      }

      setClientErrors({});
      setApiError(null);
    }
  }, [visit]);

  if (!open || !visit) return null;

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
      errors.name = "Visitor name is required.";
    }

    if (!number.trim() || number.trim().length < 7) {
      errors.number = "A valid phone number (at least 7 characters) is required.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!college.trim()) {
      errors.college = "College name is required.";
    }

    if (!location.trim()) {
      errors.location = "Target location / property is required.";
    }

    if (!preferredDate) {
      errors.preferredDate = "Scheduled visit date is required.";
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const payload: UpdateBookedVisitInput = {
      name: name.trim(),
      number: number.trim(),
      email: email.trim().toLowerCase(),
      college: college.trim(),
      location: location.trim(),
      preferredDate: new Date(preferredDate).toISOString(),
      status,
    };

    try {
      const res = await updateBookedVisit(visit.id, payload);

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setApiError(res.message || "Failed to update booked visit appointment.");
      }
    } catch {
      setApiError("An unexpected error occurred while updating the visit.");
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
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Icon name="pen" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Booked Visit
              </h3>
              <p className="text-xs text-slate-500">
                Update visit details, contact information, and appointment status.
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
            {/* Visitor Name */}
            <FormField
              label="Visitor Name *"
              error={clientErrors.name}
            >
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Phone Number */}
            <FormField
              label="Phone Number *"
              error={clientErrors.number}
            >
              <TextInput
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="+91 98765 43210"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <FormField
              label="Email Address *"
              error={clientErrors.email}
            >
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                disabled={isSubmitting}
              />
            </FormField>

            {/* College */}
            <FormField
              label="College / Institute *"
              error={clientErrors.college}
            >
              <TextInput
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. NMIMS Mumbai"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Location / Property */}
            <FormField
              label="Location *"
              error={clientErrors.location}
            >
              <TextInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Vile Parle, Mumbai"
                disabled={isSubmitting}
              />
            </FormField>

            {/* Preferred Date */}
            <FormField
              label="Preferred Visit Date *"
              error={clientErrors.preferredDate}
            >
              <TextInput
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          {/* Status Selection */}
          <FormField label="Status *">
            <div className="grid grid-cols-3 gap-2.5">
              {BOOKED_VISIT_STATUSES.map((s) => {
                const isSelected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    disabled={isSubmitting}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? s === "new"
                          ? "bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-200"
                          : s === "read"
                          ? "bg-sky-50 border-sky-300 text-sky-800 ring-2 ring-sky-200"
                          : "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s === "new"
                          ? "bg-amber-500"
                          : s === "read"
                          ? "bg-sky-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span>{BOOKED_VISIT_STATUS_LABELS[s]}</span>
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
