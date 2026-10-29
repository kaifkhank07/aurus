"use client";

import Image from "next/image";
import { lifePageData } from "@/data/lifeataurus";
import { Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function TheDetails() {
  const { facilities } = lifePageData;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow Header */}
        <Eyebrow>{facilities.eyebrow}</Eyebrow>

        {/* Content Grid */}
        <ViewReveal duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start">
            {/* Left Column: Heading, Subtitle & Facility Pills */}
            <div className="lg:col-span-8 flex flex-col lg:pr-12">
              <Heading
                title1={facilities.titleTop}
                title2={facilities.titleAccent}
                className="uppercase"
              />

              <p className="mt-4 sm:mt-5 font-sans font-light text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.5] text-muted max-w-xl">
                {facilities.body}
              </p>

              <div className="block lg:hidden mt-5 relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-square w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-ink/5 border border-ink/10 shadow-sm group">
                <Image
                  src={facilities.image.src}
                  alt={facilities.image.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Amenity Pill Badges */}
              <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 lg:gap-4">
                {facilities.amenities.map((item) => (
                  <span
                    key={item}
                    className="px-4 lg:px-6 py-2 rounded-full border border-ink font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px] text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Gym / Workout Photo */}
            <div className="hidden lg:block lg:col-span-4 w-full">
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-square w-full overflow-hidden bg-ink/5 border border-ink/10 shadow-sm group">
                <Image
                  src={facilities.image.src}
                  alt={facilities.image.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
