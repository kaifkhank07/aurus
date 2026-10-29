"use client";

import Image from "next/image";
import { aboutData } from "@/data/about";
import { Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function EveryDetail() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Eyebrow Header */}
        <Eyebrow>{aboutData.amenities.eyebrow}</Eyebrow>

        {/* Heading */}
        <div className="mt-8 sm:mt-10 lg:mt-12">
          <Heading
            title1={aboutData.amenities.titleTop}
            title2={aboutData.amenities.titleAccent}
            className="uppercase max-w-[24ch] sm:max-w-none"
          />
        </div>

        {/* 2-Column Section Content */}
        <ViewReveal duration={800}>
          <div className="mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-0">
            {/* Left Column: Description & Feature Image */}
            <div className="flex flex-col lg:pr-10">
              <p className="font-sans font-regular text-[14px] sm:text-[16px] lg:text-[17px] 3xl:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
                {aboutData.amenities.body}
              </p>

              <div className="mt-8 sm:mt-10 lg:mt-4 relative aspect-[4/3] sm:aspect-[4/2] w-full overflow-hidden rounded-[16px] sm:rounded-[8px] lg:rounded-[10px] bg-ink/5 border border-ink/10">
                <Image
                  src={aboutData.amenities.image}
                  alt={aboutData.amenities.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: 12 Amenities Table */}
            <div className="border-t border-ink/15">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {aboutData.amenities.items.map((item, index) => {
                  const isEvenCol = index % 2 === 1;
                  return (
                    <div
                      key={item.number}
                      className={`flex items-center gap-2.5 sm:gap-4 py-3.5 sm:py-4.5 lg:py-5 border-b border-ink/15 transition-colors duration-200 hover:bg-black/[0.02] ${isEvenCol
                        ? "sm:border-l border-ink/15 sm:pl-3.5 sm:pl-6 lg:pl-8"
                        : "pr-3 sm:pr-6 lg:pr-8"
                        }`}
                    >
                      <span className="font-mono text-[20px] sm:text-[11px] lg:text-[12px] tracking-[1.5px] text-muted font-medium shrink-0">
                        {item.number}
                      </span>
                      <span className="font-sans uppercase text-[20px] sm:text-[12.5px] lg:text-[20px] text-ink font-light whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
