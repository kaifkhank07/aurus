"use client";

import React, { useState } from "react";
import Link from "next/link";
import { contactData, ContactPageData } from "@/data/contact";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";


export function CallYouBack() {
  const data = contactData.callback;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    city: "",
    role: "",
    message: "",
    agreed: false,
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobileNumber || !formData.agreed) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        mobileNumber: "",
        city: "",
        role: "",
        message: "",
        agreed: false,
      });
    }, 5000);
  };

  return (
    <section className="py-10 sm:py-14 lg:py-18">
      <Container>
        {/* Eyebrow & Section Heading */}
        <p className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-3 block">
          {data.eyebrow}
        </p>

        <Heading
          title1={data.titleTop}
          title2={data.titleAccent}
          className="uppercase max-w-4xl"
        />

        <ViewReveal duration={800} startDelay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-10 sm:mt-12 lg:mt-16 items-start">
            {/* Left Column: Callback Form */}
            <div className="lg:col-span-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                {/* Row 1: Full Name & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
                      MOBILE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, mobileNumber: e.target.value })
                      }
                      className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: City & I Am A */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
                      CITY
                    </label>
                    <div className="relative">
                      <select
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink appearance-none cursor-pointer transition-all"
                      >
                        <option value="">Select City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Noida">Noida</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Jalandhar">Jalandhar</option>
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
                      I AM A
                    </label>
                    <div className="relative">
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink appearance-none cursor-pointer transition-all"
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
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full rounded-[10px] sm:rounded-[12px] bg-white/70 border border-ink/15 px-4 py-3 font-sans text-[13px] sm:text-[14px] text-ink focus:bg-white focus:outline-none focus:border-ink resize-none transition-all"
                  />
                </div>

                {/* Row 4: Checkbox Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreed}
                      onChange={(e) =>
                        setFormData({ ...formData, agreed: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-ink/30 text-ink focus:ring-ink"
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
                    className="w-full font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] font-medium rounded-full bg-ink text-paper py-3.5 sm:py-4 hover:bg-neutral-800 transition-all duration-300 shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    REQUEST CALLBACK
                  </button>
                </div>

                {submitted && (
                  <p className="font-mono text-[11px] tracking-[1px] text-[#C5A059] text-center pt-1">
                    Thank you! Our concierge will call you back shortly.
                  </p>
                )}
              </form>
            </div>

            {/* Right Column: Where To Find Us Directory */}
            <div className="lg:col-span-6 lg:pl-4 xl:pl-8">
              <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-4 block">
                {data.directoryEyebrow}
              </span>

              <div className="border-t border-ink/15">
                {data.locations.map((loc) => (
                  <div
                    key={loc.name}
                    className="border-b border-ink/15 py-4 sm:py-4.5 flex items-baseline justify-between gap-4 transition-colors hover:bg-black/[0.01]"
                  >
                    {/* Location Name */}
                    <span className="font-sans font-light text-[12px] sm:text-[16px] lg:text-[20px] text-ink w-[110px] sm:w-[130px] shrink-0">
                      {loc.name}
                    </span>

                    {/* Detail / Address / Chapters */}
                    <span className="font-sans font-light text-[10px] sm:text-[12px] lg:text-[14px] text-muted leading-relaxed flex-1">
                      {loc.detail}
                    </span>

                    {/* Action Link (MAP / VIEW) */}
                    <Link
                      href={loc.actionHref}
                      target={loc.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel={loc.actionHref.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-mono uppercase text-[10px] sm:text-[12px] text-ink hover:text-muted transition shrink-0 underline"
                    >
                      {loc.actionText}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Social Links Row */}
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Aurus Instagram"
                  className="w-8 h-8 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Aurus LinkedIn"
                  className="w-8 h-8 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Aurus X"
                  className="w-8 h-8 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default CallYouBack;
