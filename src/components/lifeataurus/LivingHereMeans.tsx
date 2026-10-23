"use client";

import { lifePageData, type LivingFeature } from "@/data";
import { Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";

export default function LivingHereMeans() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Eyebrow Header */}
        <Eyebrow>{lifePageData.livingMeans.eyebrow}</Eyebrow>

        {/* 6 Features Table Grid */}
        <ViewReveal duration={800} className="mt-8 sm:mt-10 lg:mt-12">
          <div className="border-t border-ink/15 border-b border-ink/15 lg:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {lifePageData.livingMeans.items.map((item, index) => {
                const isThirdCol = (index + 1) % 3 === 0;
                const IsEven = (index + 1) % 2 === 0;

                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`flex flex-col p-6 sm:p-8 lg:p-10 transition-colors duration-300 hover:bg-[#FAF8F5]/80 border-t lg:border-t-0  lg:border-b border-ink/15 ${!isThirdCol ? "lg:border-r border-ink/15" : "lg:border-r-0"
                      } ${!IsEven ? "md:border-r border-ink/15" : "md:border-r-0 border-ink/15"}`}
                  >
                    {/* Icon Badge */}
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-ink/15 group-hover:bg-white/70">
                      <Icon className="text-ink/70" size={22} strokeWidth={1.3}/>
                    </div>

                    {/* Title */}
                    <h3 className="font-sans font-medium text-[17px] sm:text-[18px] lg:text-[19.5px] text-ink leading-snug mt-5 sm:mt-6">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans font-normal text-[12.5px] sm:text-[13px] lg:text-[13.5px] text-muted leading-[1.6] mt-2.5 sm:mt-3">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
