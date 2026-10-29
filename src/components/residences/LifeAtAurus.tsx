"use client";

import Link from "next/link";
import { lifeAtAurus } from "@/data/residences";
import { ArrowRight, Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export function LifeAtAurus() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow Header */}
        <Eyebrow>{lifeAtAurus.eyebrow}</Eyebrow>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 xl:gap-0 items-start">
          {/* Left Column: Heading, Description & CTA */}
          <ViewReveal duration={800}>
            <div className="flex flex-col items-start">
              <Heading
                title1={lifeAtAurus.titleTop}
                title2={lifeAtAurus.titleAccent}
                className="uppercase w-full"
              />

              <p className="font-sans font-normal text-[15px] sm:text-[16px] lg:text-[20px] leading-[1.5] tracking-[-0.03em] text-muted max-w-[37ch] mt-6 sm:mt-8">
                {lifeAtAurus.body}
              </p>

              <Link
                href={lifeAtAurus.cta.href}
                className="mt-8 sm:mt-10 inline-flex items-center gap-2.5 rounded-full border border-ink/40 px-6 py-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[2px] text-ink transition-all duration-200 hover:bg-ink hover:text-white hover:border-ink cursor-pointer"
              >
                <span>{lifeAtAurus.cta.label}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </ViewReveal>

          {/* Right Column */}
          <ViewReveal duration={800} startDelay={100} className="w-full">
            {/* Mobile / Tablet (< lg): Normal 2-Column Grid matching attached screenshot */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
              {lifeAtAurus.items.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col border border-ink/15 bg-[#faf8f4]/60 p-2 sm:p-2.5"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] sm:rounded-[10px] bg-ink/5">
                    <Figure
                      src={item.image}
                      alt={item.alt}
                      sizes="(min-width: 640px) 45vw, 48vw"
                      className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out hover:scale-105"
                    />
                  </div>
                  <span className="font-sans uppercase text-[11px] sm:text-[13px] tracking-[-0.01em] text-ink font-normal mt-2 sm:mt-2.5 leading-none">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Desktop (>= lg): 3 Bordered Columns with Staggered Middle Column */}
            <div className="hidden lg:flex flex-row items-start">
              {lifeAtAurus.columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex flex-col flex-1 border border-ink/15 bg-[#faf8f4]/60 ${colIndex > 0 ? "-ml-px" : ""
                    } ${col.stagger
                      ? "mt-4 sm:mt-4 lg:mt-4"
                      : ""
                    }`}
                >
                  {/* Top Cell */}
                  <div className="group flex flex-col p-3 sm:p-3.5 lg:p-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[12px] sm:rounded-[14px] bg-ink/5">
                      <Figure
                        src={col.top.image}
                        alt={col.top.alt}
                        sizes="15vw"
                        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <span className="font-sans uppercase text-[14px] sm:text-[15px] lg:text-[16px] tracking-[-0.01em] text-ink font-normal mt-2.5 sm:mt-3 leading-none">
                      {col.top.label}
                    </span>
                  </div>

                  {/* Bottom Cell (divided by 1px hairline border) */}
                  <div className="group flex flex-col p-3 sm:p-3.5 lg:p-4 border-t border-ink/15">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[12px] sm:rounded-[14px] bg-ink/5">
                      <Figure
                        src={col.bottom.image}
                        alt={col.bottom.alt}
                        sizes="15vw"
                        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <span className="font-sans uppercase text-[14px] sm:text-[15px] lg:text-[16px] tracking-[-0.01em] text-ink font-normal mt-2.5 sm:mt-3 leading-none">
                      {col.bottom.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ViewReveal>
        </div>
      </Container>
    </section>
  );
}

export default LifeAtAurus;
