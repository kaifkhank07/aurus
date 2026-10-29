"use client";

import Image from "next/image";
import { lifePageData } from "@/data/lifeataurus";
import { Eyebrow, Panel } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function DayAtAurus() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0">
      <Panel
        className="bg-ink text-white rounded-[36px] sm:rounded-[48px] lg:rounded-[57px] overflow-hidden"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        <ViewReveal duration={800}>
          {/* Eyebrow Header */}
          <Eyebrow dark>{lifePageData.dailyRhythm.eyebrow}</Eyebrow>

          {/* 2-Column Section Content */}
          <div className="mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16">
            {/* Left Column: Heading, Subtitle & Dining Image */}
            <div className="flex flex-col">
              <Heading
                title1={lifePageData.dailyRhythm.titleTop}
                title2={lifePageData.dailyRhythm.titleAccent}
                className="uppercase max-w-sm sm:max-w-md lg:max-w-none text-white"
              />

              <p className="mt-4 sm:mt-5 text-white/70 font-sans font-light text-[14px] sm:text-[16px] lg:text-[16px] leading-[1.6] max-w-lg">
                {lifePageData.dailyRhythm.body}
              </p>

              <div className="mt-6 sm:mt-8 relative aspect-[4/3] sm:aspect-[12/8] w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-white/5 border border-white/10">
                <Image
                  src={lifePageData.dailyRhythm.image.src}
                  alt={lifePageData.dailyRhythm.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: Daily Rhythm Timeline */}
            {/* <div className="lg:pt-10"> */}
            <div className="lg:mt-auto">
              {lifePageData.dailyRhythm.timeline.map((slot, index) => (
                <div
                  key={slot.time}
                  className={`flex items-baseline gap-3.5 sm:gap-6 py-3.5 sm:py-4.5 lg:py-5 border-b border-white/10 transition-colors duration-200 hover:bg-white/[0.03] ${index === 0 ? "border-t" : ""}`}
                >
                  <span className="font-mono text-[12px] sm:text-[14px] tracking-[1.5px] text-white/50 w-[68px] sm:w-[82px] shrink-0 font-medium">
                    {slot.time}
                  </span>
                  <p className="font-sans text-[12px] sm:text-[16px] lg:text-[20px] 3xl:text-[25px] text-white/90 font-light leading-snug">
                    {slot.activity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ViewReveal>
      </Panel>
    </section>
  );
}
