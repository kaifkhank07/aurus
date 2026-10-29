"use client";

import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { developersData } from "@/data/developers";
import { useScrollNavigation } from "../utils/Scroll";

export function PartnershipModels() {
  const { partnershipModels } = developersData;
  const { handleScroll } = useScrollNavigation();

  return (
    <section id="partnership-models" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow */}
        <Eyebrow>{partnershipModels.eyebrow}</Eyebrow>

        {/* Heading */}
        <Heading
          as="h2"
          title1={partnershipModels.titleTop}
          title2={partnershipModels.titleAccent}
          className="uppercase"
          title1ClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
          title2ClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
        />

        {/* 6 Models Grid */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {partnershipModels.models.map((model, idx) => {
              if (model.isCta) {
                return (
                  <div
                    key={idx}
                    className="rounded-[18px] sm:rounded-[22px] bg-ink text-white p-6 sm:p-7 flex flex-col justify-between shadow-md transition-all duration-300 hover:bg-neutral-900 group"
                  >
                    <div>
                      <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-white/60 block">
                        {model.tag}
                      </span>
                      <h3 className="font-sans font-medium text-base sm:text-lg text-white mt-2">
                        {model.title}
                      </h3>
                      <p className="font-sans text-[12px] sm:text-[13px] text-white/70 leading-[1.55] mt-3">
                        {model.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/15">
                      <Link
                        href={model.ctaHref || "#submit-property"}
                        onClick={(e) => handleScroll(e, model.ctaHref || "#submit-property")}
                        className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-white inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300 underline underline-offset-4 decoration-white/40 hover:decoration-white"
                      >
                        <span>{model.ctaText}</span>
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        >
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="rounded-[18px] sm:rounded-[22px] bg-white border border-ink/10 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-ink/20"
                >
                  <div>
                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-muted block">
                      {model.tag}
                    </span>
                    <h3 className="font-sans font-medium text-base sm:text-lg text-ink mt-2">
                      {model.title}
                    </h3>
                    <p className="font-sans text-[12px] sm:text-[13px] text-muted leading-[1.55] mt-3">
                      {model.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default PartnershipModels;
