"use client";

import { upcomingChapters } from "@/data/upcomingChapters";
import { Container } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";

export function UpcomingChapters() {
  return (
    <section className="py-8 sm:py-12 lg:py-[min(4vw,76px)]">
      <Container>
        <ViewReveal duration={800}>
          <div className="rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] bg-ink text-white px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            {/* Top Bar: Eyebrow + Coming Soon Badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[12px] tracking-[2px] text-white/50 font-medium">
                {upcomingChapters.eyebrow}
              </span>
              <span className="font-mono uppercase text-[9px] sm:text-[10px] tracking-[1.5px] px-3.5 py-1 rounded-full bg-[#d8c89b] text-ink font-medium shadow-xs">
                {upcomingChapters.badge}
              </span>
            </div>

            {/* Title */}
            <div className="mt-6 sm:mt-8">
              <h2 className="font-sans font-light uppercase text-[clamp(28px,3.8vw,56px)] leading-[1.05] tracking-[-0.04em] text-white">
                {upcomingChapters.titleTop}{" "}
                <span className="font-display italic font-normal tracking-[-0.04em] normal-case">
                  {upcomingChapters.titleAccent}
                </span>
              </h2>
            </div>

            {/* 2-Column Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10 lg:mt-12">
              {upcomingChapters.items.map((item) => (
                <div
                  key={item.chapter}
                  className="rounded-[18px] sm:rounded-[22px] bg-[#161616] border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-white/25 hover:bg-[#1c1c1c]"
                >
                  <span className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-white/40 block mb-2 sm:mb-3">
                    {item.chapter}
                  </span>
                  <h3 className="font-sans uppercase text-[24px] sm:text-[28px] lg:text-[34px] font-light tracking-[-0.03em] text-white leading-none">
                    {item.location}
                  </h3>
                  <p className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1px] text-white/40 mt-3 sm:mt-4">
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
