"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { amenities } from "@/data/amenities";
import { Eyebrow, Figure, Panel } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

export function Amenities() {
  const [active, setActive] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef<number>(0);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    const images = imageRefs.current;
    const currentImg = images[active];
    const prevIndex = prevActiveRef.current;
    const prevImg = images[prevIndex];

    if (!currentImg) return;

    // Initial mount: set active image visible, others hidden
    if (isInitialMount.current) {
      isInitialMount.current = false;
      images.forEach((img, idx) => {
        if (!img) return;
        if (idx === active) {
          gsap.set(img, { opacity: 1, scale: 1, zIndex: 2 });
        } else {
          gsap.set(img, { opacity: 0, scale: 1.05, zIndex: 1 });
        }
      });
      return;
    }

    // 1. Smoothly crossfade and scale the newly selected image
    gsap.fromTo(
      currentImg,
      { opacity: 0, scale: 1.05, zIndex: 2 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      }
    );

    // 2. Smoothly fade out the previous image underneath
    if (prevImg && prevImg !== currentImg) {
      gsap.to(prevImg, {
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: "power2.out",
        zIndex: 1,
        overwrite: "auto",
      });
    }

    // 3. Keep all other inactive images dormant
    images.forEach((img, idx) => {
      if (!img || idx === active || idx === prevIndex) return;
      gsap.set(img, { opacity: 0, zIndex: 0 });
    });

    prevActiveRef.current = active;
  }, [active]);

  useEffect(() => {
    const images = imageRefs.current;
    return () => {
      gsap.killTweensOf(images);
    };
  }, []);

  return (
    <section className="lg:pb-[1.25vw]">
      <Panel
        className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px]"
        innerClassName="pt-9 pb-12 sm:pt-12 sm:pb-16 lg:py-[min(3.1vw,60px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)]"
      >
        <Eyebrow dark>{amenities.eyebrow}</Eyebrow>

        <div className="mt-5 sm:mt-7 lg:mt-[min(2.4vw,46px)]">
          <Heading
            title1={amenities.titleTop + " " + amenities.titleBottom}
            title2={amenities.titleAccent}
            className="uppercase"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[828fr_831fr] lg:items-stretch lg:gap-[min(3.5vw,67px)] mt-5 sm:mt-7 lg:mt-[min(2.2vw,42px)]">
          {/* Image Box: on mobile appears first below heading (order-1), on lg in left column */}
          <div className="order-1 relative aspect-[16/10] lg:aspect-[828/726] w-full rounded-[20px] sm:rounded-[24px] lg:rounded-[var(--radius-card)] overflow-hidden lg:h-full lg:self-stretch">
            {amenities.items.map((item, i) => (
              <div
                key={item.title}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                aria-hidden={active !== i}
                className={`absolute inset-0 will-change-transform ${i === 0 ? "opacity-100" : "opacity-0"
                  }`}
              >
                <Figure
                  src={item.image}
                  alt={item.title}
                  dark
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>

          {/* Amenities List: on mobile appears below image (order-2), on lg in right column */}
          <ul className="order-2 flex flex-col gap-2.5 sm:gap-3 lg:gap-[min(0.52vw,10px)] mt-6 sm:mt-8 lg:mt-0">
            {amenities.items.map((item, i) => {
              const isOpen = active === i;

              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-start justify-between gap-4 sm:gap-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[var(--radius-card)] text-left transition-all duration-300 cursor-pointer min-h-[52px] sm:min-h-[58px] lg:min-h-[min(5.1042vw,98px)] px-5 py-4 sm:px-6 sm:py-5 lg:px-[min(1.5104vw,29px)] lg:py-[min(1.0vw,19px)] ${isOpen
                      ? "bg-paper text-ink shadow-sm"
                      : "bg-white/[0.07] text-white hover:bg-white/[0.12] active:bg-white/[0.15]"
                      }`}
                  >
                    <span className="flex-1 min-w-0">
                      <span className="font-sans font-normal uppercase text-[clamp(1.25rem,1.4583vw,28px)] leading-[1.1] tracking-[-0.04em] block !text-[15px] sm:!text-[18px] lg:!text-[clamp(1.25rem,1.4583vw,28px)] !tracking-[-0.02em]">
                        {item.title}
                      </span>

                      <span
                        className={`grid transition-all duration-300 ease-out ${isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-2.5 sm:mt-3"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                          }`}
                      >
                        <span className="overflow-hidden font-sans font-normal text-[14px] leading-[1.4286] tracking-[-0.04em] text-muted leading-relaxed sm:leading-normal">
                          {item.body}
                        </span>
                      </span>
                    </span>

                    <span
                      className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] shrink-0 transition-colors duration-300 pt-0.5 sm:pt-1 ${isOpen
                        ? "text-muted font-medium"
                        : "text-white/55"
                        }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>
    </section>
  );
}
