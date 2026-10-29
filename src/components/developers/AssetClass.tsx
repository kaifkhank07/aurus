"use client";

import { Eyebrow, Panel } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { developersData } from "@/data/developers";

function FeatureIcon({ type }: { type: string }) {
  if (type === "trend") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-white"
        aria-hidden="true"
      >
        <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
      </svg>
    );
  }
  if (type === "yield") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-white"
        aria-hidden="true"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }
  if (type === "occupancy") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-white"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-white"
      aria-hidden="true"
    >
      <path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11" />
    </svg>
  );
}

export function AssetClass() {
  const { assetClass } = developersData;

  return (
    <section className="px-4 sm:px-6 lg:px-0 py-8 sm:py-12 lg:py-16">
      <Panel
        className="bg-ink text-white rounded-[28px] sm:rounded-[40px] lg:rounded-[57px] shadow-2xl"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        {/* Eyebrow */}
        <Eyebrow dark>{assetClass.eyebrow}</Eyebrow>

        {/* Heading */}
        <Heading
          as="h2"
          title1={assetClass.titleTop}
          title2={assetClass.titleAccent}
          className="uppercase"
          title1ClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
          title2ClassName="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] leading-[0.95]"
        />

        {/* 2x2 Feature Grid */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 sm:gap-y-12 lg:gap-y-14 gap-x-12 lg:gap-x-16">
            {assetClass.items.map((item, idx) => {
              const isBottomRow = idx >= 2;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-start ${isBottomRow ? "md:border-t md:border-white/10 md:pt-10 lg:pt-12" : ""
                    }`}
                >
                  {/* Circular Icon Badge */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center mb-5 shrink-0">
                    <FeatureIcon type={item.icon} />
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-normal text-lg sm:text-xl lg:text-[22px] text-white tracking-[-0.01em]">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.6] text-white/65 mt-2.5 max-w-lg">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </ViewReveal>
      </Panel>
    </section>
  );
}

export default AssetClass;
