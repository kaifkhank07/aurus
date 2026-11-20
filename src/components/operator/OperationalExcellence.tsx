"use client";

import { Container, Eyebrow } from "@/components/ui/Primitives";
import { ViewReveal } from "@/components/animation";
import { operationalExcellenceData } from "@/data/operator/operationalExcellence";

export function OperationalExcellence() {
  const data = operationalExcellenceData;

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <Container className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Eyebrow */}
        <Eyebrow>{data.eyebrow}</Eyebrow>

        {/* 3 Pillars Row */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-ink/15 border-t border-b border-ink/15">
            {data.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-start space-y-4 sm:space-y-6 py-8 sm:py-10 lg:py-12 ${idx === 0
                  ? "md:pr-8 lg:pr-10"
                  : idx === 2
                    ? "md:pl-8 lg:pl-10"
                    : "md:px-8 lg:px-10"
                  }`}
              >
                {/* Circle Badge 01 / 02 / 03 */}
                <div className="w-8 h-8 rounded-full border border-ink/25 flex items-center justify-center font-mono text-[11px] sm:text-[12px] text-ink font-medium">
                  {pillar.number}
                </div>

                {/* Title */}
                <h3 className="font-sans font-medium text-lg sm:text-xl lg:text-[24px] text-ink">
                  {pillar.title}
                </h3>

                {/* Bullet Points */}
                <ul className="space-y-0.5">
                  {pillar.points.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="font-sans font-light text-[13px] sm:text-[16px] text-muted flex items-start gap-2"
                    >
                      <span className="text-muted/60 leading-none select-none mt-1.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default OperationalExcellence;
