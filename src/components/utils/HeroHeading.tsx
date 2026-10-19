"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeadingProps {
  /** Top line text (e.g. "Live Beyond") */
  titleTop?: string;

  /** Accent line text (e.g. "Ordinary.") */
  titleAccent?: string;

  /** Alias for titleAccent */
  accent?: string;

  /** Convenience prop: combined or single line of text */
  text?: string;

  /** Optional direct children */
  children?: React.ReactNode;

  /** Enable or disable GSAP entrance line reveal animation (default: true) */
  animate?: boolean;

  /** Alias for animate (default: true) */
  animation?: boolean;

  /** HTML tag to render (default: "h1") */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";

  /** Outer heading className */
  className?: string;

  /** Custom styling for the top line inner element */
  topClassName?: string;

  /** Custom styling for the accent line inner element */
  accentClassName?: string;

  /** Custom styling for the line mask wrappers */
  wrapperClassName?: string;

  /** Duration of reveal in seconds (default: 1.1) */
  duration?: number;

  /** Initial delay before animation begins (default: 0) */
  delay?: number;

  /** Stagger delay between top line and accent line (default: 0.25) */
  stagger?: number;

  /** ScrollTrigger start position (default: "top 85%") */
  start?: string;

  /** If true, trigger animation only once when entering viewport (default: true) */
  once?: boolean;

  /** If true, trigger animation when scrolled into viewport (default: true) */
  scrollTrigger?: boolean;
}

export function HeroHeading({
  titleTop,
  titleAccent,
  accent,
  text,
  children,
  animate,
  animation,
  as: Component = "h1",
  className = "",
  topClassName = "",
  accentClassName = "",
  wrapperClassName = "",
  duration = 1.1,
  delay = 0,
  stagger = 0.25,
  start = "top 85%",
  once = true,
  scrollTrigger = true,
}: HeadingProps) {
  // Support both animate and animation prop names, defaulting to true
  const shouldAnimate = (animate ?? animation) ?? true;

  // Resolve top text and accent text from available props
  const resolvedAccent = titleAccent ?? accent;
  let resolvedTop = titleTop;

  if (!resolvedTop && text) {
    if (text.includes("\n")) {
      const parts = text.split("\n");
      resolvedTop = parts[0];
      if (!resolvedAccent) {
        // If no explicit accent line was provided, use the rest of the text as accent
        // or keep resolvedAccent as undefined if empty
      }
    } else {
      resolvedTop = text;
    }
  }

  const containerRef = useRef<HTMLHeadingElement>(null);
  const topWrapperRef = useRef<HTMLSpanElement>(null);
  const topInnerRef = useRef<HTMLSpanElement>(null);
  const accentWrapperRef = useRef<HTMLSpanElement>(null);
  const accentInnerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!shouldAnimate) return;

    const container = containerRef.current;
    if (!container) return;

    // Respect user's prefers-reduced-motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const topWrap = topWrapperRef.current;
    const accentWrap = accentWrapperRef.current;

    if (prefersReducedMotion) {
      if (topWrap) topWrap.style.overflow = "visible";
      if (accentWrap) accentWrap.style.overflow = "visible";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: scrollTrigger
          ? {
              trigger: container,
              start,
              once,
              toggleActions: "play none none none",
            }
          : undefined,
        onComplete: () => {
          if (topWrap) topWrap.style.overflow = "visible";
          if (accentWrap) accentWrap.style.overflow = "visible";
        },
      });

      // 1. Reveal top line: yPercent 140 -> 0 with power3.out
      if (topInnerRef.current) {
        tl.fromTo(
          topInnerRef.current,
          { yPercent: 140 },
          { yPercent: 0, duration, ease: "power3.out" },
          0
        );
      }

      // 2. Reveal accent line independently with stagger
      if (accentInnerRef.current) {
        tl.fromTo(
          accentInnerRef.current,
          { yPercent: 140 },
          { yPercent: 0, duration, ease: "power3.out" },
          stagger
        );
      }
    }, container);

    return () => {
      ctx.revert();
      if (topWrap) topWrap.style.overflow = "";
      if (accentWrap) accentWrap.style.overflow = "";
    };
  }, [shouldAnimate, duration, delay, stagger, scrollTrigger, start, once]);

  // If no structured top or accent text, render children directly
  if (!resolvedTop && !resolvedAccent && children) {
    const Comp = Component as "h1";
    return (
      <Comp ref={containerRef} className={className}>
        {children}
      </Comp>
    );
  }

  const Comp = Component as "h1";
  return (
    <Comp ref={containerRef} className={className}>
      {resolvedTop && (
        <span
          ref={topWrapperRef}
          className={`block ${shouldAnimate ? "overflow-hidden pb-[0.3em] -mb-[0.3em]" : ""
            } ${wrapperClassName}`}
        >
          <span
            ref={topInnerRef}
            className={`block will-change-transform ${topClassName}`}
          >
            {resolvedTop}
          </span>
        </span>
      )}

      {resolvedAccent && (
        <span
          ref={accentWrapperRef}
          className={`block ${shouldAnimate
            ? "overflow-hidden pb-[0.3em] -mb-[0.3em] pr-[0.1em] -mr-[0.1em]"
            : ""
            } ${wrapperClassName}`}
        >
          <span
            ref={accentInnerRef}
            className={`font-display italic font-normal tracking-[-0.04em] normal-case block will-change-transform ${accentClassName}`}
          >
            {resolvedAccent}
          </span>
        </span>
      )}
    </Comp>
  );
}

