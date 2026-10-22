"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface NewHeadingProps {
  title1?: string;
  title2?: string;
  className?: string;
  title1ClassName?: string;
  title2ClassName?: string;
  animate?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
  scrollTrigger?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
}

export function Heading({
  title1,
  title2,
  className = "",
  title1ClassName = "",
  title2ClassName = "",
  animate = true,
  duration = 1.1,
  delay = 0,
  stagger = 0.15,
  start = "top 85%",
  once = true,
  scrollTrigger = true,
  as: Component = "h3",
}: NewHeadingProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || !animate) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(container, {
        type: "lines",
        linesClass: "heading-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration,
              ease: "power3.out",
              stagger,
              delay,
              scrollTrigger: scrollTrigger
                ? {
                  trigger: container,
                  start,
                  once,
                  toggleActions: "play none none none",
                }
                : undefined,
            });
        },
      });
    }, container);

    return () => ctx.revert();
  }, [
    title1,
    title2,
    animate,
    duration,
    delay,
    stagger,
    start,
    once,
    scrollTrigger,
  ]);

  return (
    <Component
      ref={containerRef as React.Ref<never>}
      className={className}
    >
      {title1 && (
        <span
          // className={`${title1ClassName || "text-[clamp(2.125rem,5.2083vw,100px)]"
          // className={`${title1ClassName || "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px]"
          className={`${title1ClassName || "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 3xl:text-[100px]"
            } font-sans font-light leading-[0.9]`}
        >
          {title1}{" "}
        </span>
      )}

      {title2 && (
        <span
          // className={`${title2ClassName || "text-[clamp(2.125rem,5.2083vw,100px)]"
          // className={`${title2ClassName || "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[100px]"
          className={`${title2ClassName || "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 3xl:text-[100px]"
            } font-display italic font-normal normal-case`}
        >
          {title2.replace(/^\*/, "").replace(/\*$/, "")}
        </span>
      )}
    </Component>
  );
}


