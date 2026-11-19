
"use client";

import { managedPricing } from "@/data/managed-hostels";
import { Eyebrow, Panel } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";

export function PricingAddons() {
  return (
    <section id="pricing" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0">
      <Panel
        className="bg-ink text-white rounded-[30px] sm:rounded-[48px] lg:rounded-[57px] overflow-hidden"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        {/* Eyebrow Header */}
        <Eyebrow
          dark
          right={
            <span className="font-mono text-neutral-400 text-[11px] sm:text-[12px] uppercase tracking-[2px]">
              {managedPricing.eyebrowRight}
            </span>
          }
        >
          {managedPricing.eyebrowLeft}
        </Eyebrow>

        {/* Heading */}
        <div>
          <Heading
            title1={managedPricing.titleTop}
            title2={managedPricing.titleAccent}
            className="uppercase max-w-sm sm:max-w-md lg:max-w-none text-white"
          />
        </div>

        {/* Pricing Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/15">
          {managedPricing.columns.map((col, index) => (
            <ViewReveal key={col.tag} duration={700} startDelay={index * 100}>
              <div
                className={[
                  "h-full flex flex-col py-7 sm:py-8 lg:py-8",
                  "border-b border-white/15 md:border-b-0",
                  "md:px-5 lg:px-7",
                  index !== 2 ? "md:border-r md:border-white/15" : "",
                  index === 0 ? "md:pl-0 lg:pl-0" : "",
                  index === 2 ? "md:pr-0" : "",
                  index < 2 ? "md:border-b-0" : "",
                ].join(" ")}
              >
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[2px] uppercase text-[#D6B86D]">
                  {col.tag}
                </span>

                <h3 className="text-[22px] sm:text-[26px] font-sans font-medium text-white mt-3 tracking-tight">
                  {col.title}
                </h3>

                <p className="text-[12.5px] sm:text-[13.5px] text-neutral-400 mt-2 leading-relaxed font-normal">
                  {col.subtitle}
                </p>

                <div className="my-5 h-px w-full bg-white/15" />

                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[12.5px] sm:text-[13.5px] text-neutral-300 font-normal leading-relaxed"
                    >
                      <span className="text-white/60 font-bold mt-1 text-[10px]">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ViewReveal>
          ))}
        </div>
      </Panel>
    </section>
  );
}
