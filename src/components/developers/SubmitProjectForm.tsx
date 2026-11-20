"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import useMasterStore from "@/store/useMasterStore";
import { EnquiryGender } from "@/types/enquiry.types";
import { Eyebrow, Panel } from "@/components/ui/Primitives";
import { ViewReveal } from "@/components/animation";
import { submitProjectData } from "@/data/developers/submitProject";

export function SubmitProjectForm() {
  const submitProject = submitProjectData;
  const { publicCities, fetchPublicCities } = useMasterStore();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [hostelCity, setHostelCity] = useState("");
  const [gender, setGender] = useState<EnquiryGender | "">("");
  const [message, setMessage] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchPublicCities();
  }, [fetchPublicCities]);

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
      setErrorMessage("Please enter your mobile number.");
      return;
    }

    if (!hostelCity.trim()) {
      setErrorMessage("Please select a hostel city.");
      return;
    }

    if (!gender) {
      setErrorMessage("Please select hostel gender (boys or girls).");
      return;
    }

    if (!agreeToTerms) {
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
          email: email.trim() || undefined,
          hostelCity: hostelCity.trim(),
          gender,
          message: message.trim() || undefined,
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

      setSubmittedName(fullName.trim());
      setIsSubmitted(true);
      setFullName("");
      setMobileNumber("");
      setEmail("");
      setHostelCity("");
      setGender("");
      setMessage("");
      setAgreeToTerms(false);
    } catch {
      setErrorMessage("Something went wrong. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="submit-property" className="px-4 sm:px-6 lg:px-0 py-8 sm:py-12 lg:py-16">
      <Panel
        className="bg-ink text-white rounded-[28px] sm:rounded-[40px] lg:rounded-[57px] shadow-2xl"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        <Eyebrow dark={true}>{submitProject.eyebrow}</Eyebrow>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Heading & Information */}
          <div className="lg:col-span-5 flex flex-col justify-start gap-4 sm:gap-6 lg:gap-8">
            <h2 className="font-sans font-light uppercase text-3xl sm:text-4xl md:text-5xl lg:text-[72px] leading-[1.05] text-white">
              {submitProject.title}
            </h2>

            <p className="font-sans font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-white/50 max-w-lg">
              {submitProject.body}
            </p>

            <span className="font-sans font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-white/50">
              Or write to:{" "}
              <a
                href={`mailto:${submitProject.email}`}
                className="underline underline-offset-4 decoration-white/50 hover:text-white hover:decoration-white transition-colors"
              >
                {submitProject.email}
              </a>
            </span>
          </div>

          {/* Right Column: Submission Form Card */}
          <div className="lg:col-span-7">
            <ViewReveal duration={800} startDelay={100}>
              <div className="rounded-[10px] sm:rounded-[20px] bg-white text-ink p-6 sm:p-8 lg:p-10 shadow-2xl">
                {isSubmitted ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-7 h-7"
                        aria-hidden="true"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="font-sans text-xl font-medium text-ink">
                      Property Details Received
                    </h3>
                    <p className="font-sans text-[14px] text-muted max-w-sm mt-2">
                      Thank you{submittedName ? `, ${submittedName}` : ""}. Our institutional partnerships team will evaluate your property and connect with you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmittedName("");
                        setFullName("");
                        setMobileNumber("");
                        setEmail("");
                        setHostelCity("");
                        setGender("");
                        setMessage("");
                        setAgreeToTerms(false);
                      }}
                      className="mt-6 font-mono text-[11px] tracking-[2px] uppercase text-ink underline underline-offset-4 hover:opacity-75"
                    >
                      Submit another property
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Error Alert */}
                    {errorMessage && (
                      <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-[13px] font-medium leading-relaxed">
                        {errorMessage}
                      </div>
                    )}

                    {/* Row 1: Full Name & Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                        >
                          FULL NAME *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50 disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="mobileNumber"
                          className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                        >
                          MOBILE NUMBER *
                        </label>
                        <input
                          id="mobileNumber"
                          type="tel"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="+91 98765 43210"
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50 disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Hostel City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                        >
                          EMAIL
                          {/* <span className="text-[10px] font-normal lowercase">(optional)</span> */}
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="rajesh@company.com"
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50 disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="hostelCity"
                          className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                        >
                          HOSTEL CITY *
                        </label>
                        <div className="relative">
                          <select
                            id="hostelCity"
                            required
                            value={hostelCity}
                            onChange={(e) => setHostelCity(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer disabled:opacity-60"
                          >
                            <option value="">Select Hostel City</option>
                            {cityOptions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-ink/60">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Gender Selection */}
                    <div>
                      <label
                        htmlFor="gender"
                        className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                      >
                        GENDER *
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          required
                          value={gender}
                          onChange={(e) => setGender(e.target.value as EnquiryGender)}
                          disabled={isSubmitting}
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer disabled:opacity-60"
                        >
                          <option value="">Select Gender</option>
                          <option value="boys">Boys</option>
                          <option value="girls">Girls</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-ink/60">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                      >
                        MESSAGE
                        {/* <span className="text-[10px] font-normal lowercase">(optional)</span> */}
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Tell us what you're looking for or any questions you have…"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50 resize-none disabled:opacity-60"
                      />
                    </div>

                    {/* Row 5: Agreement Checkbox */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        required
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        disabled={isSubmitting}
                        className="h-4 w-4 rounded border-ink/20 text-ink focus:ring-ink"
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="font-mono text-[10px] sm:text-[10.5px] tracking-[1px] uppercase text-muted leading-tight cursor-pointer select-none"
                      >
                        I AGREE TO THE{" "}
                        <Link href="/terms" className="underline hover:text-ink">
                          TERMS
                        </Link>{" "}
                        AND{" "}
                        <Link href="/privacy" className="underline hover:text-ink">
                          PRIVACY POLICY
                        </Link>{" "}
                        AND TO BE CONTACTED BY AURUS.
                      </label>
                    </div>

                    {/* Row 6: Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 rounded-full bg-ink text-white font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>SUBMITTING...</span>
                          </>
                        ) : (
                          <span>REQUEST CALLBACK</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </ViewReveal>
          </div>
        </div>
      </Panel>
    </section>
  );
}

export default SubmitProjectForm;
