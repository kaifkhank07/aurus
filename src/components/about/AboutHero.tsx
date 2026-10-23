"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { aboutData } from "@/data/about";

export function AboutHero() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Top Hero Header: Title & Mission Subtitle */}
        <div>
          <Heading
            as="h1"
            title1={aboutData.hero.titleTop}
            title2={aboutData.hero.titleAccent}
            className="uppercase max-w-[18ch] sm:max-w-3xl lg:max-w-4xl"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[44ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {aboutData.hero.body}
          </p>
        </div>

        {/* Mobile / Tablet Enquire CTA Button (matching mobile UI reference) */}
        <ViewReveal duration={800} className="mt-6 mb-2 block lg:hidden w-full">
          <Link
            href={aboutData.hero.cta.href}
            className="w-full h-[46px] sm:h-[50px] rounded-full bg-ink text-paper font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:bg-neutral-800 active:scale-[0.99] shadow-sm"
          >
            <span>{aboutData.hero.cta.label}</span>
            <svg
              viewBox="0 0 10 6"
              fill="currentColor"
              className="h-2 w-2 shrink-0 select-none opacity-90"
              aria-hidden="true"
            >
              <path d="M0 0l5 6 5-6z" />
            </svg>
          </Link>
        </ViewReveal>

        {/* The Aurus Story Card */}
        <ViewReveal duration={800} startDelay={80} className="mt-6 sm:mt-10 lg:mt-14">
          <div className="rounded-[20px] sm:rounded-[18px] lg:rounded-[20px] bg-white border border-ink/[0.08] p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left Column: Heading & Paragraphs */}
              <div className="flex flex-col lg:pt-8">
                <Heading
                  title1={aboutData.story.titleTop}
                  title2={aboutData.story.titleAccent}
                  className="uppercase"
                  title1ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                  title2ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                />

                <div className="mt-5 sm:mt-7 lg:mt-8 space-y-4 sm:space-y-4.5 lg:space-y-5">
                  {aboutData.story.paragraphs.map((paragraph, index) => (
                    <p key={index} className="font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Right Column (Desktop) / Bottom (Mobile): Residence Lounge Image */}
              <div className="mt-6 sm:mt-8 lg:mt-0 w-full">
                <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[16/11] xl:aspect-[4/3] w-full overflow-hidden rounded-[16px] sm:rounded-[8px] lg:rounded-[10px] bg-ink/5">
                  <Image
                    src={aboutData.story.image}
                    alt={aboutData.story.alt}
                    fill
                    sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 46vw, 100vw"
                    priority
                    className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default AboutHero;
