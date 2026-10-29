"use client";

import Image from "next/image";
import { lifePageData } from "@/data/lifeataurus";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function LifeHero() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Title & Description */}
        <Heading
          as="h1"
          title1={lifePageData.hero.titleTop}
          title2={lifePageData.hero.titleAccent}
          className="uppercase max-w-xl"
        />

        <p className="font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
          {lifePageData.hero.body}
        </p>

        {/* 3-Photo Gallery Grid (Big Left, 2 Stacked Right on Desktop) */}
        <ViewReveal duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column: Large Celebration Photo */}
            <div className="lg:col-span-7 relative aspect-[14/11] sm:aspect-[4/3] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[380px] w-full overflow-hidden  bg-ink/5">
              <Image
                src={lifePageData.hero.images.main.src}
                alt={lifePageData.hero.images.main.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>

            {/* Right Column: 2 Stacked Resident Photos */}
            <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
              {/* Top Photo: DJ Set */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[12/6] w-full overflow-hidden bg-ink/5">
                <Image
                  src={lifePageData.hero.images.topRight.src}
                  alt={lifePageData.hero.images.topRight.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>

              {/* Bottom Photo: Poolside Group */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[12/6] w-full overflow-hidden bg-ink/5">
                <Image
                  src={lifePageData.hero.images.bottomRight.src}
                  alt={lifePageData.hero.images.bottomRight.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
