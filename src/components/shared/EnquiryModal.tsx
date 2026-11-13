"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import useMasterStore from "@/store/useMasterStore";

export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string;
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

export function EnquiryModal({
  isOpen,
  onClose,
  initialCity = "",
}: EnquiryModalProps) {
  const { publicCities, fetchPublicCities } = useMasterStore();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState(initialCity);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
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
      setCity(initialCity);
    }
  }, [initialCity]);

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
    setMobileNumber("");
    setCity(initialCity || "");
    setRole("");
    setMessage("");
    setAgreed(false);
    setErrorMessage(null);
    setIsSubmitted(false);

    onClose();
  }, [isSubmitting, onClose, initialCity]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    if (!city.trim()) {
      setErrorMessage("Please select a city.");
      return;
    }

    if (!role.trim()) {
      setErrorMessage("Please select your category / role.");
      return;
    }

    if (!message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    if (!agreed) {
      setErrorMessage("Please agree to the terms and privacy policy.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          number: mobileNumber.trim(),
          location: city.trim(),
          iam: role.trim(),
          message: message.trim(),
          status: "new",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(
          data?.message || "Unable to submit your enquiry. Please check your details and try again."
        );
        return;
      }

      setIsSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch {
      setErrorMessage("Something went wrong. Please check your internet connection and try again.");
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

            <h3 className="text-xl sm:text-2xl font-light uppercase text-black">
              Enquiry Received
            </h3>

            <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-[#77736B]">
              Our concierge team will review your enquiry and reach out to you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 pr-6 sm:pr-0">
              <span className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[14px] font-light uppercase text-black">
                Connect with us
              </span>

              <h3 className="text-[24px] sm:text-[32px] lg:text-[38px] font-light uppercase leading-[1.15] tracking-[-0.5px] sm:tracking-[-1px] text-black">
                Enquire Now
              </h3>

              <p className="mt-1.5 sm:mt-2 max-w-[580px] text-[13px] sm:text-[15px] lg:text-[16px] leading-[1.35] text-[#88847C]">
                Have a question about room categories, dining, or amenities? Leave your details and our team will get back to you shortly.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 sm:mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs sm:text-sm text-rose-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Full Name */}
                <div>
                  <label htmlFor="enquiry-fullName" className={labelClass}>
                    Full Name <span className="text-black">*</span>
                  </label>
                  <input
                    id="enquiry-fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="enquiry-mobileNumber" className={labelClass}>
                    Mobile Number <span className="text-black">*</span>
                  </label>
                  <input
                    id="enquiry-mobileNumber"
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="enquiry-city" className={labelClass}>
                    City <span className="text-black">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      id="enquiry-city"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                      disabled={isSubmitting}
                      className={`${inputClass} appearance-none cursor-pointer pr-9`}
                    >
                      <option value="">Select City</option>
                      {cityOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-black/60 h-4 w-4" />
                  </div>
                </div>

                {/* Category / Role */}
                <div>
                  <label htmlFor="enquiry-role" className={labelClass}>
                    I Am A <span className="text-black">*</span>
                  </label>
                  <div className="relative w-full">
                    <select
                      id="enquiry-role"
                      value={role}
                      required
                      onChange={(e) => setRole(e.target.value)}
                      disabled={isSubmitting}
                      className={`${inputClass} appearance-none cursor-pointer pr-9`}
                    >
                      <option value="">Select Category</option>
                      <option value="Student">Student</option>
                      <option value="Parent">Parent</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-black/60 h-4 w-4" />
                  </div>
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="enquiry-message" className={labelClass}>
                    Message <span className="text-black">*</span>
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Tell us what you're looking for or any questions you have…"
                    className="w-full rounded-[10px] border border-[#D4D4D4] bg-white p-3.5 text-[14px] text-black outline-none transition-colors focus:border-black resize-none disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
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
                  <Link
                    href="/terms"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-neutral-600"
                  >
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-neutral-600"
                  >
                    privacy policy
                  </Link>
                  , and to be contacted by Aurus.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !agreed}
                className="mt-4 sm:mt-5 flex h-[46px] sm:h-[48px] w-full items-center justify-center rounded-full bg-black font-mono text-[11px] sm:text-[12px] uppercase tracking-[1.5px] sm:tracking-[2px] text-white transition-colors cursor-pointer hover:bg-black/80 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Request Callback"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default EnquiryModal;

