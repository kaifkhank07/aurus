"use client";

import { useState } from "react";
import Link from "next/link";
import { journey } from "@/data";
import { ArrowRight, Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import ScheduleVisitModal from "./ScheduleVisitModal";

export function Journey() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-8 sm:py-12 lg:py-16 lg:pb-20">
      <Container className="relative text-center mx-auto flex flex-col items-center justify-center space-y-3 sm:space-y-5 lg:space-y-8">

        {/* Ghost wordmark */}
        <span
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute -bottom-36 -z-10 select-none text-center font-regular text-[22vw] leading-none tracking-[-0.045em] text-ink/[0.06]"
        >
          {journey.watermark}
        </span>

        <Eyebrow rule={false}>{journey.eyebrow}</Eyebrow>

        <Heading
          title1={journey.titleTop}
          title2={journey.titleAccent}
          className="max-w-[200px] sm:max-w-full uppercase"
        />

        <p className="font-sans text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] text-muted !text-[13.5px] sm:max-w-[440px] sm:!text-[15px] lg:max-w-[529px] mx-auto lg:!text-[19px] !leading-[1.5] lg:!leading-[1.32]">
          {journey.body}
        </p>

        {/* Mobile: stacked full-width pill buttons */}
        <div className="mx-auto flex w-full flex-col gap-3 sm:max-w-[420px] sm:gap-3.5 lg:hidden">
          {journey.actions.map((action) => {
            const isBooking = action.label === "Book a Visit";

            const className =
              "flex h-[48px] w-full items-center justify-center rounded-full border border-ink/35 font-mono text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-ink uppercase transition-colors duration-300 hover:bg-ink hover:text-cream sm:h-[52px] sm:text-[11px] sm:text-[12px]";

            return isBooking ? (
              <button
                key={action.href}
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={className}
              >
                <span className="inline-flex items-center gap-2">
                  {action.label}
                  <ArrowRight />
                </span>
              </button>
            ) : (
              <Link
                key={action.href}
                href={action.href}
                className={className}
              >
                <span className="inline-flex items-center gap-2">
                  {action.label}
                  <ArrowRight />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop: circular buttons with ghost watermark background */}
        <div className="relative hidden items-center justify-center lg:flex">
          <div className="flex items-center gap-[min(2.7vw,52px)]">
            {journey.actions.map((action) => {
              const isBooking = action.label === "Book a Visit";

              const className = `flex aspect-square w-[10.2vw] min-w-[120px] items-center justify-center rounded-full p-4 text-center font-mono text-[clamp(11px,0.7292vw,14px)] leading-relaxed tracking-[2px] uppercase transition-colors duration-300 cursor-pointer ${action.solid
                ? "bg-ink text-cream hover:bg-ink/85"
                : "border border-ink/35 text-ink hover:bg-ink hover:text-cream"
                }`;

              return isBooking ? (
                <button
                  key={action.href}
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className={className}
                >
                  <span className="inline-flex items-center gap-1 px-3">
                    {action.label}
                    <ArrowRight />
                  </span>
                </button>
              ) : (
                <Link
                  key={action.href}
                  href={action.href}
                  className={className}
                >
                  <span className="inline-flex items-center gap-1 px-3">
                    {action.label}
                    <ArrowRight />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </Container>

      {/* Schedule a Visit Modal */}
      <ScheduleVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </section>
  );
}