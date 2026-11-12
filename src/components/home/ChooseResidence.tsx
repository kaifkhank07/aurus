"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { landing } from "@/data/home";
import { ArrowRight, Eyebrow, Figure } from "@/components/ui/Primitives";
import { LandingNavbar } from "../layout/LandingNavbar";

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
      className="group relative isolate flex min-h-0 flex-col overflow-hidden rounded-[20px] sm:rounded-[28px] lg:rounded-[40px] xl:rounded-[48px] p-4 sm:p-6 lg:p-10 xl:p-14 text-white lg:h-full"
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

      {/* Mobile Eyebrow */}
      <div className="mt-4 lg:hidden">
        <Eyebrow rule={false} dark={true}>
          {brand.eyebrow}
        </Eyebrow>
      </div>

      {/* Content */}
      <div className="mt-auto space-y-4 sm:space-y-6">
        {/* Desktop Eyebrow */}
        <div className="hidden lg:block">
          <Eyebrow rule={false} dark={true}>
            {brand.eyebrow}
          </Eyebrow>
        </div>

        {/* Heading */}
        <h2 className="font-sans font-light text-[35px] lg:text-[min(4.1667vw,80px)] leading-[31.5px] lg:leading-[min(3.75vw,72px)] tracking-[-0.04em]">
          {brand.titleTop}
          <br />
          <span className="font-display italic tracking-[-0.04em] normal-case">
            {brand.titleAccent}
          </span>
        </h2>

        {/* Cities */}
        <p className="max-w-xs lg:max-w-lg font-light text-xs sm:text-sm lg:text-base xl:text-lg leading-relaxed opacity-90">
          {brand.cities}
        </p>

        {/* Enter Button */}
        <span className="inline-flex h-9 sm:h-10 lg:h-11 w-28 sm:w-32 lg:w-36 items-center justify-center gap-2 rounded-full bg-paper font-mono text-xs uppercase tracking-widest text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
          {brand.cta.label}
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

export function ChooseResidence() {
  const { brands } = landing;

  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLAnchorElement>(null);
  const rightCardRef = useRef<HTMLAnchorElement>(null);
  const leftImageRef = useRef<HTMLImageElement>(null);
  const rightImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;

    const leftImage =
      leftImageRef.current || leftCard?.querySelector("img");

    const rightImage =
      rightImageRef.current || rightCard?.querySelector("img");

    if (
      !container ||
      !leftCard ||
      !rightCard ||
      !leftImage ||
      !rightImage
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.set(container, {
        gridTemplateColumns: "1fr 1fr",
      });

      gsap.set([leftImage, rightImage], {
        scale: 1,
        transformOrigin: "center center",
      });

      const animateCards = (
        columns: string,
        leftScale: number,
        rightScale: number
      ) => {
        gsap.to(container, {
          gridTemplateColumns: columns,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(leftImage, {
          scale: leftScale,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(rightImage, {
          scale: rightScale,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const handleLeftEnter = () => {
        animateCards("1.5fr 1fr", 1.055, 1);
      };

      const handleRightEnter = () => {
        animateCards("1fr 1.5fr", 1, 1.055);
      };

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

        gsap.set(container, {
          clearProps: "gridTemplateColumns",
        });

        gsap.set([leftImage, rightImage], {
          clearProps: "scale,transformOrigin",
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="flex h-screen max-h-screen flex-col overflow-hidden bg-cream px-4 sm:px-6 lg:px-6 pb-4 sm:pb-6 pt-0">
      <LandingNavbar />

      {/* Mobile Layout */}
      <div className="grid h-full min-h-0 grid-cols-1 grid-rows-2 gap-4 sm:gap-5 lg:hidden">
        {brands.map((brand) => (
          <BrandCard key={brand.titleTop} brand={brand} />
        ))}
      </div>

      {/* Desktop Layout */}
      <div
        ref={containerRef}
        className="hidden min-h-0 flex-1 grid-cols-2 gap-5 xl:gap-6 overflow-hidden lg:grid"
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
    </section>
  );
}

