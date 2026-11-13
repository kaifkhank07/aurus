import React from "react";
import Image from "next/image";
import { Eyebrow, Panel } from "@/components/ui/Primitives";
import { aurusVoyagesData, AurusVoyagesData } from "@/data/aurusyear/aurusVoyages";
import { ViewReveal } from "../animation";

interface AurusVoyagesProps {
  data?: AurusVoyagesData;
  voyages?: AurusVoyagesData;
}

export function AurusVoyages({
  data = aurusVoyagesData,
  voyages: legacyVoyages,
}: AurusVoyagesProps) {
  const voyages = legacyVoyages || data;

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0">
      <Panel
        className="bg-ink text-white rounded-[30px] sm:rounded-[48px] lg:rounded-[57px] overflow-hidden"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >

        <ViewReveal duration={800}>
          {/* Eyebrow Header */}
          <Eyebrow dark={true}>{data.eyebrow}</Eyebrow>

          {/* 2-Column Voyages Grid */}
          <div className="mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16">
            {voyages.items.map((voyage) => (
              <article key={voyage.romanNumeral} className="group flex flex-col gap-4">
                {/* Image */}
                <div className="relative aspect-[16/10.5] sm:aspect-[16/11] w-full overflow-hidden rounded-[18px] sm:rounded-[24px] bg-neutral-900">
                  <Image
                    src={voyage.image}
                    alt={voyage.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Roman Numeral */}
                <span className="block font-display italic text-[17px] sm:text-[19px] text-white/90">
                  {voyage.romanNumeral}
                </span>

                {/* Title */}
                <h3 className="font-sans text-[15px] sm:text-[16.5px] font-medium uppercase tracking-[0.3px] text-white leading-tight">
                  {voyage.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-[12px] sm:text-[14px] font-regular leading-sung text-white/70">
                  {voyage.description}
                </p>
              </article>
            ))}
          </div>
        </ViewReveal>
      </Panel>
    </section >
  );
}

export default AurusVoyages;
