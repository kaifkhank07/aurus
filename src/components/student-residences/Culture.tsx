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

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          end: () => {
            const scrollDistance = track.scrollWidth - window.innerWidth;
            // Ensure enough scroll distance so all cards are comfortably viewed before unpinning
            return `+=${Math.max(scrollDistance + 350, window.innerHeight * 1.5)}`;
          },
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
      // ref={sectionRef}
      className="w-full min-h-screen py-8 sm:py-12 lg:py-16 text-ink overflow-hidden bg-cream flex flex-col justify-center"
    >
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

        <div className="mt-4 sm:mt-6 lg:mt-[min(2.4vw,46px)]">
          <Heading
            title1={culture.titleTop}
            title2={culture.titleAccent}
            className="uppercase"
          />
        </div>
      </Container>

      {/* HORIZONTAL SCROLL TRACK */}
      <section
        ref={sectionRef}
        className="w-full overflow-hidden pt-5 sm:pt-7 lg:pt-[min(3vw,44px)]">
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 lg:gap-8 w-max pl-5 sm:pl-8 lg:pl-[6.25vw] pr-5 sm:pr-8 lg:pr-[6.25vw] will-change-transform"
        >
          {culture.posts.map((item, index) => (
            <div
              key={index}
              className="w-[260px] xs:w-[290px] sm:w-[340px] md:w-[380px] lg:w-[420px] shrink-0"
            >
              <CultureCard item={item} />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function CultureCard({ item }: { item: (typeof culture.posts)[number] }) {
  return (
    <article className="relative h-full rounded-[14px] sm:rounded-[20px] border border-line bg-white p-2.5 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
      <div className="relative overflow-hidden rounded-[8px] sm:rounded-[12px]">
        <Figure
          src={item.image}
          alt={item.alt}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 44vw, 76vw"
          className="aspect-[4/5] w-full rounded-[8px] sm:rounded-[12px] object-cover transition-transform duration-500 hover:scale-105"
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

      <div className="px-0.5 pb-1 pt-2 sm:pt-4 flex flex-col flex-1 justify-between">
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

          <p className="font-sans font-normal text-[12px] sm:text-[14px] leading-[1.4] tracking-[-0.03em] mt-2 sm:mt-3 whitespace-pre-line text-ink line-clamp-2 sm:line-clamp-3">
            <span className="font-semibold text-ink">@{item.handle}</span>{" "}
            {item.caption}
          </p>
        </div>

        <p className="font-mono uppercase text-[10px] sm:text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2 sm:mt-3 text-muted">
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
