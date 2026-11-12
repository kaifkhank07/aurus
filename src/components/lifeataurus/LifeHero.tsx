"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { lifeHeroData } from "@/data/lifeataurus/lifeHero";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function LifeHero() {
  const hero = lifeHeroData;
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const media = gsap.matchMedia();

    // Auto-scroll only on mobile devices.
    media.add("(max-width: 767px)", () => {
      const tween = gsap.to(marquee, {
        xPercent: -33.333333,
        ease: "none",
        duration: 24,
        repeat: -1,
      });

      const handleTouchStart = () => tween.pause();
      const handleTouchEnd = () => tween.play();

      marquee.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      marquee.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });

      return () => {
        marquee.removeEventListener("touchstart", handleTouchStart);
        marquee.removeEventListener("touchend", handleTouchEnd);
        tween.kill();
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8">
        {/* Title & Description */}
        <Heading
          as="h1"
          title1={hero.titleTop}
          title2={hero.titleAccent}
          className="max-w-xl uppercase"
        />

        <p className="max-w-lg font-sans text-[15px] leading-[1.45] font-normal tracking-[-0.025em] text-muted sm:text-[17px] lg:text-[19px]">
          {hero.body}
        </p>

        <ViewReveal duration={800}>
          {/* Mobile: Auto-scrolling photo gallery */}
          <div className="-mx-5 overflow-hidden select-none sm:hidden">
            <div
              ref={marqueeRef}
              className="flex w-max will-change-transform"
            >
              {[0, 1, 2].map((setIndex) => (
                <div
                  key={setIndex}
                  aria-hidden={setIndex > 0 ? "true" : undefined}
                  className="flex shrink-0 items-center gap-3.5 pr-3.5"
                >
                  {hero.images.map((image, index) => (
                    <div
                      key={`${setIndex}-${index}`}
                      className="relative aspect-[4/3] w-[280px] shrink-0 overflow-hidden rounded-[10px] bg-ink/5"
                    >
                      <Image
                        src={image.src}
                        alt={setIndex === 0 ? image.alt : ""}
                        fill
                        sizes="280px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tablet and Desktop: Existing photo grid */}
          <div className="hidden grid-cols-1 gap-4 sm:grid sm:gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Large Celebration Photo */}
            <div className="relative aspect-[14/11] min-h-[260px] w-full overflow-hidden rounded-[10px] bg-ink/5 sm:aspect-[4/3] sm:min-h-[380px] lg:col-span-7 lg:aspect-auto lg:h-full">
              <Image
                src={hero.images[0].src}
                alt={hero.images[0].alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>

            {/* Right Column: 2 Stacked Resident Photos */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
              {/* Top Photo: DJ Set */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-ink/5 sm:aspect-[4/3] lg:aspect-[12/6]">
                <Image
                  src={hero.images[1].src}
                  alt={hero.images[1].alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>

              {/* Bottom Photo: Poolside Group */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[10px] bg-ink/5 sm:aspect-[4/3] lg:aspect-[12/6]">
                <Image
                  src={hero.images[2].src}
                  alt={hero.images[2].alt}
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