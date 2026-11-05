"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { lifePageData } from "@/data/lifeataurus";
import { Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";

export default function LifeMoments() {
  const { momentsGallery } = lifePageData;
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Keep the existing tablet auto-scrolling animation.
    const tween = gsap.to(marquee, {
      xPercent: -33.333333333333336,
      ease: "none",
      duration: 32,
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
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <Eyebrow>{momentsGallery.eyebrow}</Eyebrow>

        <ViewReveal duration={800}>
          {/* Mobile: Static vertical cards */}
          <div className="mx-auto flex w-full max-w-[380px] flex-col gap-6 sm:hidden">
            {momentsGallery.items.map((item, index) => (
              <div key={index} className="flex flex-col gap-3.5">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[10px] border border-ink/10 bg-ink/5 shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-ink uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tablet: Existing infinite scrolling marquee */}
          {/* <div className="mx-0 hidden overflow-hidden select-none sm:block lg:hidden">
            <div ref={marqueeRef} className="flex w-max will-change-transform">
              {[0, 1, 2].map((setIndex) => (
                <div
                  key={setIndex}
                  aria-hidden={setIndex > 0 ? "true" : undefined}
                  className="flex shrink-0 items-center gap-4 pr-4"
                >
                  {momentsGallery.items.map((item, i) => (
                    <div
                      key={`${setIndex}-${i}`}
                      className="group relative aspect-[3/4] h-[320px] shrink-0 overflow-hidden rounded-[16px] border border-ink/10 bg-ink/5 shadow-sm"
                    >
                      <Image
                        src={item.image}
                        alt={setIndex === 0 ? item.alt : ""}
                        fill
                        sizes="260px"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <span className="absolute bottom-3.5 left-3.5 z-10 font-mono text-[10.5px] font-medium tracking-[0.14em] text-white/95 uppercase drop-shadow-sm">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div> */}

          {/* Desktop: Existing 4-column grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6">
            {momentsGallery.items.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-[10px] border border-ink/10 bg-ink/5 shadow-sm"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <span className="absolute bottom-3.5 left-3.5 z-10 font-mono text-[10px] font-light tracking-[0.14em] text-white/95 uppercase drop-shadow-sm sm:bottom-4 sm:left-4 sm:text-[12px] 3xl:text-[14px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}