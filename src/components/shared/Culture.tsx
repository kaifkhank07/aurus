"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { culture } from "@/data/shared";
import { ArrowRight, Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Duplicate array 1-2 times (3 sets total) for smooth loop / extended horizontal scroll on desktop
const desktopPosts = [...culture.posts, ...culture.posts];

export function Culture() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Prevent mobile URL bar collapse/expand from triggering jumpy recalculations
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    // Horizontal pinned scroll exclusively for desktop (>= lg)
    mm.add("(min-width: 1024px)", () => {
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
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="culture"
      ref={sectionRef}
      className="relative w-full py-8 sm:py-12 lg:py-6 lg:h-[100svh] lg:min-h-[100svh] text-ink bg-cream lg:overflow-hidden flex flex-col lg:justify-between"
    >
      {/* Section Header */}
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

      {/* MOBILE VERTICAL GRID (< lg) - matching reference design */}
      <div className="block lg:hidden w-full mt-6 sm:mt-8">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 max-w-[420px] mx-auto">
            {culture.posts.map((item, index) => (
              <div key={index} className="w-full">
                <CultureCard item={item} />
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* DESKTOP HORIZONTAL SCROLL TRACK (>= lg) */}
      <div className="hidden lg:flex w-full flex-1 min-h-0 items-center overflow-hidden py-2 sm:py-3">
        <div
          ref={trackRef}
          className="flex items-stretch gap-4 sm:gap-6 lg:gap-8 w-max pl-5 sm:pl-8 lg:pl-[6.25vw] pr-5 sm:pr-8 lg:pr-[6.25vw] will-change-transform"
        >
          {desktopPosts.map((item, index) => (
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
    <article className="relative rounded-[16px] sm:rounded-[18px] lg:rounded-[20px] border border-black/[0.08] bg-white p-3 sm:p-3.5 lg:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
      {/* Post Media */}
      <div className="relative overflow-hidden rounded-[10px] sm:rounded-[12px] w-full shrink-0">
        <Figure
          src={item.image}
          alt={item.alt}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[5/4] lg:aspect-[4/5] w-full lg:max-h-[50vh] rounded-[10px] sm:rounded-[12px] object-cover transition-transform duration-500 hover:scale-105"
        />

        {item.isVideo && (
          <span
            aria-label="Video"
            className="hidden lg:flex absolute right-2.5 top-2.5 h-7 w-7 items-center justify-center rounded-full bg-paper/85 text-ink shadow-sm backdrop-blur-sm"
          >
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 fill-current ml-0.5">
              <path d="M3 2.5v7l6-3.5-6-3.5Z" />
            </svg>
          </span>
        )}
      </div>

      {/* Post Details */}
      <div className="px-0.5 pb-0.5 pt-3 sm:pt-4 lg:pt-4 flex flex-col flex-1 justify-between min-h-0">
        <div>
          {/* Action Row: Likes, Comments, Share */}
          <div className="flex items-center gap-3.5 sm:gap-4 text-ink">
            <Metric label="likes" value={item.likes} />
            <Metric label="comments" value={item.comments} />

            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-ink shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M14.5 1.5 7 9M14.5 1.5l-5 13-2.5-5.5L1.5 6.5l13-5Z" />
            </svg>
          </div>

          {/* Caption */}
          <p className="font-sans font-normal text-[12px] sm:text-[14px] lg:text-[16px] leading-[1.38] sm:leading-[1.42] tracking-[-0.02em] mt-2.5 sm:mt-3 whitespace-pre-line text-ink line-clamp-3 lg:line-clamp-2">
            <span className="font-semibold text-ink">@{item.handle}</span>{" "}
            {item.caption}
          </p>
        </div>

        {/* Timestamp */}
        <p className="font-mono uppercase text-[9px] xs:text-[10px] sm:text-[11px] lg:text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[1.5px] mt-2.5 sm:mt-3 text-muted">
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
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-ink shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {icon}
      </svg>
      <span className="font-sans text-[11px] xs:text-[12px] sm:text-[13px] font-medium tracking-normal text-ink leading-none" aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
