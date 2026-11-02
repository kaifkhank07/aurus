"use client";

import React from "react";
import Link from "next/link";
import { contactData } from "@/data/contact";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import { CallbackForm } from "./CallbackForm";

export function CallYouBack() {
  const data = contactData.callback;

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
              <CallbackForm />
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
