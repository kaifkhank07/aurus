"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { testimonial } from "@/data/shared";
import { Container, Eyebrow } from "@/components/ui/Primitives";
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

      gsap.to([quoteEl, figcaptionEl], {
        opacity: 0,
        y: -14,
        duration: 0.32,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(nextIndex);

          gsap.set([quoteEl, figcaptionEl], {
            opacity: 0,
            y: 14,
          });

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
          <figure className="mx-auto flex min-h-[auto] flex-col items-center justify-center rounded-[28px] bg-cream-deep px-5 py-10 text-center sm:min-h-[auto] sm:rounded-[36px] sm:px-12 sm:py-14 lg:min-h-[min(37.81vw,726px)] lg:rounded-[var(--radius-panel)] lg:px-16 lg:py-[min(4.2vw,80px)]">
            <Eyebrow rule={false}>{testimonial.eyebrow}</Eyebrow>

            <blockquote
              ref={quoteRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="mt-5 sm:mt-7 lg:mt-[2.2vw] max-w-5xl mx-auto font-sans lg:uppercase text-[20px] sm:text-[24px] lg:text-[74px] font-light text-ink normal-case leading-[1.3] lg:leading-[1.15] lg:tracking-[-0.04em]"
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <figcaption
              ref={figcaptionRef}
              className="mt-5 sm:mt-7 lg:mt-[1.9vw] font-sans font-normal text-[10px] sm:text-[11px] lg:text-[18px] text-muted uppercase lg:text-ink  leading-[1.3889] tracking-[1.5px] lg:tracking-[2px]"
            >
              {current.attribution}
            </figcaption>

            {/* Navigation Indicator Buttons */}
            <div className="mt-6 flex w-full max-w-[8rem] items-center gap-2 sm:mt-8 lg:mt-10">
              {items.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  className="group relative -my-3 flex-1 cursor-pointer py-3"
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