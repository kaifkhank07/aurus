"use client";

import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { CitySummary } from "@/lib/residences/city";

interface CityHeroProps {
  city: CitySummary;
}

export function CityHero({ city }: CityHeroProps) {
  return (
    <section className="pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6">
      <Container className="space-y-4 sm:space-y-6">
        <ViewReveal duration={800}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>AURUS CHAPTERS · {city.name.toUpperCase()}</Eyebrow>
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase text-[9px] sm:text-[11px] tracking-[1.5px] text-ink/70 px-3 py-1 rounded-full border border-ink/15 bg-[#FAF8F5]">
                {city.state}, {city.country}
              </span>
              <span className="font-mono uppercase text-[9px] sm:text-[11px] tracking-[1.5px] text-ink font-medium px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40">
                {city.count} {city.count === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
        </ViewReveal>

        <ViewReveal duration={800} startDelay={100}>
          <div className="max-w-[48ch] sm:max-w-none">
            <Heading
              title1="Student Residences in"
              title2={`${city.name}.`}
              className="uppercase max-w-[24ch] sm:max-w-none"
            />
            <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[56ch] lg:max-w-[48ch] font-sans font-normal text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.4] tracking-[-0.03em] text-muted">
              Discover premier student accommodation across {city.name}. Every Aurus Chapter offers private and shared luxury residences with daily chef-curated dining, high-speed fibre Wi-Fi, and 24/7 biometric security.
            </p>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default CityHero;

