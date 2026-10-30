"use client";

import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { CitySummary } from "@/lib/residences/city";

interface CityIntroductionProps {
  city: CitySummary;
}

export function CityIntroduction({ city }: CityIntroductionProps) {
  const highlights = [
    {
      num: "01",
      title: "Prime Proximity",
      desc: `Centrally positioned in ${city.name}'s key student neighbourhoods, moments away from leading colleges, universities, and transit networks.`,
    },
    {
      num: "02",
      title: "Gourmet Dining",
      desc: "Four wholesome, chef-crafted meals daily with balanced nutrition, seasonal produce, and allergen-conscious options.",
    },
    {
      num: "03",
      title: "High-Speed Study Hubs",
      desc: "Uninterrupted gigabit Wi-Fi, ergonomic workstations, and sound-insulated quiet rooms built for focused academic productivity.",
    },
    {
      num: "04",
      title: "Uncompromising Safety",
      desc: "Biometric access gates, 24/7 CCTV surveillance, female security personnel, and an on-campus warden at every Chapter.",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-14 border-t border-b border-ink/10 bg-[#FAF8F5]/50">
      <Container className="space-y-6 sm:space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <ViewReveal duration={800}>
              <Eyebrow>LIFE IN {city.name.toUpperCase()}</Eyebrow>
              <div className="mt-3">
                <Heading
                  title1="Crafted for"
                  title2="focus & growth."
                  className="uppercase text-[28px] sm:text-[34px] lg:text-[40px]"
                />
              </div>
              <p className="mt-4 font-sans font-normal text-[15px] sm:text-[17px] leading-[1.5] text-muted">
                Aurus redefines student living in {city.name}. Beyond accommodation, our Chapters provide an enriching ecosystem designed to help university students thrive academically, socially, and personally.
              </p>
            </ViewReveal>
          </div>

          {/* Right Column: 4 Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((item, idx) => (
              <ViewReveal key={item.num} duration={800} startDelay={idx * 80}>
                <div className="rounded-[16px] border border-ink/10 bg-[#FAF8F5] p-5 sm:p-6 transition-all duration-300 hover:border-ink/25 hover:bg-[#F5F2EB]">
                  <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#C5A059] font-medium block mb-2">
                    {item.num}
                  </span>
                  <h3 className="font-sans text-[17px] sm:text-[18px] font-medium uppercase tracking-[-0.02em] text-ink leading-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[13px] sm:text-[14px] leading-[1.45] text-muted">
                    {item.desc}
                  </p>
                </div>
              </ViewReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CityIntroduction;

