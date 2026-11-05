"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { locations } from "@/data/shared";
import { Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import useMasterStore from "@/store/useMasterStore";

interface LocationProps {
  showHeading?: boolean;
}

export function Locations({ showHeading = false }: LocationProps) {
  const {
    publicCities,
    isLoadingPublicCities,
    publicCitiesError,
    fetchPublicCities,
  } = useMasterStore();

  const [active, setActive] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef<number>(0);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    void fetchPublicCities();
  }, [fetchPublicCities]);

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

      prevActiveRef.current = active;
      return;
    }

    // Smoothly crossfade and scale the newly selected image
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

    // Fade out the previous image underneath
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

    // Keep all other inactive images dormant
    images.forEach((img, idx) => {
      if (!img || idx === active || idx === prevIndex) return;
      gsap.set(img, { opacity: 0, zIndex: 0 });
    });

    prevActiveRef.current = active;
  }, [active, publicCities.length]);

  useEffect(() => {
    const images = imageRefs.current;

    return () => {
      gsap.killTweensOf(images);
    };
  }, []);

  if (isLoadingPublicCities && publicCities.length === 0) {
    return null;
  }

  if (publicCitiesError && publicCities.length === 0) {
    return null;
  }

  if (publicCities.length === 0) {
    return null;
  }

  const selectedIndex = Math.min(active, publicCities.length - 1);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {showHeading && <Eyebrow>{locations.eyebrow}</Eyebrow>}

        <Heading
          title1={locations.titleTop + " " + locations.titleBottom}
          title2={locations.titleAccent}
          className="uppercase max-w-[200px] sm:max-w-full"
        />

        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* City List */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1">
            <ul>
              {publicCities.map((city, index) => {
                const isSelected = selectedIndex === index;
                const isComingSoon = city.activeHostelsCount < 1;

                return (
                  <li key={city.id ?? city._id ?? city.name}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      aria-current={isSelected}
                      className={`group flex w-full items-baseline justify-between gap-6 border-b border-line py-4 sm:py-5 lg:py-[min(2.344vw,45px)] text-left transition-colors duration-300 cursor-pointer ${index === 0 ? "lg:border-t lg:border-line" : ""
                        }`}
                    >
                      <span
                        className={`inline-block font-sans font-light uppercase text-[clamp(2.125rem,5.2083vw,100px)] sm:!text-[28px] lg:!text-[clamp(1.5rem,2.3vw,44px)] !text-[22px] leading-[0.9] !leading-[1.1] tracking-[-0.04em] transition-all duration-300 ease-out will-change-transform ${isComingSoon
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
                        className={`shrink-0 font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] transition-colors duration-300 ${isComingSoon
                          ? "text-muted/50"
                          : isSelected
                            ? "text-ink font-medium"
                            : "text-muted group-hover:text-ink"
                          }`}
                      >
                        {city.activeHostelsCount > 0
                          ? `${city.activeHostelsCount} Residences`
                          : "Comming Soon"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Image Box */}
          <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
            <div className="relative aspect-[16/10] lg:aspect-[793/690] w-full h-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[30px]">
              {publicCities.map((city, index) => (
                <div
                  key={city.id ?? city._id ?? city.name}
                  ref={(element) => {
                    imageRefs.current[index] = element;
                  }}
                  aria-hidden={selectedIndex !== index}
                  className={`absolute inset-0 will-change-transform ${index === 0 ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <Figure
                    src={city.image?.url || ""}
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