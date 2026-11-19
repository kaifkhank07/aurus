
"use client";

import { managedHowItWorks } from "@/data/managed-hostels";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <Eyebrow
        // right={
        //   <span className="font-mono text-muted text-[11px] sm:text-[12px] uppercase tracking-[2px]">
        //     {managedHowItWorks.eyebrowRight}
        //   </span>
        // }
        >
          {managedHowItWorks.eyebrowLeft}
        </Eyebrow>

        {/* Process Divider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:border-t border-line">
          {managedHowItWorks.steps.map((step, index) => {
            const isLastColumnTablet = (index + 1) % 2 === 0;
            const isLastColumnDesktop = (index + 1) % 4 === 0;

            return (
              <ViewReveal
                key={step.number}
                duration={600}
                startDelay={index * 80}
              >
                <div
                  className={[
                    "h-full min-w-0 flex flex-col py-6 sm:py-7 lg:py-6",
                    "border-t border-line lg:border-t-0",
                    "sm:px-5 lg:px-6",
                    !isLastColumnTablet
                      ? "sm:border-r sm:border-line"
                      : "sm:border-r-0",
                    !isLastColumnDesktop
                      ? "lg:border-r lg:border-line"
                      : "lg:border-r-0",
                    index % 2 === 0 ? "sm:pl-0" : "",
                    index % 4 === 0 ? "lg:pl-0" : "",
                    isLastColumnDesktop ? "lg:pr-0" : "",
                  ].join(" ")}
                >
                  <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-[#D6B86D]">
                    {step.number}
                  </span>

                  <h4 className="font-sans font-regular text-[16px] sm:text-[20px] uppercase tracking-tight mt-3">
                    {step.title}
                  </h4>

                  <p className="font-sans font-normal text-[13px] sm:text-[14px] text-muted leading-relaxed mt-2">
                    {step.description}
                  </p>
                </div>
              </ViewReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
