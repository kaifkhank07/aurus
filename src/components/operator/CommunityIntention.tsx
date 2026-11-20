"use client";

import Image from "next/image";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { communityIntentionData } from "@/data/operator/communityIntention";

export function CommunityIntention() {
  const data = communityIntentionData;

  return (
    <section id="what-we-look-for" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left Column: Cafe Image */}
          <ViewReveal duration={800} className="lg:col-span-5">
            <div className="relative h-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden rounded-[10px] sm:rounded-[16px] bg-ink/5 shadow-md">
              <Image
                src={data.image.src}
                alt={data.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.02]"
              />
            </div>
          </ViewReveal>

          {/* Right Column: Heading & Checklist */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-4 sm:gap-5 lg:gap-6">
            {/* Eyebrow */}
            <Eyebrow rule={false}>{data.eyebrow}</Eyebrow>

            <Heading
              as="h2"
              title1={data.titleTop}
              title2={data.titleAccent}
              className="uppercase"
              title1ClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
              title2ClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
            />

            <p className="font-sans font-normal text-[15px] sm:text-[16px] leading-[1.6] text-muted max-w-xl">
              {data.subtitle}
            </p>

            {/* Checklist */}
            <ViewReveal duration={800} startDelay={150}>
              <div className="border-t border-ink/10">
                {data.features.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-b border-ink/10 py-3.5 sm:py-4 flex items-center gap-3.5 transition-colors duration-200 hover:bg-black/[0.015] px-2 rounded-md"
                  >
                    <div className="w-7 h-7 rounded-full bg-ink/[0.04] flex items-center justify-center shrink-0">
                      {/* <CriterionIcon type={item.icon} /> */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-ink shrink-0"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <span className="font-sans text-[13px] sm:text-[14px] text-ink/85 leading-snug">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </ViewReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CommunityIntention;
