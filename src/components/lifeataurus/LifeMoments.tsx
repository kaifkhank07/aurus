"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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

    // Smooth continuous auto-scrolling marquee for mobile & tablet
    const tween = gsap.to(marquee, {
      xPercent: -33.333333333333336, // 3 sets -> seamless infinite loop at 1/3
      ease: "none",
      duration: 32,
      repeat: -1,
    });

    const handleTouchStart = () => tween.pause();
    const handleTouchEnd = () => tween.play();

    marquee.addEventListener("touchstart", handleTouchStart, { passive: true });
    marquee.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      marquee.removeEventListener("touchstart", handleTouchStart);
      marquee.removeEventListener("touchend", handleTouchEnd);
      tween.kill();
    };
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow Header */}
        <Eyebrow>{momentsGallery.eyebrow}</Eyebrow>

        {/* 8 Moments Photo Cards */}
        <ViewReveal duration={800}>
          {/* Mobile / Tablet: Infinite Loop Scrolling Marquee */}
          <div className="lg:hidden -mx-5 sm:-mx-8 overflow-hidden select-none">
            <div ref={marqueeRef} className="flex w-max will-change-transform">
              {[0, 1, 2].map((setIndex) => (
                <div
                  key={setIndex}
                  aria-hidden={setIndex > 0 ? "true" : undefined}
                  className="flex shrink-0 items-center gap-3.5 sm:gap-4 pr-3.5 sm:pr-4"
                >
                  {momentsGallery.items.map((item, i) => (
                    <div
                      key={`${setIndex}-${i}`}
                      className="group relative aspect-[3/4] h-[260px] sm:h-[320px] shrink-0 overflow-hidden rounded-[16px] bg-ink/5 border border-ink/10 shadow-sm"
                    >
                      <Image
                        src={item.image}
                        alt={setIndex === 0 ? item.alt : ""}
                        fill
                        sizes="(max-width: 640px) 210px, 260px"
                        className="object-cover"
                      />
                      {/* Gradient Overlay for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      {/* Overlay Tag */}
                      <span className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.14em] text-white/95 font-medium drop-shadow-sm">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 4 Columns x 2 Rows Photo Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {momentsGallery.items.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-ink/5 border border-ink/10 shadow-sm"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                {/* Overlay Tag */}
                <span className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 z-10 font-mono text-[10px] sm:text-[12px] 3xl:text-[14px] uppercase tracking-[0.14em] text-white/95 font-light drop-shadow-sm">
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
