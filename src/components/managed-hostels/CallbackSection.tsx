"use client";

import React, { useState } from "react";
import { managedCallback } from "@/data/managed-hostels";
import { Container, ArrowRight } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

export function CallbackSection() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [hostelCity, setHostelCity] = useState("Ahmedabad");
  const [moveInDate, setMoveInDate] = useState("");
  const [duration, setDuration] = useState("3–6 Months");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!mobileNumber.trim()) {
      setErrorMessage("Please enter your mobile contact number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const compiledMessage = [
      `[GIFT City Managed Residence Enquiry]`,
      moveInDate ? `Preferred Move-In: ${moveInDate}` : null,
      duration ? `Stay Duration: ${duration}` : null,
      message.trim() ? `Note: ${message.trim()}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          number: mobileNumber.trim(),
          email: email.trim() || undefined,
          hostelCity: hostelCity.trim() || "Ahmedabad",
          gender: "boys", // General/co-ed professional default
          message: compiledMessage,
          status: "new",
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(
          data?.message || "Failed to submit enquiry. Please try again."
        );
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-[46px] rounded-[12px] border border-neutral-700 bg-neutral-900/90 px-3.5 text-[13.5px] text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-white focus:bg-neutral-900 disabled:opacity-50";

  const labelClass =
    "mb-1.5 block font-mono text-[10.5px] uppercase tracking-[1px] text-neutral-400";

  return (
    <section id="callback" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column: Heading, Subtitle & Direct Action Cards */}
          <div className="flex flex-col justify-start space-y-3 sm:space-y-6">
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-muted block">
              {managedCallback.eyebrow}
            </span>

            <Heading
              title1={managedCallback.titleTop}
              title2={managedCallback.titleAccent}
              className="uppercase tracking-tight"
            />

            <p className="font-sans font-normal text-[14px] sm:text-[16px] text-ink leading-relaxed max-w-sm">
              {managedCallback.subtitle}
            </p>

            {/* Quick Contact Action Cards */}
            <div className="space-y-4">
              {/* Direct Helpline */}
              <div className="rounded-[12px] sm:rounded-[14px] bg-[#FAF9F6] p-5 sm:p-6 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-muted block">
                    {managedCallback.helpline.label}
                  </span>
                  <span className="font-sans font-medium text-[14px] sm:text-[15px] text-ink mt-1 block">
                    {managedCallback.helpline.value}
                  </span>
                </div>

                <a
                  href={`tel:${managedCallback.helpline.phone}`}
                  className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink hover:text-neutral-600 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <span>{managedCallback.helpline.cta}</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>

              {/* WhatsApp */}
              <div className="rounded-[12px] sm:rounded-[14px] bg-[#FAF9F6] p-5 sm:p-6 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10.5px] tracking-[1.5px] uppercase text-muted block">
                    {managedCallback.whatsapp.label}
                  </span>
                  <span className="font-sans font-normal text-[13px] sm:text-[14px] text-muted mt-1 block">
                    {managedCallback.whatsapp.value}
                  </span>
                </div>

                <a
                  href={`https://wa.me/${managedCallback.whatsapp.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink hover:text-neutral-600 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <span>{managedCallback.whatsapp.cta}</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Callback Request Dark Form Card */}
          <div className="h-full rounded-[12px] sm:rounded-[16px] bg-black text-white p-5 sm:p-6 lg:p-7 xl:p-8 border border-neutral-800 shadow-2xl flex flex-col">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-neutral-400 block mb-2">
              {managedCallback.formEyebrow}
            </span>

            <Heading
              title1={managedCallback.formTitleTop}
              title2={managedCallback.formTitleAccent}
              className="uppercase"
              title1ClassName="text-[38px] sm:text-[42px] md:text-[52px]"
              title2ClassName="text-[38px] sm:text-[42px] md:text-[52px]"
            />

            {isSubmitted ? (
              <div className="flex flex-1 flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-sans text-xl font-medium text-white uppercase tracking-tight">
                  Callback Requested
                </h3>
                <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
                  Thank you. Our GIFT City residence advisor will contact you within the hour.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-5 sm:mt-6 space-y-4"
              >
                {errorMessage && (
                  <div className="rounded-[10px] border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                    {errorMessage}
                  </div>
                )}

                {/* Row 1: Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label
                      htmlFor="callbackName"
                      className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                    >
                      FULL NAME <span className="text-white">*</span>
                    </label>
                    <input
                      id="callbackName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Your name"
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="callbackPhone"
                      className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                    >
                      MOBILE NUMBER <span className="text-white">*</span>
                    </label>
                    <input
                      id="callbackPhone"
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label
                      htmlFor="callbackEmail"
                      className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="callbackEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Your email"
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="callbackCity"
                      className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                    >
                      LOCATION
                    </label>
                    <input
                      id="callbackCity"
                      type="text"
                      value={hostelCity}
                      onChange={(e) => setHostelCity(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="GIFT City / Gandhinagar"
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Row 3: Move-in Date & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <label
                      htmlFor="callbackDate"
                      className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                    >
                      MOVE-IN DATE
                    </label>
                    <input
                      id="callbackDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="callbackDuration"
                      className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                    >
                      LENGTH OF STAY
                    </label>
                    <select
                      id="callbackDuration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                    >
                      <option value="1–3 Months">1–3 Months</option>
                      <option value="3–6 Months">3–6 Months</option>
                      <option value="6–11 Months">6–11 Months</option>
                      <option value="1+ Year">1+ Year</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Message */}
                <div>
                  <label
                    htmlFor="callbackMessage"
                    className="block font-mono uppercase text-[10px] sm:text-[11px] text-neutral-400 mb-2"
                  >
                    ANYTHING ELSE
                  </label>
                  <textarea
                    id="callbackMessage"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Team size, budget, special requests..."
                    className="w-full rounded-[10px] sm:rounded-[12px] bg-white border border-neutral-300 px-4 py-2.5 font-sans text-[13px] sm:text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-white transition-all disabled:opacity-60"
                  />
                </div>

                {/* Row 5: Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] font-medium rounded-full bg-white text-black px-8 py-3.5 sm:py-4 hover:bg-neutral-200 transition-all duration-300 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>SUBMITTING...</span>
                      </>
                    ) : (
                      <>
                        <span>{managedCallback.submitCta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
