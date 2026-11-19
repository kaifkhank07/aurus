"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import useMasterStore from "@/store/useMasterStore";

export interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  residenceTitle?: string;
  initialCity?: string;
  residenceLocation?: string;
}

function CheckCircleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`${className} shrink-0 stroke-current`}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" strokeWidth="1.2" />
      <path
        d="M7 10l2 2 4-4"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ScheduleVisitModal({
  isOpen,
  onClose,
  residenceTitle,
  initialCity = "",
  residenceLocation = "",
}: ScheduleVisitModalProps) {
  const { publicCities, fetchPublicCities } = useMasterStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [hostelCity, setHostelCity] = useState(initialCity || residenceLocation || "");
  const [wantToVisit, setWantToVisit] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void fetchPublicCities();
  }, [fetchPublicCities]);

  useEffect(() => {
    if (initialCity) {
      setHostelCity(initialCity);
    } else if (residenceLocation && !hostelCity) {
      setHostelCity(residenceLocation);
    }
  }, [initialCity, residenceLocation, hostelCity]);

  const cityOptions = useMemo(() => {
    if (publicCities && publicCities.length > 0) {
      return publicCities
        .map((c) => c.city || c.name)
        .filter((n): n is string => Boolean(n));
    }
    return ["Mumbai", "Noida", "Ahmedabad", "Pune", "Jalandhar"];
  }, [publicCities]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;

    setFullName("");
    setPhone("");
    setEmail("");
    setCollegeName("");
    setHostelCity(initialCity || residenceLocation || "");
    setWantToVisit("");
    setAgreed(false);
    setErrorMessage(null);
    setIsSubmitted(false);

    onClose();
  }, [isSubmitting, onClose, initialCity, residenceLocation]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !mounted) return null;

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Please enter your mobile number.");
      return;
    }

    if (!hostelCity.trim()) {
      setErrorMessage("Please select a hostel city.");
      return;
    }

    if (!collegeName.trim()) {
      setErrorMessage("Please enter your college or university name.");
      return;
    }

    if (!wantToVisit) {
      setErrorMessage("Please choose your preferred visit date.");
      return;
    }

    if (!agreed) {
      setErrorMessage("Please agree to the terms and privacy policy.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/booked-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          number: phone.trim(),
          email: email.trim() || undefined,
          hostelCity: hostelCity.trim(),
          collegeName: collegeName.trim(),
          wantToVisit,
          status: "new",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(
          data?.message || "Unable to submit your visit request. Please try again."
        );
        return;
      }

      setIsSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-[42px] sm:h-[48px] rounded-[10px] border border-[#D4D4D4] bg-white px-3.5 text-[14px] text-black outline-none transition-colors focus:border-black disabled:opacity-60";

  const labelClass =
    "mb-1 sm:mb-1.5 block font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.5px] text-[#77736B]";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 p-3 sm:p-6 flex min-h-full items-center justify-center no-scrollbar"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div className="relative w-full max-w-[696px] rounded-[22px] sm:rounded-[30px] bg-white px-5 py-6 sm:px-8 sm:py-8 lg:px-[32px] lg:py-[32px] my-auto max-h-[92vh] sm:max-h-[88vh] overflow-y-auto overscroll-contain shadow-2xl no-scrollbar">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-3.5 top-3.5 sm:right-6 sm:top-6 text-black/50 transition-colors hover:text-black disabled:opacity-50 cursor-pointer p-2 rounded-full hover:bg-neutral-100 flex items-center justify-center"
          aria-label="Close modal"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 stroke-current"
            fill="none"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="flex min-h-[280px] sm:min-h-[380px] flex-col items-center justify-center text-center py-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>

            <h3 className="text-xl sm:text-2xl font-light text-black uppercase">
              Visit Request Received
            </h3>

            <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-[#77736B]">
              Our residence manager will reach out within 2 hours to confirm
              your visit.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 pr-6 sm:pr-0">
              <span className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[14px] font-light uppercase text-black">
                See it in person
              </span>

              <h3 className="text-[24px] sm:text-[32px] lg:text-[38px] font-light uppercase leading-[1.15] tracking-[-0.5px] sm:tracking-[-1px] text-black">
                Schedule a Visit
              </h3>

              <p className="mt-1.5 sm:mt-2 max-w-[580px] text-[13px] sm:text-[15px] lg:text-[16px] leading-[1.35] text-[#88847C]">
                {residenceTitle ? `Experience life at ${residenceTitle}. ` : ""}
                Guided tours run daily, 10am–7pm, and include a meal tasting.
                Can&apos;t travel? Choose a video walk-through.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 sm:mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs sm:text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleScheduleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name <span className="text-black">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSubmitting}
                    // placeholder="John Doe"
                    className={inputClass}
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Mobile Number <span className="text-black">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                    // placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>

                {/* Email Address (Optional) */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                    {/* <span className="text-[#88847C] font-normal lowercase">(optional)</span> */}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    // placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>

                {/* Hostel City */}
                <div>
                  <label htmlFor="hostelCity" className={labelClass}>
                    Hostel City <span className="text-black">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      id="hostelCity"
                      value={hostelCity}
                      required
                      onChange={(e) => setHostelCity(e.target.value)}
                      disabled={isSubmitting}
                      className={`${inputClass} appearance-none cursor-pointer pr-9`}
                    >
                      <option value="">Select Hostel City</option>
                      {cityOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-black/60 h-4 w-4" />
                  </div>
                </div>

                {/* Want to Visit (Preferred Date) */}
                <div>
                  <label htmlFor="wantToVisit" className={labelClass}>
                    Want to Visit <span className="text-black">*</span>
                  </label>
                  <input
                    id="wantToVisit"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={wantToVisit}
                    onChange={(e) => setWantToVisit(e.target.value)}
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>

                {/* College Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="collegeName" className={labelClass}>
                    College <span className="text-black">*</span>
                  </label>
                  <input
                    id="collegeName"
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    disabled={isSubmitting}
                    // placeholder="e.g. Symbiosis, NMIMS, etc."
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="mt-4 sm:mt-6 flex cursor-pointer items-start gap-2.5 text-[11.5px] sm:text-[12.5px] leading-[1.4] text-black">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={isSubmitting}
                  className="mb-[1px] h-[18px] w-[18px] shrink-0 accent-black mt-0.5 rounded"
                />

                <span className="uppercase text-[12px] sm:text-[13px]">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-neutral-600"
                  >
                    terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-neutral-600"
                  >
                    privacy policy
                  </a>
                  , and to be contacted by Aurus.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !agreed}
                className="mt-4 sm:mt-5 flex h-[46px] sm:h-[48px] w-full items-center justify-center rounded-full bg-black font-mono text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[2px] text-white transition-colors cursor-pointer hover:bg-black/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Request Visit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default ScheduleVisitModal;
