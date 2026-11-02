"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { testimonial } from "@/data/shared";
import { Container } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";

const AUTO_PLAY_INTERVAL = 4000;

export function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const quoteRef = useRef<HTMLQuoteElement>(null);
  const figcaptionRef = useRef<HTMLElement>(null);
  const isAnimatingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const items = testimonial.items;

  const goToSlide = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const quoteEl = quoteRef.current;
      const figcaptionEl = figcaptionRef.current;

      if (!quoteEl || !figcaptionEl) {
        setActiveIndex(nextIndex);
        isAnimatingRef.current = false;
        return;
      }

      // Smooth fade-out and subtle upward motion
      gsap.to([quoteEl, figcaptionEl], {
        opacity: 0,
        y: -14,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(nextIndex);

          // Reset starting position below
          gsap.set([quoteEl, figcaptionEl], {
            opacity: 0,
            y: 14,
          });

          // Smooth reveal of the new quote and attribution
          gsap.to(quoteEl, {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: "power2.out",
          });

          gsap.to(figcaptionEl, {
            opacity: 1,
            y: 0,
            duration: 0.48,
            delay: 0.08,
            ease: "power2.out",
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          });
        },
      });
    },
    [activeIndex]
  );

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    const next = (activeIndex + 1) % items.length;
    goToSlide(next);
  }, [activeIndex, goToSlide, items.length]);

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, handleNext, items.length]);

  // Clean up any active GSAP tweens on unmount
  useEffect(() => {
    return () => {
      if (quoteRef.current) gsap.killTweensOf(quoteRef.current);
      if (figcaptionRef.current) gsap.killTweensOf(figcaptionRef.current);
    };
  }, []);

  const current = items[activeIndex] || items[0];

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <ViewReveal duration={800}>
          <figure
            className="mx-auto flex min-h-[auto] lg:min-h-[min(37.81vw,726px)] max-w-[1690px] flex-col items-center justify-center rounded-[28px] sm:rounded-[36px] lg:rounded-[var(--radius-panel)] bg-cream-deep px-5 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-[min(4.2vw,80px)] text-center"
          >
            <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-muted lg:text-ink">
              {testimonial.eyebrow}
            </p>

            <blockquote
              ref={quoteRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="font-sans font-light normal-case text-ink mx-auto mt-5 sm:mt-7 lg:mt-[2.2vw] max-w-[28ch] text-[20px] sm:text-[24px] lg:font-sans lg:font-light lg:uppercase lg:text-[clamp(2.125rem,5.2083vw,100px)] lg:leading-[0.9] lg:tracking-[-0.04em] lg:text-ink lg:uppercase lg:!text-[clamp(1.6rem,3.02vw,58px)] leading-[1.3] lg:!leading-[1.15]"
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <figcaption
              ref={figcaptionRef}
              className="font-sans font-normal uppercase text-[18px] leading-[1.3889] tracking-[2px] mt-5 sm:mt-7 lg:mt-[1.9vw] text-muted lg:text-ink !text-[10px] sm:!text-[11px] lg:!text-[18px] tracking-[1.5px] lg:tracking-[2px] uppercase"
            >
              {current.attribution}
            </figcaption>

            {/* Navigation Indicator Buttons */}
            <div className="mt-6 sm:mt-8 lg:mt-10 flex w-full max-w-[8rem] items-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className="group relative flex-1 py-3 -my-3 cursor-pointer"
                >
                  <span
                    className={`block h-[3px] w-full rounded-full transition-colors duration-300 ${index === activeIndex
                      ? "bg-ink"
                      : "bg-ink/20 group-hover:bg-ink/40"
                      }`}
                  />
                </button>
              ))}
            </div>
          </figure>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default Testimonial;
