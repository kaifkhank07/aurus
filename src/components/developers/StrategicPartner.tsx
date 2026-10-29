"use client";

import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { developersData } from "@/data/developers";

export function StrategicPartner() {
  const { strategicPartner } = developersData;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow */}
        <Eyebrow>{strategicPartner.eyebrow}</Eyebrow>

        {/* Heading & Intro Paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
          <div className="">
            <Heading
              as="h2"
              title1={strategicPartner.titleTop}
              title2={strategicPartner.titleAccent}
              className="uppercase"
            />
          </div>

          <div className="flex justify-start lg:justify-end">
            <div className="max-w-[52ch]">
              <p className="font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
                {strategicPartner.body}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Stats Row */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-ink/15 border-t border-ink/15 pt-8 sm:pt-10">
            {strategicPartner.stats.map((stat, idx) => {
              const isLongText = stat.number.length > 5;
              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-start ${idx === 0 ? "lg:pr-8" : idx === 3 ? "lg:pl-8" : "lg:px-8"
                    }`}
                >
                  <span
                    className={`${isLongText
                      ? "text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px]"
                      : "text-4xl sm:text-5xl lg:text-6xl xl:text-[64px]"
                      } font-sans font-light tracking-tight text-ink leading-none`}
                  >
                    {stat.number}
                  </span>
                  <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-muted mt-3 sm:mt-4">
                    {stat.label}
                  </span>
                  <p className="font-sans text-[12px] sm:text-[13px] text-ink/75 mt-1 leading-[1.4]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default StrategicPartner;
