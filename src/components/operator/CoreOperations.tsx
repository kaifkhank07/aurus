"use client";

import { Eyebrow, Panel } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { coreOperationsData } from "@/data/operator/coreOperations";

export function CoreOperations() {
  const data = coreOperationsData;

  return (
    <section className="px-4 sm:px-6 lg:px-0 py-8 sm:py-12 lg:py-16">
      <Panel
        className="bg-ink text-white rounded-[28px] sm:rounded-[40px] lg:rounded-[57px] shadow-2xl"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-6 sm:space-y-10 lg:space-y-12"
      >
        {/* Eyebrow */}
        <Eyebrow dark>{data.eyebrow}</Eyebrow>

        {/* Heading */}
        <Heading
          as="h2"
          title1={data.titleTop}
          title2={data.titleAccent}
          className="uppercase"
          title1ClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
          title2ClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
        />

        {/* 2-Column Grid */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 border-t border-white/15 pt-8 sm:pt-10">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex flex-col justify-start">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-mono text-[11px] sm:text-[12px] text-white/80 font-medium">
                  {item.number}
                </div>
                <h3 className="font-sans font-medium text-lg sm:text-xl lg:text-[22px] text-white mt-4 sm:mt-5">
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] sm:text-[14px] text-white/60 leading-[1.6] mt-3 max-w-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </ViewReveal>
      </Panel>
    </section>
  );
}

export default CoreOperations;
