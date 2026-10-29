"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { realLife } from "@/data/shared";
import { ArrowRight, Figure, Panel } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

interface RealLifeProps {
  havingTopSpace?: boolean;
}

export function RealLife({ havingTopSpace = false }: RealLifeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Smooth continuous auto-scrolling marquee from right to left
    const tween = gsap.to(marquee, {
      xPercent: -33.333333333333336, // 3 identical sets -> seamless loop at 1/3
      ease: "none",
      duration: 32, // elegant, premium luxury speed
      repeat: -1,
    });

    const handleMouseEnter = () => tween.pause();
    const handleMouseLeave = () => tween.play();
    const handleTouchStart = () => tween.pause();
    const handleTouchEnd = () => tween.play();

    marquee.addEventListener("mouseenter", handleMouseEnter);
    marquee.addEventListener("mouseleave", handleMouseLeave);
    marquee.addEventListener("touchstart", handleTouchStart, { passive: true });
    marquee.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      marquee.removeEventListener("mouseenter", handleMouseEnter);
      marquee.removeEventListener("mouseleave", handleMouseLeave);
      marquee.removeEventListener("touchstart", handleTouchStart);
      marquee.removeEventListener("touchend", handleTouchEnd);
      tween.kill();
    };
  }, []);

  return (
    <section className={`${havingTopSpace ? "pb-8 lg:pt-8" : "py-8 sm:py-12 lg:py-16"} -mt-1 lg:mt-0`}>
      <Panel
        className="bg-ink text-white lg:rounded-[57px]"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 ">
          <div className="max-w-[700px]">
            {/* Figma hero-title: Manrope 300 / 100px / 90% / -4%, uppercase */}
            <Heading
              title1={realLife.titleTop}
              title2={realLife.titleAccent}
              className="uppercase max-w-sm 3xl:max-w-2xl"
            />

            {/* Figma: 456px wide, Manrope 19px */}
            <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] mt-5 sm:mt-6 lg:mt-[min(2.1vw,40px)] max-w-[456px] text-white/85 sm:text-white tracking-normal">
              {realLife.body}
            </p>

            {/* Fine print note in mono uppercase */}
            <p className="font-mono text-[10px] sm:text-[11px] lg:text-[12px] tracking-[1.5px] uppercase text-white/50 leading-relaxed mt-4 sm:mt-5 lg:mt-[min(1.6vw,30px)] max-w-[624px]">
              {realLife.note}
            </p>

            {/* Mobile / Tablet: Full-width rounded pill CTA button */}
            <Link
              href={realLife.badge.href}
              className="lg:hidden mt-6 sm:mt-8 flex h-[48px] sm:h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-white/35 px-6 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] text-white transition-colors hover:bg-white hover:text-ink active:bg-white/20"
            >
              <span>{realLife.badge.label}</span>
              <ArrowRight />
            </Link>
          </div>

          {/* Desktop only: Circular badge */}
          <Link
            href={realLife.badge.href}
            className="hidden lg:flex font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] aspect-square w-[10.2vw] min-w-[120px] shrink-0 items-center justify-center rounded-full border border-white/45 p-4 text-center leading-relaxed transition-colors hover:bg-white hover:text-ink"
          >
            <span className="inline-flex items-center gap-1">
              {realLife.badge.label}
              <ArrowRight />
            </span>
          </Link>
        </div>

        {/* Bottom images strip — smooth auto-scrolling right-to-left */}
        {/* no-scrollbar flex items-start gap-4 sm:gap-6 lg:gap-[min(3.2292vw,62px)] mt-8 sm:mt-10 lg:mt-[min(2.2vw,42px)] overflow-x-auto pb-2 */}
        <div className="w-full flex items-start gap-4 sm:gap-6 lg:gap-[min(3.2292vw,62px)]">
          <div
            ref={marqueeRef}
            className="flex w-max will-change-transform select-none"
          >
            {[0, 1, 2].map((setIndex) => (
              <ul
                key={setIndex}
                aria-hidden={setIndex > 0 ? "true" : undefined}
                className="flex shrink-0 items-start gap-4 sm:gap-6 lg:gap-[min(3.2292vw,62px)] pr-4 sm:pr-6 lg:pr-[min(3.2292vw,62px)]"
              >
                {realLife.photos.map((photo, i) => (
                  <li
                    key={`${setIndex}-${i}`}
                    style={{ marginTop: `${photo.offset / 19.2}vw` }}
                    className="w-[42vw] shrink-0 sm:w-[25vw] lg:w-[min(16.4063vw,315px)]"
                  >
                    <Figure
                      src={photo.src}
                      alt={setIndex === 0 ? photo.alt : ""}
                      dark
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 42vw"
                      className="aspect-[315/420] w-full rounded-[var(--radius-card)]"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  );
}

