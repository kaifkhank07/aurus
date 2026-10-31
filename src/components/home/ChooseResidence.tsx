"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { landing } from "@/data/home";
import { nav } from "@/data/layout";
import { ArrowRight, Figure } from "@/components/ui/Primitives";
import { useResidences } from "@/store/useResidences";
import { LandingNavbar } from "../layout/LandingNavbar";

// Sub Component
interface BrandCardProps {
  brand: (typeof landing.brands)[number];
  cardRef?: React.Ref<HTMLAnchorElement>;
  imageRef?: React.Ref<HTMLImageElement>;
}

function BrandCard({ brand, cardRef, imageRef }: BrandCardProps) {
  return (
    <Link
      ref={cardRef}
      href={brand.cta.href}
      aria-label={`${brand.titleTop} ${brand.titleAccent} — enter`}
      className="group relative isolate flex min-h-0 flex-col overflow-hidden rounded-[22px] p-4 text-white lg:h-full lg:rounded-[min(2.9688vw,57px)] lg:px-[min(3.1771vw,61px)] lg:pt-[min(2.5vw,48px)] lg:pb-[min(2.2396vw,43px)]"
    >
      <Figure
        imageRef={imageRef}
        src={brand.image}
        alt={brand.alt}
        quiet
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="absolute inset-0 -z-10 h-full w-full"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/25 to-black/20"
      />

      <p className="lg:hidden font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[12px] leading-[25px] text-white lg:text-[min(0.7292vw,14px)] lg:leading-[1.7857] opacity-85">
        {brand.eyebrow}
      </p>

      {/* Mobile: 90px gap, Desktop: mt-auto anchors content to the bottom */}
      <div className="mt-[90px] lg:mt-auto">
        <p className="hidden lg:block font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[12px] leading-[25px] text-white lg:text-[min(0.7292vw,14px)] lg:leading-[1.7857] opacity-85">
          {brand.eyebrow}
        </p>

        <h2 className="mt-[20px] font-sans text-[35px] leading-[31.5px] font-light tracking-[-0.04em] lg:text-[min(4.1667vw,80px)] lg:leading-[min(3.75vw,72px)]">
          {brand.titleTop}
          <br />
          <span className="font-display italic font-normal tracking-[-0.04em] normal-case">{brand.titleAccent}</span>
        </h2>

        <p className="mt-[33px] max-w-[280px] text-[12px] leading-[14px] lg:mt-[clamp(16px,2vh,36px)] lg:max-w-[min(28.4896vw,547px)] lg:text-[min(0.9896vw,19px)] lg:leading-[1.3158] opacity-90 font-light">
          {brand.body}
        </p>

        <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-[33px] inline-flex h-[35px] w-[102px] items-center justify-center gap-2 rounded-full bg-paper text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper lg:mt-[clamp(16px,2.2vh,36px)] lg:h-[min(2.1875vw,42px)] lg:w-[min(6.6667vw,128px)]">
          {brand.cta.label}
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

// Main Component
export function ChooseResidence() {
  const { brands } = landing;
  const { setSelectedResidence } = useResidences();
  const [mobileOpen, setMobileOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLAnchorElement>(null);
  const rightCardRef = useRef<HTMLAnchorElement>(null);
  const leftImageRef = useRef<HTMLImageElement>(null);
  const rightImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const leftImg = leftImageRef.current || leftCard?.querySelector("img");
    const rightImg = rightImageRef.current || rightCard?.querySelector("img");

    if (!container || !leftCard || !rightCard || !leftImg || !rightImg) return;

    const mm = gsap.matchMedia();

    // Enable hover animation only on desktop (lg breakpoint: min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      // Set initial balanced proportions: 50% / 50%
      gsap.set(container, { gridTemplateColumns: "1fr 1fr" });
      gsap.set([leftImg, rightImg], { scale: 1, transformOrigin: "center center" });

      const DURATION = 0.7;
      const EASE = "power3.out";

      const animateCards = (cols: string, leftScale: number, rightScale: number) => {
        gsap.to(container, {
          gridTemplateColumns: cols,
          duration: DURATION,
          ease: EASE,
          overwrite: "auto",
        });
        gsap.to(leftImg, {
          scale: leftScale,
          duration: DURATION,
          ease: EASE,
          overwrite: "auto",
        });
        gsap.to(rightImg, {
          scale: rightScale,
          duration: DURATION,
          ease: EASE,
          overwrite: "auto",
        });
      };

      // Hover left card: Left 60% (1.5fr), Right 40% (1fr), zoom left image
      const handleLeftEnter = () => {
        animateCards("1.5fr 1fr", 1.055, 1);
      };

      // Hover right card: Left 40% (1fr), Right 60% (1.5fr), zoom right image
      const handleRightEnter = () => {
        animateCards("1fr 1.5fr", 1, 1.055);
      };

      // Mouse leaves card area: smoothly return to 50% / 50% (1fr 1fr), scale 1
      const handleContainerLeave = () => {
        animateCards("1fr 1fr", 1, 1);
      };

      leftCard.addEventListener("mouseenter", handleLeftEnter);
      rightCard.addEventListener("mouseenter", handleRightEnter);
      container.addEventListener("mouseleave", handleContainerLeave);

      return () => {
        leftCard.removeEventListener("mouseenter", handleLeftEnter);
        rightCard.removeEventListener("mouseenter", handleRightEnter);
        container.removeEventListener("mouseleave", handleContainerLeave);
        gsap.set(container, { clearProps: "gridTemplateColumns" });
        gsap.set([leftImg, rightImg], { clearProps: "scale,transformOrigin" });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <main className="flex h-screen max-h-screen flex-col bg-cream pb-4 sm:pb-6 pt-0 overflow-hidden px-4 lg:px-[min(1.3021vw,25px)]">
      {/* Top bar — 79px tall at 1920, matches attached design */}
      <LandingNavbar />

      {/* Cards — 860px tall at 1920, 22px gutter */}
      <div className="lg:hidden grid h-full min-h-0 grid-cols-1 grid-rows-2 gap-[22px]">
        {brands.map((brand) => (
          <BrandCard key={brand.titleTop} brand={brand} />
        ))}
      </div>

      <div
        ref={containerRef}
        className="hidden lg:grid min-h-0 flex-1 grid-cols-1 grid-rows-2 gap-[22px] overflow-hidden sm:grid-cols-2 sm:grid-rows-1 sm:gap-[22px] lg:gap-[min(1.1458vw,22px)]"
      >
        {brands.map((brand, index) => (
          <BrandCard
            key={brand.titleTop}
            brand={brand}
            cardRef={index === 0 ? leftCardRef : rightCardRef}
            imageRef={index === 0 ? leftImageRef : rightImageRef}
          />
        ))}
      </div>
    </main>
  );
}
