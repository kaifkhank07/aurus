"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import useMasterStore from "@/store/useMasterStore";

export interface CallbackFormProps {
  className?: string;
  initialCity?: string;
  onSuccess?: () => void;
}

export function CallbackForm({
  className = "",
  initialCity = "",
  onSuccess,
}: CallbackFormProps) {
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
      setFullName("");
      setMobileNumber("");
      setCity(initialCity || "");
      setRole("");
      setMessage("");
      setAgreed(false);

      if (onSuccess) {
        onSuccess();
      }

      // Auto-clear success notification after 6 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 6000);
    } catch {
      setErrorMessage("Something went wrong. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 sm:space-y-4.5 ${className}`}>
      {/* Error Feedback Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-[10px] sm:rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-[13px] font-medium leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* Success Notification */}
      {isSubmitted && (
        <div className="p-3.5 rounded-[10px] sm:rounded-[12px] bg-[#C5A059]/10 border border-[#C5A059]/30 text-ink text-center space-y-1 animate-in fade-in">
          <p className="font-mono text-[11px] sm:text-[12px] tracking-[1px] text-[#C5A059] uppercase font-semibold">
            Thank you!
          </p>
          <p className="font-sans text-[12px] sm:text-[13px] text-muted">
            Our concierge will review your enquiry and call you back shortly.
          </p>
        </div>
      )}

      {/* Row 1: Full Name & Mobile Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
            FULL NAME *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSubmitting}
            placeholder="John Doe"
            className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink transition-all disabled:opacity-60"
          />
        </div>

        <div>
          <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
            MOBILE NUMBER *
          </label>
          <input
            type="tel"
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            disabled={isSubmitting}
            placeholder="+91 98765 43210"
            className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink transition-all disabled:opacity-60"
          />
        </div>
      </div>

      {/* Row 2: City & I Am A */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
            CITY *
          </label>
          <div className="relative">
            <select
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink appearance-none cursor-pointer transition-all disabled:opacity-60"
            >
              <option value="">Select City</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink/60">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
            I AM A *
          </label>
          <div className="relative">
            <select
              value={role}
              required
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink appearance-none cursor-pointer transition-all disabled:opacity-60"
            >
              <option value="">Select Category</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-ink/60">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Message */}
      <div>
        <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
          MESSAGE *
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          placeholder="Tell us what you're looking for or any questions you have…"
          className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink resize-none transition-all disabled:opacity-60"
        />
      </div>

      {/* Row 4: Checkbox Agreement */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-ink/30 text-ink focus:ring-ink mt-0.5"
          />
          <span className="font-sans uppercase text-[10px] lg:text-[14px] text-muted leading-tight">
            I AGREE TO THE{" "}
            <Link href="/terms" className="underline hover:text-ink">
              TERMS
            </Link>{" "}
            AND{" "}
            <Link href="/privacy" className="underline hover:text-ink">
              PRIVACY POLICY
            </Link>{" "}
            AND TO BE CONTACTED BY AURUS
          </span>
        </label>
      </div>

      {/* Row 5: Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] font-medium rounded-full bg-ink text-paper py-3.5 sm:py-4 hover:bg-neutral-800 transition-all duration-300 shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
              <span>SUBMITTING…</span>
            </>
          ) : (
            <span>REQUEST CALLBACK</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default CallbackForm;
