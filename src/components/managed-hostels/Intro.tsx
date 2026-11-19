"use client";

import { managedIntro } from "@/data/managed-hostels";
import { Container } from "@/components/ui/Primitives";
import NumberRoller from "../animation/NumberRoller";
import ViewReveal from "../animation/ViewReveal";

export function Intro() {
  return (
    <section id="intro" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Main Statement */}
        <ViewReveal duration={800}>
          <p className="font-sans font-normal text-[clamp(1.375rem,2.1875vw,42px)] leading-[1.4286] tracking-[-0.04em] max-w-[1683px]">
            {managedIntro.statement}
          </p>
        </ViewReveal>

        {/* Stats Row */}
        <div className="mt-10 sm:mt-12 lg:mt-16 space-y-6 sm:space-y-8 lg:space-y-12">
          {/* Mobile & Tablet Stats (< lg): 2x2 Grid of rounded cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {managedIntro.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[12px] bg-paper p-5 sm:p-6 flex flex-col justify-between"
              >
                <NumberRoller
                  value={stat.value}
                  className="font-sans text-[28px] sm:text-[34px] font-semibold text-ink tracking-[-0.03em] tabular-nums"
                />
                <span className="font-space-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted mt-3 block">
                  {stat.label === "Resident Support" ? "SUPPORT" : stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop Stats (>= lg): 4-column divider row */}
          <dl className="hidden lg:grid lg:grid-cols-4">
            {managedIntro.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-[2.4vw] ${i > 0 ? "border-l border-line" : ""}`}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <NumberRoller
                    value={stat.value}
                    className="font-sans font-normal uppercase text-[clamp(2.25rem,2.9167vw,56px)] leading-[1] tracking-[-0.04em] tabular-nums"
                  />
                  <span className="font-sans font-normal text-[14px] leading-[1.4286] tracking-[-0.04em] mt-3 block uppercase text-ink">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
