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
  const mobileMarqueeRightRef = useRef<HTMLDivElement>(null);
  const mobileMarqueeLeftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    const mobileRight = mobileMarqueeRightRef.current;
    const mobileLeft = mobileMarqueeLeftRef.current;

    const tweens: gsap.core.Tween[] = [];

    // Desktop: Smooth continuous auto-scrolling marquee from right to left
    if (marquee) {
      const tween = gsap.to(marquee, {
        xPercent: -33.333333333333336,
        ease: "none",
        duration: 32,
        repeat: -1,
      });

      const handleMouseEnter = () => tween.pause();
      const handleMouseLeave = () => tween.play();
      const handleTouchStart = () => tween.pause();
      const handleTouchEnd = () => tween.play();

      marquee.addEventListener("mouseenter", handleMouseEnter);
      marquee.addEventListener("mouseleave", handleMouseLeave);
      marquee.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      marquee.addEventListener("touchend", handleTouchEnd, {
        passive: true,
      });

      tweens.push(tween);

      // Mobile/desktop cleanup
      const cleanupDesktop = () => {
        marquee.removeEventListener("mouseenter", handleMouseEnter);
        marquee.removeEventListener("mouseleave", handleMouseLeave);
        marquee.removeEventListener("touchstart", handleTouchStart);
        marquee.removeEventListener("touchend", handleTouchEnd);
      };

      // Keep cleanup available for the effect's return
      desktopCleanup = cleanupDesktop;
    }

    // Mobile: First row moves right to left
    if (mobileRight) {
      tweens.push(
        gsap.fromTo(
          mobileRight,
          { xPercent: 0 },
          {
            xPercent: -50,
            duration: 25,
            ease: "none",
            repeat: -1,
          }
        )
      );
    }

    // Mobile: Second row moves left to right
    if (mobileLeft) {
      tweens.push(
        gsap.fromTo(
          mobileLeft,
          { xPercent: -50 },
          {
            xPercent: 0,
            duration: 25,
            ease: "none",
            repeat: -1,
          }
        )
      );
    }

    return () => {
      desktopCleanup?.();
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  return (
    <section
      className={`-mt-1 lg:mt-0 ${havingTopSpace ? "pb-8 lg:pt-8" : "py-8 sm:py-12 lg:py-16"
        }`}
    >
      <Panel
        className="bg-ink text-white lg:rounded-[57px]"
        innerClassName="space-y-6 sm:space-y-8 lg:space-y-12 pt-6 sm:pt-10 pb-12 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="space-y-4 lg:space-y-8">
            {/* Figma hero-title: Manrope 300 / 100px / 90% / -4%, uppercase */}
            <Heading
              title1={realLife.titleTop}
              title2={realLife.titleAccent}
              className="max-w-[200px] sm:max-w-[320px] uppercase"
            />

            {/* Figma: 456px wide, Manrope 19px */}
            <p className="max-w-[440px] font-sans font-light text-[clamp(0.9rem,0.9896vw,19px)] leading-sung text-white/80 opacity-80 sm:opacity-100 sm:tracking-normal">
              {realLife.body}
            </p>

            {/* Fine print note in mono uppercase */}
            <p className="max-w-[560px] font-mono font-light uppercase text-[clamp(0.9rem,0.9896vw,19px)] leading-sung text-white/80 opacity-80 sm:opacity-100 sm:tracking-normal">
              {realLife.note}
            </p>

            {/* Mobile / Tablet: Full-width rounded pill CTA button */}
            <Link
              href={realLife.badge.href}
              className="mt-6 sm:mt-8 lg:hidden flex h-[48px] sm:h-[52px] w-full items-center justify-center gap-2.5 rounded-full border border-white/35 px-6 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] text-white transition-colors hover:bg-white hover:text-ink active:bg-white/20"
            >
              <span>{realLife.badge.label}</span>
              <ArrowRight />
            </Link>
          </div>

          {/* Desktop only: Circular badge */}
          <Link
            href={realLife.badge.href}
            className="hidden lg:flex aspect-square w-[10.2vw] min-w-[120px] shrink-0 items-center justify-center rounded-full border border-white/45 p-4 font-mono text-[clamp(11px,0.7292vw,14px)] uppercase leading-[1.7857] tracking-[2px] text-center leading-relaxed transition-colors hover:bg-white hover:text-ink"
          >
            <span className="inline-flex items-center gap-1">
              {realLife.badge.label}
              <ArrowRight />
            </span>
          </Link>
        </div>

        {/* Mobile: Two horizontal scrolling rows */}
        <div className="lg:hidden flex flex-col gap-4 overflow-hidden">
          {[0, 1].map((rowIndex) => (
            <div key={rowIndex} className="w-full overflow-hidden">
              <div
                ref={
                  rowIndex === 0
                    ? mobileMarqueeRightRef
                    : mobileMarqueeLeftRef
                }
                className="flex w-max"
              >
                {[0, 1].map((setIndex) => (
                  <ul
                    key={setIndex}
                    aria-hidden={setIndex > 0 ? "true" : undefined}
                    className="flex shrink-0 items-center gap-4 pr-4"
                  >
                    {realLife.photos.map((photo, i) => (
                      <li
                        key={`${rowIndex}-${setIndex}-${i}`}
                        className="w-[42vw] shrink-0"
                      >
                        <Figure
                          src={photo.src}
                          alt={setIndex === 0 ? photo.alt : ""}
                          dark
                          sizes="42vw"
                          className="aspect-square w-full rounded-[12px]"
                        />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Existing scrolling images strip */}
        <div className="hidden lg:flex w-full items-start gap-4 sm:gap-6 lg:gap-[min(3.2292vw,62px)]">
          <div
            ref={marqueeRef}
            className="flex w-max select-none will-change-transform"
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
                    className="w-[42vw] sm:w-[25vw] lg:w-[min(16.4063vw,315px)] shrink-0 cursor-pointer"
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

let desktopCleanup: (() => void) | undefined;