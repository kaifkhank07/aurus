"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { locations } from "@/data/locations";
import { Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

export function Locations() {
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
    <section className="pb-16 sm:pb-20 lg:pb-[min(4.5vw,86px)]">
      <Container>
        <Eyebrow>{locations.eyebrow}</Eyebrow>

        <div className="mt-5 sm:mt-7 lg:mt-[min(2.4vw,46px)]">
          <Heading
            title1={locations.titleTop + " " + locations.titleBottom}
            title2={locations.titleAccent}
            className="uppercase max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[890fr_793fr] lg:items-stretch lg:gap-[min(3.5vw,67px)] mt-5 sm:mt-7 lg:mt-[min(2.2vw,42px)]">
          {/* City List: on mobile appears below image (order-2), on lg in left column */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 mt-6 sm:mt-8 lg:mt-0">
            <ul>
              {locations.cities.map((city, index) => {
                const isSelected = active === index;

                return (
                  <li key={city.name}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      aria-current={isSelected}
                      className={`group flex w-full items-baseline justify-between gap-6 border-b border-line py-4 sm:py-5 lg:py-[min(2.344vw,45px)] text-left transition-colors duration-300 ${city.comingSoon ? "cursor-default" : "cursor-pointer"
                        } ${index === 0 ? "lg:border-t lg:border-line" : ""}`}
                    >
                      <span
                        className={`font-sans font-light uppercase text-[clamp(2.125rem,5.2083vw,100px)] leading-[0.9] tracking-[-0.04em] !text-[22px] sm:!text-[28px] lg:!text-[clamp(1.5rem,2.3vw,44px)] !leading-[1.1] inline-block transition-all duration-300 ease-out will-change-transform ${city.comingSoon
                            ? isSelected
                              ? "text-muted translate-x-3 sm:translate-x-4 lg:translate-x-5"
                              : "text-muted/50 group-hover:text-muted group-hover:translate-x-3 sm:group-hover:translate-x-4 lg:group-hover:translate-x-5"
                            : isSelected
                              ? "text-ink translate-x-3 sm:translate-x-4 lg:translate-x-5"
                              : "text-ink/40 group-hover:text-ink group-hover:translate-x-3 sm:group-hover:translate-x-4 lg:group-hover:translate-x-5"
                          }`}
                      >
                        {city.name}
                      </span>
                      <span
                        className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] shrink-0 transition-colors duration-300 ${city.comingSoon
                            ? "text-muted/50"
                            : isSelected
                              ? "text-ink font-medium"
                              : "text-muted group-hover:text-ink"
                          }`}
                      >
                        {city.meta}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Image Box: on mobile appears right below heading (order-1), on lg in right column */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <div className="relative aspect-[16/10] lg:aspect-[793/690] w-full h-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[var(--radius-wide)]">
              {locations.cities.map((city, i) => (
                <div
                  key={city.name}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  aria-hidden={active !== i}
                  className={`absolute inset-0 will-change-transform ${i === 0 ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <Figure
                    src={city.image}
                    alt={`Aurus residences in ${city.name}`}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
