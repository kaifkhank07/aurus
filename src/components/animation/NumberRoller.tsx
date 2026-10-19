"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NumberRollerProps {
  value: number | string;
  suffix?: string;

  duration?: number;
  delay?: number;
  stagger?: number;

  start?: string;
  replayOnScroll?: boolean;

  className?: string;
  digitClassName?: string;
}

export default function NumberRoller({
  value,
  suffix = "",
  duration = 1.5,
  delay = 0,
  stagger = 0.1,
  start = "top 85%",
  replayOnScroll = false,
  className = "",
  digitClassName = "",
}: NumberRollerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) return;

    const ctx = gsap.context(() => {
      const digitLists =
        wrapper.querySelectorAll<HTMLElement>(".digit-list");

      if (!digitLists.length) return;

      // Start every digit at 0
      gsap.set(digitLists, {
        y: 0,
      });

      const animation = gsap.to(digitLists, {
        y: (index, element) => {
          const targetDigit = Number(
            element.getAttribute("data-target") ?? 0
          );

          return `-${targetDigit}em`;
        },
        duration,
        delay,
        stagger,
        ease: "power3.out",
        paused: true,
      });

      ScrollTrigger.create({
        trigger: wrapper,
        start,
        once: !replayOnScroll,

        toggleActions: replayOnScroll
          ? "play reverse play reverse"
          : "play none none none",

        onEnter: () => {
          animation.restart();
        },

        onEnterBack: () => {
          if (replayOnScroll) {
            animation.restart();
          }
        },
      });
    }, wrapper);

    return () => {
      ctx.revert();
    };
  }, [
    value,
    duration,
    delay,
    stagger,
    start,
    replayOnScroll,
  ]);

  const valueString = value.toString();

  return (
    <div
      ref={wrapperRef}
      className={`flex items-center h-[1em] leading-none overflow-hidden ${className}`}
    >
      {valueString.split("").map((character, index) => {
        // Non-numeric characters: +, %, comma, etc.
        if (!/\d/.test(character)) {
          return (
            <span
              key={`${character}-${index}`}
              className="shrink-0"
            >
              {character}
            </span>
          );
        }

        return (
          <div
            key={`${character}-${index}`}
            className={`stat-digit-col overflow-hidden h-[1em] ${digitClassName}`}
          >
            <div
              className="digit-list flex flex-col justify-start"
              data-target={character}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  key={num}
                  className="h-[1em] flex items-center justify-center leading-none shrink-0"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {suffix && (
        <span className="shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
}