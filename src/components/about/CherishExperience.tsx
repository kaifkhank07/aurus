"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { aboutData } from "@/data/about";
import { ArrowRight, Panel } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

const marqueeImages = [
  aboutData.cherishExperience.photos.topRight,
  aboutData.cherishExperience.photos.middle,
  aboutData.cherishExperience.photos.bottomRight,
  aboutData.cherishExperience.photos.bottomLeft,
  {
    src: "/images/life-enjoy.jpg",
    alt: "Residents playing foosball in recreation space",
  },
  {
    src: "/images/life-connect.jpg",
    alt: "Residents conversing in lounge",
  },
];

export default function CherishExperience() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Smooth continuous auto-scrolling marquee for mobile
    const tween = gsap.to(marquee, {
      xPercent: -33.333333333333336, // 3 sets -> seamless infinite loop at 1/3
      ease: "none",
      duration: 22,
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
      <Panel
        className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px] overflow-visible"
        innerClassName="pt-9 pb-12 sm:pt-12 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)]"
      >
        <ViewReveal duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0">
            {/* Left Column: Heading, Description, Mobile Infinite Loop, Features & Actions */}
            <div className="w-full">
              <Heading
                title1={aboutData.cherishExperience.titleTop}
                title2={aboutData.cherishExperience.titleAccent}
                className="uppercase max-w-lg sm:max-w-[95%] lg:min-w-[940px]"
              />

              {/* Paragraph */}
              <p className="mt-5 sm:mt-7 text-white/70 font-sans font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] tracking-[-0.015em] max-w-[452px]">
                {aboutData.cherishExperience.body}
              </p>

              {/* Mobile-only Infinite Loop Image Scroll between Paragraph and Feature Points */}
              <div className="lg:hidden my-6 sm:my-8 -mx-5 sm:-mx-8 overflow-hidden select-none">
                <div ref={marqueeRef} className="flex w-max will-change-transform">
                  {[0, 1, 2].map((setIndex) => (
                    <div
                      key={setIndex}
                      aria-hidden={setIndex > 0 ? "true" : undefined}
                      className="flex shrink-0 items-center gap-3 sm:gap-4 pr-3 sm:pr-4"
                    >
                      {marqueeImages.map((photo, i) => (
                        <div
                          key={`${setIndex}-${i}`}
                          className="relative h-[150px] w-[210px] sm:h-[180px] sm:w-[250px] shrink-0 overflow-hidden rounded-[14px] sm:rounded-[18px] bg-white/5"
                        >
                          <Image
                            src={photo.src}
                            alt={setIndex === 0 ? photo.alt : ""}
                            fill
                            sizes="250px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Feature Points (2x2 Grid) */}
              <div className="mt-8 sm:mt-10 border-t border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 sm:gap-y-4 gap-x-6 sm:gap-x-0">
                <div>
                  {aboutData.cherishExperience.features.slice(0, 2).map((item) => (
                    <div key={item.number}>
                      <div className="h-px bg-white/10" />
                      <div className="py-6 sm:py-8 flex items-baseline gap-2">
                        <span className="font-mono text-[14px] sm:text-[14px] tracking-[1.5px] text-white/40 font-light shrink-0">
                          {item.number}
                        </span>
                        <p className="font-sans text-[14px] text-white font-light">
                          <span>{item.title}</span> – {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {aboutData.cherishExperience.features.slice(2, 4).map((item) => (
                    <div key={item.number}>
                      <div className="h-px bg-white/10" />
                      <div className="py-6 sm:py-8 flex items-baseline gap-2">
                        <span className="font-mono text-[14px] sm:text-[12px] tracking-[1.5px] text-white/40 font-light shrink-0">
                          {item.number}
                        </span>
                        <p className="font-sans text-[14px] text-white font-light">
                          <span>{item.title}</span> – {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={aboutData.cherishExperience.actions[0].href}
                  className="w-full lg:w-auto font-mono uppercase text-center text-[10px] sm:text-[11px] tracking-[2px] rounded-full border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink px-5 sm:px-6 py-3 transition-all duration-300 active:scale-95"
                >
                  {aboutData.cherishExperience.actions[0].label}
                </Link>

                <Link
                  href={aboutData.cherishExperience.actions[1].href}
                  className="w-full lg:w-auto font-mono uppercase text-center text-[10px] sm:text-[11px] tracking-[2px] rounded-full bg-white text-ink hover:bg-neutral-200 px-5 sm:px-6 py-3 inline-flex items-center gap-2 justify-center transition-all duration-300 active:scale-95"
                >
                  <span>{aboutData.cherishExperience.actions[1].label}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4-Photo Resident Moments Mosaic (Hidden on Mobile/Tablet, Visible on Desktop) */}
            <div className="hidden lg:block space-y-4 lg:space-y-6 lg:pl-10">
              <div className="flex items-end gap-4 lg:gap-6 lg:max-w-[80%] ml-auto">
                {/* Top Left: DJ Performance */}
                <div className="relative h-[200px] w-full overflow-hidden bg-white/5">
                  <Image
                    src={aboutData.cherishExperience.photos.middle.src}
                    alt={aboutData.cherishExperience.photos.middle.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>

                {/* Top Right: Poolside Group */}
                <div className="relative h-[350px] w-full overflow-hidden bg-white/5">
                  <Image
                    src={aboutData.cherishExperience.photos.topRight.src}
                    alt={aboutData.cherishExperience.photos.topRight.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex items-end gap-4 lg:gap-6">
                {/* Bottom Left: Night Outdoor Gathering */}
                <div className="relative h-[240px] w-[40%] overflow-hidden bg-white/5">
                  <Image
                    src={aboutData.cherishExperience.photos.bottomLeft.src}
                    alt={aboutData.cherishExperience.photos.bottomLeft.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>

                {/* Bottom Right: House Party Friends */}
                <div className="relative h-[240px] w-[60%] overflow-hidden bg-white/5">
                  <Image
                    src={aboutData.cherishExperience.photos.bottomRight.src}
                    alt={aboutData.cherishExperience.photos.bottomRight.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </ViewReveal>
      </Panel>
    </section>
  );
}
