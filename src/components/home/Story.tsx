"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { storyAboutData } from "@/data/home/storyAbout";

export function Story() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <ViewReveal duration={800} className="">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 rounded-[20px] sm:rounded-[18px] lg:rounded-[20px] bg-white border border-ink/[0.08] p-6 sm:p-8 lg:p-10">
            {/* Left Column: Heading & Paragraphs */}
            <div className="flex flex-col lg:pt-8">
              <Heading
                title1={storyAboutData.titleTop}
                title2={storyAboutData.titleAccent}
                className="uppercase"
                title1ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                title2ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
              />

              <div className="mt-5 sm:mt-7 lg:mt-8 space-y-4 sm:space-y-4.5 lg:space-y-5">
                {storyAboutData.paragraphs.map((paragraph, index) => (
                  <p key={index} className="font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-tight tracking-[-0.025em] text-muted">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Right Column (Desktop) / Bottom (Mobile): Residence Lounge Image */}
            <div className="mt-6 sm:mt-8 lg:mt-0 w-full">
              <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[16/11] xl:aspect-[4/3] w-full overflow-hidden rounded-[16px] sm:rounded-[8px] lg:rounded-[10px] bg-ink/5">
                <Image
                  src={storyAboutData.image}
                  alt={storyAboutData.alt}
                  fill
                  sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 46vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default Story;
