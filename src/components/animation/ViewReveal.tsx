"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ViewRevealProps {
  /** The content to reveal */
  children: React.ReactNode;
  /** Duration in ms for the reveal transition (default: 700) */
  duration?: number;
  /** Initial delay in ms before the animation starts (default: 0) */
  startDelay?: number;
  /** Distance in px the element slides up from (default: 40) */
  slideDistance?: number;
  /** Extra classes applied to the wrapper */
  className?: string;
  /** HTML tag to render as (default: "div") */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "section" | "article";
  /** If true, replays the animation every time the element scrolls into view */
  replayOnScroll?: boolean;
  /** IntersectionObserver threshold – fraction of element visible to trigger (default: 0.15) */
  threshold?: number;
  /** Easing function for the transition (default: "cubic-bezier(0.16, 1, 0.3, 1)") */
  easing?: string;
}

export default function ViewReveal({
  children,
  duration = 700,
  startDelay = 0,
  slideDistance = 40,
  className = "",
  as: Tag = "div",
  replayOnScroll = false,
  threshold = 0.15,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
}: ViewRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLElement | null>(null);

  const pathname = usePathname();

  /* ── Intersection Observer: trigger when element enters viewport ── */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Reset animation whenever pathname changes
    setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (!replayOnScroll) {
            observer.disconnect();
          }
        } else if (replayOnScroll) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [pathname, replayOnScroll, threshold]);

  return (
    <Tag
      ref={wrapperRef as React.RefObject<HTMLElement & HTMLParagraphElement & HTMLHeadingElement & HTMLDivElement>}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${slideDistance}px)`,
        transition: `opacity ${duration}ms ${easing} ${startDelay}ms, transform ${duration}ms ${easing} ${startDelay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
