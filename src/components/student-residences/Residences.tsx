"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { residences } from "@/data/residences";
import { ArrowRight, Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

export function Residences() {
  const trackRef = useRef<HTMLUListElement>(null);
  const targetScrollRef = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
    <section className="pb-[min(8.4vw,162px)]">
      <Container>
        <Eyebrow>{residences.eyebrow}</Eyebrow>

        <div className="flex flex-wrap items-start justify-between gap-8 mt-6 sm:mt-8 lg:mt-[min(2.4vw,46px)]">
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
      <div>
        <ul
          ref={trackRef}
          onScroll={sync}
          className="no-scrollbar mt-[min(4.7vw,20px)] flex gap-4 overflow-x-auto pb-2 lg:gap-[min(1.5625vw,30px)]"
        >
          {residences.items.map((item, index) => (
            <li
              key={item.name}
              className={`w-[76vw] shrink-0 sm:w-[44vw] lg:w-[min(19.4271vw,373px)] ${index === 0 ? "ml-5 sm:ml-8 lg:ml-[6.25vw] 3xl:ml-[7.25vh]" : ""
                }`}
            >
              <ResidenceCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

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

function ResidenceCard({ item }: { item: (typeof residences.items)[number] }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-ink/10 bg-[#faf8f4] transition-all duration-300 hover:border-ink/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Residence Image */}
      <div className="relative aspect-[373/220] w-full shrink-0 overflow-hidden rounded-t-[14px]">
        <Figure
          src={item.image}
          alt={`${item.name} residence interior`}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 90vw"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Occupancy Badge */}
        <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute left-4 top-4 rounded-full bg-[#faf8f4] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
          {item.occupancy}
        </span>

        {/* Featured Badge */}
        {item.featured && (
          <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute right-4 top-4 rounded-full bg-[#d8c89b] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Residence Details */}
      <div className="flex flex-1 flex-col px-5 pb-3 pt-4">
        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[9px] uppercase tracking-[0.24em] text-[#88847c]">
          {item.locality}
        </p>

        <h3 className="mt-2 text-[clamp(27px,3vw,36px)] font-light uppercase leading-[1.05] tracking-[-0.055em] text-ink">
          {item.name}
        </h3>

        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2 text-[9px] uppercase tracking-[0.08em] text-[#88847c]">
          {item.distance}
        </p>

        {/* Price and Action */}
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
          <div className="min-w-0">
            <span className="block text-[10px] uppercase text-[#88847c] tracking-[0.04em] font-light">
              Starts from
            </span>

            <span className="mt-0.5 block whitespace-nowrap text-[17px] font-medium leading-none tracking-[-0.04em] text-ink">
              {item.priceFrom}
              <span className="ml-1 text-[9px] font-normal tracking-normal text-[#88847c]">
                /mo
              </span>
            </span>
          </div>

          <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex shrink-0 items-center gap-2 rounded-full border-b-2 border-ink/30 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#77736c] transition-colors group-hover:bg-ink group-hover:text-[#faf8f4]">
            View Residence
            <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
}
