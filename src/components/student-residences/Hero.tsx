"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { hero } from "@/data/hero";
import { Figure, ArrowRight } from "@/components/ui/Primitives";
import { PillButton } from "@/components/ui/Primitives";
import { Navbar } from "../layout/Navbar";
import { Nav } from "../layout/Nav";
import { HeroHeading } from "../utils/HeroHeading";

export function Hero() {
  const mobileImageRef = useRef<HTMLImageElement>(null);
  const desktopImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: disable animations
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // Desktop Hero (>= 1024px): background image smooth zoom-in
    mm.add("(min-width: 1024px)", () => {
      if (desktopImageRef.current) {
        gsap.fromTo(
          desktopImageRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 2.0, ease: "power2.out" }
        );
      }
    });

    // Mobile & Tablet Hero (< 1024px): background image smooth zoom-in
    mm.add("(max-width: 1023px)", () => {
      if (mobileImageRef.current) {
        gsap.fromTo(
          mobileImageRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 2.0, ease: "power2.out" }
        );
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      {/* Mobile & Tablet Hero (< lg breakpoint) */}
      <div className="block lg:hidden w-full bg-cream min-h-[90svh] flex flex-col">
        {/* Top Navbar for Mobile/Tablet */}
        <Navbar variant="light" />

        {/* Hero Content Container */}
        <section className="mx-auto w-full flex-1 flex flex-col justify-start px-4 pt-8 pb-5 sm:px-6 sm:pt-4 sm:pb-7">
          {/* Rounded Card Container with Image & Overlaid Typography */}
          <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[34px] w-full p-5 sm:p-8 text-white shadow-sm flex-1 min-h-[260px] max-h-[46vh] sm:max-h-[50vh]">
            {/* Hero Image */}
            <Figure
              imageRef={mobileImageRef}
              src={hero.image}
              alt="Aurus residence lounge with layered lighting and warm timber"
              priority
              quiet
              sizes="(max-width: 640px) 100vw, 640px"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />

            {/* Gradient Overlay for Legibility */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/35"
            />

            {/* Top Eyebrow */}
            <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[11px] sm:text-[12px] tracking-[1.8px] text-white/90 uppercase">
              {hero.eyebrow}
            </p>

            {/* Bottom Heading */}
            <div className="mt-auto">
              <HeroHeading
                as="h1"
                titleTop={hero.titleTop}
                titleAccent={hero.titleAccent}
                animate={true}
                className="font-sans font-light tracking-[-0.04em] text-[32px] sm:text-[46px] leading-[1.08] text-white"
                accentClassName="text-[38px] sm:text-[52px] leading-[1.05] text-white mt-0.5 tracking-[-0.02em]"
              />
            </div>
          </div>

          {/* Text Details Below Image */}
          <div className="mt-4 sm:mt-6 px-1 shrink-0">
            {/* Body Description */}
            <p className="font-sans text-[14px] sm:text-[17px] leading-[1.4] sm:leading-[1.45] tracking-[-0.015em] text-ink font-normal">
              {hero.body}
            </p>

            {/* Cities List */}
            <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2.5 sm:mt-4 text-[11px] sm:text-[12px] tracking-[1.8px] text-muted uppercase font-normal">
              {hero.cities}
            </p>

            {/* Stacked Action Buttons */}
            <div className="mt-4 sm:mt-6 flex flex-col gap-2.5 sm:gap-3.5 w-full">
              {hero.actions.map((action, index) => {
                const isPrimary = index === 0;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] flex h-[44px] sm:h-[50px] w-full items-center justify-center gap-2.5 rounded-full text-[12px] sm:text-[13px] tracking-[2px] uppercase transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.99] ${
                      isPrimary
                        ? "border border-ink bg-ink text-paper hover:bg-neutral-800"
                        : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper"
                    }`}
                  >
                    <span>{action.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop Hero (>= lg breakpoint) */}
      <section className="hidden lg:block mx-auto w-full max-w-[1920px] overflow-hidden p-3 sm:p-4 lg:py-[1.6667vw] lg:h-[100svh]">
        <div className="rounded-panel overflow-hidden relative isolate h-full w-full min-h-0">
          <Figure
            imageRef={desktopImageRef}
            src={hero.image}
            alt="Aurus residence lounge with layered lighting and warm timber"
            priority
            quiet
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-ink/25 to-transparent"
          />

          <Nav />

          {/* 88px inner padding + 32px inset = 120px text origin (Figma: 121) */}
          <div className="flex h-full flex-col justify-center px-6 text-white sm:px-10 lg:px-[min(4.5833vw,88px)] pt-[clamp(70px,9vh,120px)] pb-[clamp(24px,4vh,48px)]">
            <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-white opacity-85">
              {hero.eyebrow}
            </p>

            {/* Figma: eyebrow top 267 → title top 421, i.e. 129px below the eyebrow box */}
            <HeroHeading
              as="h1"
              titleTop={hero.titleTop}
              titleAccent={hero.titleAccent}
              animate={true}
              className="font-sans font-light text-[clamp(2.75rem,7.8125vw,150px)] leading-[0.9] tracking-[-0.04em] mt-[clamp(16px,3.5vh,min(6.7vw,129px))] max-w-[20ch]"
            />

            {/* Figma: body width 616px, top 754 */}
            <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] mt-[clamp(14px,2.2vh,min(2.4vw,47px))] max-w-[516px] text-white tracking-[-0.2px] opacity-90 font-light">
              {hero.body}
            </p>
            <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] mt-[clamp(8px,1.2vh,16px)] text-white tracking-[-0.2px] opacity-90 font-light">
              {hero.cities}
            </p>

            <div className="mt-[clamp(16px,2.8vh,min(2.6vw,50px))] flex flex-wrap gap-4">
              {hero.actions.map((action) => (
                <PillButton key={action.href} href={action.href} variant="light">
                  {action.label}
                </PillButton>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

{
  // "use client";

  // import { useEffect, useRef } from "react";
  // import Link from "next/link";
  // import gsap from "gsap";
  // import { hero } from "@/data/hero";
  // import { Figure, ArrowRight } from "@/components/ui/Primitives";
  // import { PillButton } from "@/components/ui/Primitives";
  // import { Navbar } from "../layout/Navbar";
  // import { Nav } from "../layout/Nav";
  // import { HeroHeading } from "../utils/HeroHeading";

  // export function Hero() {
  //   const mobileImageRef = useRef<HTMLImageElement>(null);
  //   const desktopImageRef = useRef<HTMLImageElement>(null);

  //   useEffect(() => {
  //     // Respect prefers-reduced-motion: disable animations
  //     const prefersReducedMotion =
  //       typeof window !== "undefined" &&
  //       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  //     if (prefersReducedMotion) return;

  //     const mm = gsap.matchMedia();

  //     // Desktop Hero (>= 1024px): background image smooth zoom-in
  //     mm.add("(min-width: 1024px)", () => {
  //       if (desktopImageRef.current) {
  //         gsap.fromTo(
  //           desktopImageRef.current,
  //           { scale: 1.12, transformOrigin: "center center" },
  //           { scale: 1, duration: 2.0, ease: "power2.out" }
  //         );
  //       }
  //     });

  //     // Mobile & Tablet Hero (< 1024px): background image smooth zoom-in
  //     mm.add("(max-width: 1023px)", () => {
  //       if (mobileImageRef.current) {
  //         gsap.fromTo(
  //           mobileImageRef.current,
  //           { scale: 1.12, transformOrigin: "center center" },
  //           { scale: 1, duration: 2.0, ease: "power2.out" }
  //         );
  //       }
  //     });

  //     return () => {
  //       mm.revert();
  //     };
  //   }, []);

  //   return (
  //     <>
  //       {/* Mobile & Tablet Hero (< lg breakpoint) */}
  //       <div className="block lg:hidden w-full bg-cream">
  //         {/* Top Navbar for Mobile/Tablet */}
  //         <Navbar variant="light" />

  //         {/* Hero Content Container */}
  //         <section className="mx-auto w-full px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16">
  //           {/* Rounded Card Container with Image & Overlaid Typography */}
  //           <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-[26px] sm:rounded-[34px] aspect-[4/4.8] sm:aspect-[4/4.4] w-full p-6 sm:p-8 text-white shadow-sm">
  //             {/* Hero Image */}
  //             <Figure
  //               imageRef={mobileImageRef}
  //               src={hero.image}
  //               alt="Aurus residence lounge with layered lighting and warm timber"
  //               priority
  //               quiet
  //               sizes="(max-width: 640px) 100vw, 640px"
  //               className="absolute inset-0 -z-10 h-full w-full object-cover"
  //             />

  //             {/* Gradient Overlay for Legibility */}
  //             <div
  //               aria-hidden="true"
  //               className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/35"
  //             />

  //             {/* Top Eyebrow */}
  //             <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[11px] sm:text-[12px] tracking-[1.8px] text-white/90 uppercase">
  //               {hero.eyebrow}
  //             </p>

  //             {/* Bottom Heading */}
  //             <div className="mt-auto">
  //               <HeroHeading
  //                 as="h1"
  //                 titleTop={hero.titleTop}
  //                 titleAccent={hero.titleAccent}
  //                 animate={true}
  //                 className="font-sans font-light tracking-[-0.04em] text-[36px] sm:text-[46px] leading-[1.08] text-white"
  //                 accentClassName="text-[42px] sm:text-[52px] leading-[1.05] text-white mt-0.5 tracking-[-0.02em]"
  //               />
  //             </div>
  //           </div>

  //           {/* Text Details Below Image */}
  //           <div className="mt-6 sm:mt-8 px-1">
  //             {/* Body Description */}
  //             <p className="font-sans text-[15px] sm:text-[17px] leading-[1.45] tracking-[-0.015em] text-ink font-normal">
  //               {hero.body}
  //             </p>

  //             {/* Cities List */}
  //             <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-4 sm:mt-5 text-[11px] sm:text-[12px] tracking-[1.8px] text-muted uppercase font-normal">
  //               {hero.cities}
  //             </p>

  //             {/* Stacked Action Buttons */}
  //             <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-3.5 w-full">
  //               {hero.actions.map((action, index) => {
  //                 const isPrimary = index === 0;
  //                 return (
  //                   <Link
  //                     key={action.href}
  //                     href={action.href}
  //                     className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] flex h-[48px] sm:h-[52px] w-full items-center justify-center gap-2.5 rounded-full text-[12px] sm:text-[13px] tracking-[2px] uppercase transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.99] ${isPrimary
  //                       ? "border border-ink bg-ink text-paper hover:bg-neutral-800"
  //                       : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper"
  //                       }`}
  //                   >
  //                     <span>{action.label}</span>
  //                     <ArrowRight className="h-3.5 w-3.5" />
  //                   </Link>
  //                 );
  //               })}
  //             </div>
  //           </div>
  //         </section>
  //       </div>

  //       {/* Desktop Hero (>= lg breakpoint) */}
  //       <section className="hidden lg:block mx-auto w-full max-w-[1920px] overflow-hidden p-3 sm:p-4 lg:py-[1.6667vw]">
  //         <div className="rounded-panel overflow-hidden relative isolate min-h-[620px] lg:min-h-[min(52.08vw,1000px)]">
  //           <Figure
  //             imageRef={desktopImageRef}
  //             src={hero.image}
  //             alt="Aurus residence lounge with layered lighting and warm timber"
  //             priority
  //             quiet
  //             sizes="100vw"
  //             className="absolute inset-0 -z-10 h-full w-full"
  //           />
  //           <div
  //             aria-hidden="true"
  //             className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/55 via-ink/25 to-transparent"
  //           />

  //           {/* <Navbar variant="dark" /> */}
  //           <Nav />

  //           {/* 88px inner padding + 32px inset = 120px text origin (Figma: 121) */}
  //           <div className="flex min-h-[620px] flex-col justify-center px-6 pt-[22vw] pb-[8vw] text-white sm:px-10 lg:min-h-[min(52.08vw,1000px)] lg:px-[min(4.5833vw,88px)] lg:pt-[min(11.5vw,221px)] lg:pb-[min(3.85vw,74px)]">
  //             <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-white opacity-85">{hero.eyebrow}</p>

  //             {/* Figma: eyebrow top 267 → title top 421, i.e. 129px below the eyebrow box */}
  //             <HeroHeading
  //               as="h1"
  //               titleTop={hero.titleTop}
  //               titleAccent={hero.titleAccent}
  //               animate={true}
  //               className="font-sans font-light text-[clamp(2.75rem,7.8125vw,150px)] leading-[0.9] tracking-[-0.04em] mt-[min(6.7vw,129px)] max-w-[20ch]"
  //             />

  //             {/* Figma: body width 616px, top 754 */}
  //             <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] mt-[min(2.4vw,47px)] max-w-[516px] text-white tracking-[-0.2px] leading-[14px] lg:leading-[1.3158] opacity-90 font-light">
  //               {hero.body}
  //             </p>
  //             <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] mt-4 text-white tracking-[-0.2px] leading-[14px] lg:leading-[1.3158] opacity-90 font-light">{hero.cities}</p>

  //             <div className="mt-[min(2.6vw,50px)] flex flex-wrap gap-4">
  //               {hero.actions.map((action) => (
  //                 <PillButton key={action.href} href={action.href} variant="light">
  //                   {action.label}
  //                 </PillButton>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //     </>
  //   );
  // }
}