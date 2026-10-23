"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { aboutData } from "@/data";
import { ArrowRight, Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function CommunitySpaces() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Smooth continuous auto-scrolling marquee for mobile photos
    const tween = gsap.to(marquee, {
      xPercent: -33.333333333333336, // 3 sets -> seamless infinite loop at 1/3
      ease: "none",
      duration: 18,
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
      <Container>
        {/* Eyebrow Header */}
        <Eyebrow>{aboutData.communitySpaces.eyebrow}</Eyebrow>

        {/* Top Header: Title on Left, Description & CTA on Right */}
        <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-wrap items-start justify-between gap-6 lg:gap-12 xl:gap-20">
          <Heading
            title1={aboutData.communitySpaces.titleTop}
            title2={aboutData.communitySpaces.titleAccent}
            className="uppercase max-w-lg sm:max-w-xl"
          />

          <div className="flex flex-col items-start lg:max-w-md">
            <p className="font-sans font-regular text-[14px] sm:text-[16px] lg:text-[17px] 3xl:text-[19px] lg:text-left leading-[1.45] tracking-[-0.025em] text-muted">
              {aboutData.communitySpaces.body}
            </p>

            <Link
              href={aboutData.communitySpaces.cta.href}
              className="mt-4 sm:mt-6 font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex shrink-0 items-center gap-2 rounded-full border-b-2 border-ink/30 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#77736c] transition-colors group-hover:bg-ink group-hover:text-[#faf8f4]"
            >
              {aboutData.communitySpaces.cta.label}
              <ArrowRight />
            </Link>
          </div>
        </div>

        {/* 4 Vertical Architectural & Community Photos */}
        <ViewReveal duration={800} className="mt-8 sm:mt-12 lg:mt-16">
          {/* Mobile / Tablet: Infinite Loop Scrolling Marquee */}
          <div className="lg:hidden -mx-5 sm:-mx-8 overflow-hidden select-none">
            <div ref={marqueeRef} className="flex w-max will-change-transform">
              {[0, 1, 2].map((setIndex) => (
                <div
                  key={setIndex}
                  aria-hidden={setIndex > 0 ? "true" : undefined}
                  className="flex shrink-0 items-center gap-3.5 sm:gap-4 pr-3.5 sm:pr-4"
                >
                  {aboutData.communitySpaces.items.map((item, i) => (
                    <div
                      key={`${setIndex}-${i}`}
                      className="group relative aspect-[3/4] h-[250px] sm:h-[300px] shrink-0 overflow-hidden rounded-[10px] bg-ink/5"
                    >
                      <Image
                        src={item.image}
                        alt={setIndex === 0 ? item.alt : ""}
                        fill
                        sizes="(max-width: 640px) 200px, 250px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 4-Column Photo Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
            {aboutData.communitySpaces.items.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-ink/5"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
