"use client";

import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { developersData } from "@/data/developers";

export function ExecutionProcess() {
  const { executionProcess } = developersData;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow */}
        <Eyebrow>{executionProcess.eyebrow}</Eyebrow>

        {/* Heading */}
        <Heading
          as="h2"
          title1={executionProcess.titleTop}
          title2={executionProcess.titleAccent}
          className="uppercase"
          title1ClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
          title2ClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
        />

        {/* 5 Process Rows */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="border-t border-ink/15">
            {executionProcess.steps.map((step) => (
              <div
                key={step.step}
                className="border-b border-ink/15 py-5 sm:py-6 lg:py-7 flex flex-col md:flex-row md:items-baseline gap-3 md:gap-8 lg:gap-12 transition-colors duration-200 hover:bg-black/[0.015] px-2"
              >
                {/* Step Number */}
                <div className="w-14 sm:w-20 shrink-0">
                  <span className="font-sans text-2xl sm:text-3xl lg:text-4xl font-light text-muted/50">
                    {step.step}
                  </span>
                </div>

                {/* Step Title */}
                <div className="w-full md:w-64 lg:w-72 xl:w-80 shrink-0">
                  <h3 className="font-sans font-medium text-base sm:text-lg lg:text-xl text-ink">
                    {step.title}
                  </h3>
                </div>

                {/* Step Description */}
                <div className="flex-1">
                  <p className="font-sans text-[13px] sm:text-[14px] lg:text-[15px] text-balck/60 leading-[1.6]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default ExecutionProcess;
