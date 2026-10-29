"use client";

import { upcomingChapters } from "@/data/residences";
import { Container } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export function UpcomingChapters() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <ViewReveal duration={800}>
          <div className="rounded-[20px] sm:rounded-[30px] bg-ink text-white px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            {/* Top Bar: Eyebrow + Coming Soon Badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono uppercase text-[10px] sm:text-[10px] lg:text-[14px] tracking-[1px] text-white/90 font-medium">
                {upcomingChapters.eyebrow}
              </span>
              <span className="font-mono uppercase text-[8px] sm:text-[10px] lg:text-[14px] tracking-[1px] text-ink font-medium px-3.5 py-1.5 rounded-full bg-[#C5A059] whitespace-nowrap">
                {upcomingChapters.badge}
              </span>
            </div>

            {/* Title */}
            <div className="mt-6 sm:mt-8">
              <Heading
                title1={upcomingChapters.titleTop}
                title2={upcomingChapters.titleAccent}
                className="uppercase"
                title1ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                title2ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
              />
            </div>

            {/* 2-Column Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12">
              {upcomingChapters.items.map((item) => (
                <div
                  key={item.chapter}
                  className="rounded-[10px] sm:rounded-[20px] bg-[#161616] border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-white/25 hover:bg-[#1c1c1c]"
                >
                  <span className="font-sans uppercase text-[10px] sm:text-[12px] font-light tracking-[2px] text-white/40 block mb-2 sm:mb-3">
                    {item.chapter}
                  </span>
                  <h3 className="font-sans uppercase text-[24px] sm:text-[28px] lg:text-[34px] font-light tracking-[-0.03em] text-white leading-none">
                    {item.location}
                  </h3>
                  <p className="font-sans text-[10px] sm:text-[12px] font-light tracking-[1px] text-white/40 mt-3 sm:mt-4">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default UpcomingChapters;
