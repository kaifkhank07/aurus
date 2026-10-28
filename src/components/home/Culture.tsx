"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { culture } from "@/data/culture";
import { ArrowRight, Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Culture() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Prevent mobile URL bar collapse/expand from triggering jumpy recalculations
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollAmount = () => {
        const amount = track.scrollWidth - window.innerWidth;
        return amount > 0 ? -amount : 0;
      };

      const getScrollDistance = () => {
        const distance = track.scrollWidth - window.innerWidth;
        return Math.max(0, distance);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="culture"
      ref={sectionRef}
      className="relative w-full h-[100svh] min-h-[100svh] py-4 sm:py-6 lg:py-6 text-ink overflow-hidden bg-cream flex flex-col justify-between"
    >
      <div className="shrink-0 w-full">
        <Container>
          <Eyebrow
            right={
              <Link
                href={culture.handleLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex shrink-0 items-center gap-1.5 text-ink transition-colors hover:text-muted"
              >
                {culture.handleLink.label}
                <ArrowRight />
              </Link>
            }
          >
            {culture.eyebrow}
          </Eyebrow>

          <div className="mt-2.5 sm:mt-3 lg:mt-4">
            <Heading
              title1={culture.titleTop}
              title2={culture.titleAccent}
              className="uppercase"
            />
          </div>
        </Container>
      </div>

      {/* HORIZONTAL SCROLL TRACK */}
      <div className="w-full flex-1 min-h-0 flex items-center overflow-hidden py-2 sm:py-3">
        <div
          ref={trackRef}
          className="flex items-stretch gap-4 sm:gap-6 lg:gap-8 w-max pl-5 sm:pl-8 lg:pl-[6.25vw] pr-5 sm:pr-8 lg:pr-[6.25vw] will-change-transform"
        >
          {culture.posts.map((item, index) => (
            <div
              key={index}
              className="w-[260px] xs:w-[280px] sm:w-[320px] md:w-[350px] lg:w-[clamp(280px,46vh,380px)] xl:w-[clamp(300px,48vh,420px)] 2xl:w-[clamp(320px,52vh,420px)] shrink-0"
            >
              <CultureCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CultureCard({ item }: { item: (typeof culture.posts)[number] }) {
  return (
    <article className="relative h-full rounded-[14px] sm:rounded-[20px] border border-line bg-white p-2.5 sm:p-3.5 lg:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
      <div className="relative overflow-hidden rounded-[8px] sm:rounded-[12px] w-full shrink-0">
        <Figure
          src={item.image}
          alt={item.alt}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 44vw, 76vw"
          className="aspect-[4/5] w-full max-h-[50vh] rounded-[8px] sm:rounded-[12px] object-cover transition-transform duration-500 hover:scale-105"
        />

        {item.isVideo && (
          <span
            aria-label="Video"
            className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-paper/85 text-ink shadow-sm backdrop-blur-sm"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current ml-0.5">
              <path d="M3 2.5v7l6-3.5-6-3.5Z" />
            </svg>
          </span>
        )}
      </div>

      <div className="px-0.5 pb-0.5 pt-2 sm:pt-3 lg:pt-3.5 flex flex-col flex-1 justify-between min-h-0">
        <div>
          <div className="flex items-center gap-3 sm:gap-4 text-ink">
            <Metric label="likes" value={item.likes} />
            <Metric label="comments" value={item.comments} />

            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M14.5 1.5 7 9M14.5 1.5l-5 13-2.5-5.5L1.5 6.5l13-5Z" />
            </svg>
          </div>

          <p className="font-sans font-normal text-[11px] xs:text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.35] sm:leading-[1.4] tracking-[-0.03em] mt-1.5 sm:mt-2.5 whitespace-pre-line text-ink line-clamp-2">
            <span className="font-semibold text-ink">@{item.handle}</span>{" "}
            {item.caption}
          </p>
        </div>

        <p className="font-mono uppercase text-[9px] xs:text-[10px] sm:text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-1.5 sm:mt-2 text-muted">
          {item.timeAgo}
        </p>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const icon =
    label === "likes" ? (
      <path d="M8 14S1.5 10 1.5 5.75A3.25 3.25 0 0 1 8 4.3a3.25 3.25 0 0 1 6.5 1.45C14.5 10 8 14 8 14Z" />
    ) : (
      <path d="M14.5 7.5c0 3-2.9 5.5-6.5 5.5a7.7 7.7 0 0 1-2-.26L2 14l1.1-2.6A5.2 5.2 0 0 1 1.5 7.5C1.5 4.5 4.4 2 8 2s6.5 2.5 6.5 5.5Z" />
    );

  return (
    <span className="relative flex items-center gap-1.5" aria-label={`${value} ${label}`}>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {icon}
      </svg>
      <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px]" aria-hidden="true">{value}</span>
    </span>
  );
}
