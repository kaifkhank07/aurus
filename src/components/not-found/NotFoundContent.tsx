"use client";

import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { notFoundData } from "@/data/not-found";

export default function NotFoundContent() {
  return (
    <div className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Eyebrow */}
        <Eyebrow>{notFoundData.eyebrow}</Eyebrow>

        {/* Hero Section */}
        <ViewReveal duration={800}>
          <div className="mt-8 sm:mt-12 lg:mt-16 relative z-10 max-w-6xl mx-auto overflow-hidden">
            {/* Centered 404 Background Watermark */}
            <h3
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit whitespace-nowrap font-sans font-medium text-[120px] sm:text-[180px] md:text-[240px] lg:text-[280px] text-ink/[0.05] select-none leading-none tracking-tighter pointer-events-none z-0"
            >
              {notFoundData.code}
            </h3>

            {/* Heading */}
            <Heading
              as="h1"
              title1={notFoundData.titleTop}
              title2={notFoundData.titleAccent}
              className="uppercase text-center max-w-lg sm:max-w-4xl lg:max-w-5xl mx-auto"
            />

            {/* Description */}
            <p className="mt-4 sm:mt-5 lg:mt-6 text-center max-w-[64ch] mx-auto font-sans font-normal text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
              {notFoundData.description}
            </p>

            {/* Action Pills */}
            <div className="mt-6 sm:mt-8 text-center w-fit mx-auto flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              {notFoundData.actions.map((action, idx) => {
                const isSolid = action.variant === "solid";
                return (
                  <Link
                    key={idx}
                    href={action.href}
                    className={`flex items-center justify-center h-[40px] sm:h-[44px] px-6 sm:px-7 rounded-full font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase transition-all duration-300 ${isSolid
                      ? "bg-ink text-white hover:bg-neutral-800 shadow-sm"
                      : "border border-ink/30 text-ink hover:bg-ink hover:text-white"
                      }`}
                  >
                    <span>{action.label}</span>
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5 ml-2"
                      aria-hidden="true"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </ViewReveal>

        {/* Assistance Card */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="mt-10 sm:mt-12 lg:mt-16 rounded-[20px] sm:rounded-[28px] bg-ink text-white p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
            <div>
              <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-white/60 block">
                {notFoundData.assistance.heading}
              </span>
              <p className="font-sans text-[13px] sm:text-[14px] lg:text-[15px] text-white/75 mt-1.5 max-w-xl leading-[1.6]">
                {notFoundData.assistance.subtext}
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href={notFoundData.assistance.ctaHref}
                className="inline-flex items-center justify-center h-[42px] px-6 rounded-full border border-white/30 text-white font-mono text-[11px] tracking-[2px] uppercase hover:bg-white hover:text-ink transition-all duration-300"
              >
                <span>{notFoundData.assistance.ctaLabel}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 ml-2"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </div>
  );
}
