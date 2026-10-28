"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/ui/Primitives";
import { ViewReveal } from "@/components/animation";
import { developersData } from "@/data/developers";

export function SubmitProjectForm() {
  const { submitProject } = developersData;

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    city: "",
    propertyType: "",
    message: "",
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobileNumber || !formData.email) {
      alert("Please fill in the required fields (Name, Mobile, Email).");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms and Privacy Policy to proceed.");
      return;
    }

    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <section id="submit-property" className="py-12 sm:py-16 lg:py-24">
      <Panel
        className="bg-ink text-white rounded-[28px] sm:rounded-[40px] lg:rounded-[57px] shadow-2xl"
        innerClassName="py-12 sm:py-16 lg:py-20 !px-6 sm:!px-10 lg:!px-[min(4.5313vw,87px)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Information */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-white/60 mb-3 block">
              {submitProject.eyebrow}
            </span>

            <h2 className="font-sans font-light uppercase text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.05] text-white">
              {submitProject.title}
            </h2>

            <p className="mt-5 sm:mt-6 font-sans font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-white/70 max-w-md">
              {submitProject.body}
            </p>

            <div className="mt-8 pt-6 border-t border-white/15">
              <span className="font-sans text-[13px] sm:text-[14px] text-white/70">
                Or write to:{" "}
                <a
                  href={`mailto:${submitProject.email}`}
                  className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white font-mono text-[13px] tracking-[1px] transition-colors"
                >
                  {submitProject.email}
                </a>
              </span>
            </div>
          </div>

          {/* Right Column: Submission Form Card */}
          <div className="lg:col-span-7">
            <ViewReveal duration={800} startDelay={100}>
              <div className="rounded-[22px] sm:rounded-[28px] bg-white text-ink p-6 sm:p-8 lg:p-10 shadow-2xl">
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
                      Thank you, {formData.fullName}. Our institutional partnerships team will evaluate your property and connect with you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: "",
                          mobileNumber: "",
                          email: "",
                          city: "",
                          propertyType: "",
                          message: "",
                          agreeToTerms: false,
                        });
                      }}
                      className="mt-6 font-mono text-[11px] tracking-[2px] uppercase text-ink underline underline-offset-4 hover:opacity-75"
                    >
                      Submit another property
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
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
                          value={formData.mobileNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobileNumber: e.target.value,
                            })
                          }
                          placeholder="+91 98765 43210"
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                      >
                        EMAIL *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="rajesh@company.com"
                        className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
                      />
                    </div>

                    {/* Row 3: City & Property Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                        >
                          CITY
                        </label>
                        <input
                          id="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder="e.g. Bengaluru, Pune"
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="propertyType"
                          className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                        >
                          PROPERTY TYPE
                        </label>
                        <select
                          id="propertyType"
                          value={formData.propertyType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyType: e.target.value,
                            })
                          }
                          className="w-full h-11 px-3.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                        >
                          <option value="">Select Property Type</option>
                          {submitProject.propertyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Tell Us More */}
                    <div>
                      <label
                        htmlFor="message"
                        className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted block mb-1.5"
                      >
                        TELL US MORE
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Total bed capacity, plot size, location proximity to universities, timeline..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-cream/30 text-ink text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50 resize-none"
                      />
                    </div>

                    {/* Row 5: Agreement Checkbox */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agreeToTerms: e.target.checked,
                          })
                        }
                        className="mt-1 h-4 w-4 rounded border-ink/20 text-ink focus:ring-ink"
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="font-mono text-[10px] sm:text-[10.5px] tracking-[1px] uppercase text-muted leading-tight"
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
                        className="w-full h-12 rounded-full bg-ink text-white font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
                      >
                        {isSubmitting ? (
                          <span>SUBMITTING...</span>
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
