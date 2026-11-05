"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { residences } from "@/data/student-residences";
import { ArrowRight, Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import ResidenceCard from "../residences/ResidenceCard";
import useHostelAndEnquiryStore from "@/store/useHostelAndEnquiryStore";

function CarouselButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous residences" : "Next residences"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream active:scale-95 disabled:pointer-events-none disabled:opacity-25 cursor-pointer"
    >
      <ArrowRight className={direction === "prev" ? "rotate-180" : ""} />
    </button>
  );
}

export function Residences() {
  const trackRef = useRef<HTMLUListElement>(null);
  const targetScrollRef = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const {
    latestHostels,
    isLoadingLatestHostels,
    fetchLatestHostels,
  } = useHostelAndEnquiryStore();

  // Fetch dynamic public latest hostel
  useEffect(() => {
    fetchLatestHostels({ limit: 10 });
  }, [fetchLatestHostels]);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      if (trackRef.current) {
        gsap.killTweensOf(trackRef.current);
      }
    };
  }, [sync]);

  // Smooth GSAP scroll navigation without auto-scrolling
  const scrollBy = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;

    const card = el.querySelector("li");
    let step = el.clientWidth * 0.8;

    if (card) {
      const cardRect = card.getBoundingClientRect();
      const nextCard = card.nextElementSibling as HTMLElement | null;
      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        step = nextRect.left - cardRect.left; // exact card width + responsive gap
      } else {
        step = cardRect.width + 24;
      }
    }

    // Chain smoothly during rapid clicks
    const base =
      targetScrollRef.current !== null && gsap.isTweening(el)
        ? targetScrollRef.current
        : el.scrollLeft;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const newTarget = Math.max(0, Math.min(base + step * direction, maxScroll));
    targetScrollRef.current = newTarget;

    gsap.to(el, {
      scrollLeft: newTarget,
      duration: 0.75,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: sync,
      onComplete: () => {
        targetScrollRef.current = null;
        sync();
      },
    });
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 space-y-4 sm:space-y-8 lg:space-y-12">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <Eyebrow>{residences.eyebrow}</Eyebrow>

        <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-6 lg:gap-[2.4vw]">
          <Heading
            title1={residences.titleTop}
            title2={residences.titleAccent}
            className="uppercase max-w-3xl"
          />

          <div className="w-full lg:w-auto flex flex-col gap-4 sm:gap-8">
            <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] max-w-[32ch] text-left lg:text-right text-muted">
              {residences.body}
            </p>
            <div className="flex justify-end gap-2">
              <CarouselButton
                direction="prev"
                disabled={atStart}
                onClick={() => scrollBy(-1)}
              />
              <CarouselButton
                direction="next"
                disabled={atEnd}
                onClick={() => scrollBy(1)}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Track bleeds past the container on the right, as in the Figma */}
      {latestHostels.length > 0 ? (
        <div className="">
          <ul
            ref={trackRef}
            onScroll={sync}
            className="no-scrollbar flex gap-4 overflow-x-auto lg:gap-[min(1.5625vw,30px)]"
          >

            {latestHostels.map((item, index) => (
              <li
                key={index}
                className={`w-[85vw] shrink-0 sm:w-[48vw] lg:w-[min(21vw,400px)] ${index === 0 ? "ml-5 sm:ml-8 lg:ml-[6.25vw] 3xl:ml-[7.25vh]" : ""
                  }`}
              >
                <ResidenceCard item={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
          <p className="font-sans text-[16px] text-muted">
            {isLoadingLatestHostels && latestHostels.length === 0
              ? "Loading residences..."
              : "No available at the moment. Please check baack soon."}
          </p>
        </div>
      )}
    </section>
  );
}



