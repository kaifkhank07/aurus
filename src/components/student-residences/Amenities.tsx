"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { amenities } from "@/data/student-residences";
import { Eyebrow, Panel } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type LenisWindow = Window & {
  lenis?: Lenis;
};

export function Amenities() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef<number>(0);
  const isInitialMount = useRef<boolean>(true);

  // GSAP crossfade animation between sticky images
  useEffect(() => {
    const images = imageRefs.current;
    const currentImg = images[active];
    const prevIndex = prevActiveRef.current;
    const prevImg = images[prevIndex];

    if (!currentImg) return;

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

    if (prevIndex === active) return;

    // Smoothly crossfade and scale newly selected image
    gsap.fromTo(
      currentImg,
      { opacity: 0, scale: 1.05, zIndex: 2 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      }
    );

    // Smoothly fade out the previous image
    if (prevImg && prevImg !== currentImg) {
      gsap.to(prevImg, {
        opacity: 0,
        scale: 0.98,
        duration: 0.55,
        ease: "power2.out",
        zIndex: 1,
        overwrite: "auto",
      });
    }

    // Keep all other images inactive
    images.forEach((img, idx) => {
      if (!img || idx === active || idx === prevIndex) return;
      gsap.set(img, { opacity: 0, zIndex: 0 });
    });

    prevActiveRef.current = active;
  }, [active]);

  // Clean up GSAP tweens
  useEffect(() => {
    const images = imageRefs.current;
    return () => {
      gsap.killTweensOf(images);
    };
  }, []);

  // Center calculation logic: detect which item is in the reading center
  // Adapts seamlessly for desktop (side-by-side center) and mobile/tablet (area below sticky image)
  const updateActiveByScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const isMobile = window.innerWidth < 1024;
    let triggerLine = window.innerHeight * 0.5;

    if (isMobile && stickyRef.current) {
      const stickyRect = stickyRef.current.getBoundingClientRect();
      const stickyBottom = stickyRect.bottom > 0 ? stickyRect.bottom : stickyRect.height;
      triggerLine = stickyBottom + (window.innerHeight - stickyBottom) * 0.48;
    }

    let closestIndex = 0;
    let minDistance = Infinity;

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - triggerLine);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActive((prev) => (prev !== closestIndex ? closestIndex : prev));
  }, []);

  // Listen to scroll events (window scroll, lenis, resize)
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveByScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Connect to Lenis if active
    const win = typeof window !== "undefined" ? (window as unknown as LenisWindow) : undefined;
    if (win?.lenis?.on) {
      win.lenis.on("scroll", onScroll);
    }

    // Initial check
    updateActiveByScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (win?.lenis?.off) {
        win.lenis.off("scroll", onScroll);
      }
    };
  }, [updateActiveByScroll]);

  // Click handler to smoothly center the clicked item in the viewport (adjusted for mobile sticky header)
  const handleItemClick = (index: number) => {
    setActive(index);
    const el = itemRefs.current[index];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const currentScroll = window.scrollY || window.pageYOffset;

    const isMobile = window.innerWidth < 1024;
    let targetLine = window.innerHeight * 0.5;

    if (isMobile && stickyRef.current) {
      const stickyRect = stickyRef.current.getBoundingClientRect();
      const stickyBottom = stickyRect.bottom > 0 ? stickyRect.bottom : stickyRect.height;
      targetLine = stickyBottom + (window.innerHeight - stickyBottom) * 0.48;
    }

    const targetScroll =
      currentScroll + rect.top - (targetLine - rect.height / 2);

    const win = typeof window !== "undefined" ? (window as unknown as LenisWindow) : undefined;
    if (win?.lenis?.scrollTo) {
      win.lenis.scrollTo(targetScroll, { duration: 1.1 });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section ref={sectionRef} id="amenities" className="pt-8 sm:pt-12 lg:pt-16">
      <Panel
        className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px] overflow-visible"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        {/* Eyebrow */}
        <Eyebrow dark>{amenities.eyebrow}</Eyebrow>

        {/* Heading */}
        <Heading
          title1={amenities.titleTop + " " + amenities.titleBottom}
          title2={amenities.titleAccent}
          className="uppercase"
        />

        {/* Main 2-column Grid: Sticky Image (Top on mobile/tablet, Left on desktop) + Scrollable List */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-14 xl:gap-20 items-start">

          {/* IMAGE CARD: Sticky on mobile, tablet & desktop */}
          <div
            ref={stickyRef}
            className="order-1 lg:order-1 sticky top-0 lg:top-16 xl:lg:top-18 z-20 w-full self-start bg-ink pt-2 pb-3 sm:pt-3 sm:pb-4 lg:bg-transparent lg:backdrop-blur-none lg:py-0"
          >
            <div className="relative w-full h-[220px] xs:h-[250px] sm:h-[300px] md:h-[360px] lg:h-[540px] xl:h-[580px] rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden bg-[#121212] border border-white/10 shadow-2xl isolate [transform:translateZ(0)]">
              {/* Stacked Images */}
              {amenities.items.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  aria-hidden={active !== i}
                  className={`absolute inset-0 rounded-[inherit] overflow-hidden will-change-transform ${i === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    priority={i <= 1}
                    className="object-cover rounded-[inherit]"
                  />
                </div>
              ))}

              {/* Dark Gradient Overlay for text contrast */}
              <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 lg:h-52 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-20 rounded-b-[inherit]" />

              {/* Bottom Card Information: Active Title on left, Counter on right */}
              <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6 lg:p-8 flex items-end justify-between gap-3 sm:gap-4 pointer-events-none">
                <div className="min-w-0 flex-1">
                  <p
                    key={`title-${active}`}
                    className="font-sans font-light uppercase text-white text-sm sm:text-lg lg:text-[22px] xl:text-[24px] tracking-tight leading-tight line-clamp-2"
                  >
                    {amenities.items[active]?.title}
                  </p>
                </div>

                <div className="shrink-0 pb-0.5">
                  <span
                    key={`counter-${active}`}
                    className="font-mono text-[11px] sm:text-xs lg:text-sm tracking-[2px] text-white/70"
                  >
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(amenities.items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SCROLLABLE LIST: Below image on mobile/tablet, right side on desktop */}
          <div className="order-2 lg:order-2 flex flex-col pt-2 sm:pt-4 lg:pt-[4vh] pb-16 sm:pb-24 lg:pb-[35vh]">
            {amenities.items.map((item, i) => {
              const isActive = active === i;
              const formattedIndex = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={item.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => handleItemClick(i)}
                  className={`group cursor-pointer border-t border-white/10 transition-colors duration-500 py-10 sm:py-14 lg:py-20 xl:py-24 min-h-[30vh] sm:min-h-[36vh] lg:min-h-[44vh] flex flex-col justify-center ${i === amenities.items.length - 1 ? "border-b" : ""
                    }`}
                >
                  {/* Number Badge */}
                  <span
                    className={`font-mono text-xs sm:text-sm tracking-[2px] uppercase block mb-2 sm:mb-4 transition-colors duration-500 ${isActive ? "text-white/60 font-medium" : "text-white/20 group-hover:text-white/40"
                      }`}
                  >
                    {formattedIndex}
                  </span>

                  {/* Title */}
                  <h3
                    className={`font-sans font-light uppercase text-xl sm:text-2xl lg:text-[clamp(1.75rem,2.2vw,36px)] xl:text-[38px] leading-[1.1] tracking-[-0.03em] transition-colors duration-500 ${isActive ? "text-white" : "text-white/25 group-hover:text-white/45"
                      }`}
                  >
                    {item.title}
                  </h3>

                  {/* Body description */}
                  <p
                    className={`font-sans text-[13px] sm:text-[15px] lg:text-[16px] leading-[1.6] tracking-[-0.02em] mt-2.5 sm:mt-4 max-w-xl transition-colors duration-500 ${isActive ? "text-zinc-300" : "text-white/20 group-hover:text-white/35"
                      }`}
                  >
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    </section>
  );
}



{
  // "use client";

  // import { useState, useEffect, useRef, useCallback } from "react";
  // import Image from "next/image";
  // import gsap from "gsap";
  // import { ScrollTrigger } from "gsap/ScrollTrigger";
  // import { amenities } from "@/data/student-residences";
  // import { Eyebrow, Panel } from "@/components/ui/Primitives";
  // import { Heading } from "../utils/Heading";

  // import type Lenis from "lenis";

  // if (typeof window !== "undefined") {
  //   gsap.registerPlugin(ScrollTrigger);
  // }

  // type LenisWindow = Window & {
  //   lenis?: Lenis;
  // };

  // export function Amenities() {
  //   const [active, setActive] = useState(0);
  //   const sectionRef = useRef<HTMLElement>(null);
  //   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  //   const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  //   const prevActiveRef = useRef<number>(0);
  //   const isInitialMount = useRef<boolean>(true);

  //   // GSAP crossfade animation between sticky images
  //   useEffect(() => {
  //     const images = imageRefs.current;
  //     const currentImg = images[active];
  //     const prevIndex = prevActiveRef.current;
  //     const prevImg = images[prevIndex];

  //     if (!currentImg) return;

  //     if (isInitialMount.current) {
  //       isInitialMount.current = false;
  //       images.forEach((img, idx) => {
  //         if (!img) return;
  //         if (idx === active) {
  //           gsap.set(img, { opacity: 1, scale: 1, zIndex: 2 });
  //         } else {
  //           gsap.set(img, { opacity: 0, scale: 1.05, zIndex: 1 });
  //         }
  //       });
  //       return;
  //     }

  //     if (prevIndex === active) return;

  //     // Smoothly crossfade and scale newly selected image
  //     gsap.fromTo(
  //       currentImg,
  //       { opacity: 0, scale: 1.05, zIndex: 2 },
  //       {
  //         opacity: 1,
  //         scale: 1,
  //         duration: 0.65,
  //         ease: "power2.out",
  //         overwrite: "auto",
  //       }
  //     );

  //     // Smoothly fade out the previous image
  //     if (prevImg && prevImg !== currentImg) {
  //       gsap.to(prevImg, {
  //         opacity: 0,
  //         scale: 0.98,
  //         duration: 0.55,
  //         ease: "power2.out",
  //         zIndex: 1,
  //         overwrite: "auto",
  //       });
  //     }

  //     // Keep all other images inactive
  //     images.forEach((img, idx) => {
  //       if (!img || idx === active || idx === prevIndex) return;
  //       gsap.set(img, { opacity: 0, zIndex: 0 });
  //     });

  //     prevActiveRef.current = active;
  //   }, [active]);

  //   // Clean up GSAP tweens
  //   useEffect(() => {
  //     const images = imageRefs.current;
  //     return () => {
  //       gsap.killTweensOf(images);
  //     };
  //   }, []);

  //   // Center calculation logic: detect which item is closest to vertical center of viewport
  //   const updateActiveByScroll = useCallback(() => {
  //     if (!sectionRef.current) return;

  //     const viewportCenter = window.innerHeight * 0.5;
  //     let closestIndex = 0;
  //     let minDistance = Infinity;

  //     itemRefs.current.forEach((el, index) => {
  //       if (!el) return;
  //       const rect = el.getBoundingClientRect();
  //       const itemCenter = rect.top + rect.height / 2;
  //       const distance = Math.abs(itemCenter - viewportCenter);

  //       if (distance < minDistance) {
  //         minDistance = distance;
  //         closestIndex = index;
  //       }
  //     });

  //     setActive((prev) => (prev !== closestIndex ? closestIndex : prev));
  //   }, []);

  //   // Listen to scroll events (window scroll, lenis, resize)
  //   useEffect(() => {
  //     let ticking = false;

  //     const onScroll = () => {
  //       if (!ticking) {
  //         window.requestAnimationFrame(() => {
  //           updateActiveByScroll();
  //           ticking = false;
  //         });
  //         ticking = true;
  //       }
  //     };

  //     window.addEventListener("scroll", onScroll, { passive: true });
  //     window.addEventListener("resize", onScroll, { passive: true });

  //     // Connect to Lenis if active
  //     const win = typeof window !== "undefined" ? (window as unknown as LenisWindow) : undefined;
  //     if (win?.lenis?.on) {
  //       win.lenis.on("scroll", onScroll);
  //     }

  //     // Initial check
  //     updateActiveByScroll();

  //     return () => {
  //       window.removeEventListener("scroll", onScroll);
  //       window.removeEventListener("resize", onScroll);
  //       if (win?.lenis?.off) {
  //         win.lenis.off("scroll", onScroll);
  //       }
  //     };
  //   }, [updateActiveByScroll]);

  //   // Click handler to smoothly center the clicked item in the viewport
  //   const handleItemClick = (index: number) => {
  //     setActive(index);
  //     const el = itemRefs.current[index];
  //     if (!el) return;

  //     const rect = el.getBoundingClientRect();
  //     const currentScroll = window.scrollY || window.pageYOffset;
  //     const targetScroll =
  //       currentScroll + rect.top - (window.innerHeight / 2 - rect.height / 2);

  //     const win = typeof window !== "undefined" ? (window as unknown as LenisWindow) : undefined;
  //     if (win?.lenis?.scrollTo) {
  //       win.lenis.scrollTo(targetScroll, { duration: 1.1 });
  //     } else {
  //       window.scrollTo({
  //         top: targetScroll,
  //         behavior: "smooth",
  //       });
  //     }
  //   };

  //   return (
  //     <section ref={sectionRef} id="amenities" className="lg:pb-[1.25vw]">
  //       <Panel
  //         className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px] overflow-visible"
  //         innerClassName="pt-9 pb-12 sm:pt-12 sm:pb-16 lg:pt-[min(3.1vw,60px)] lg:pb-0 !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)]"
  //       >
  //         {/* Eyebrow */}
  //         <Eyebrow dark>{amenities.eyebrow}</Eyebrow>

  //         {/* Heading */}
  //         <div className="mt-5 sm:mt-7 lg:mt-[min(2.4vw,46px)]">
  //           <Heading
  //             title1={amenities.titleTop + " " + amenities.titleBottom}
  //             title2={amenities.titleAccent}
  //             className="uppercase"
  //           />
  //         </div>

  //         {/* Main 2-column Grid: Sticky Left Image + Scrollable Right List */}
  //         <div className="relative py-8 sm:py-10 lg:py-[min(3.5vw,60px)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-start">

  //           {/* LEFT COLUMN: Sticky Image Card */}
  //           <div className="order-1 lg:order-1 lg:sticky lg:top-24 xl:lg:top-28 z-10 w-full self-start">
  //             <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3.8] xl:h-[580px] rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden bg-[#121212] border border-white/10 shadow-2xl">
  //               {/* Stacked Images */}
  //               {amenities.items.map((item, i) => (
  //                 <div
  //                   key={item.title}
  //                   ref={(el) => {
  //                     imageRefs.current[i] = el;
  //                   }}
  //                   aria-hidden={active !== i}
  //                   className={`absolute inset-0 will-change-transform ${
  //                     i === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
  //                   }`}
  //                 >
  //                   <Image
  //                     src={item.image}
  //                     alt={item.title}
  //                     fill
  //                     sizes="(min-width: 1024px) 45vw, 100vw"
  //                     priority={i <= 1}
  //                     className="object-cover"
  //                   />
  //                 </div>
  //               ))}

  //               {/* Dark Gradient Overlay for text contrast */}
  //               <div className="absolute inset-x-0 bottom-0 h-44 sm:h-52 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-20" />

  //               {/* Bottom Card Information: Active Title on left, Counter on right */}
  //               <div className="absolute inset-x-0 bottom-0 z-30 p-5 sm:p-7 lg:p-8 flex items-end justify-between gap-4 pointer-events-none">
  //                 <div className="min-w-0 flex-1">
  //                   <p
  //                     key={`title-${active}`}
  //                     className="font-sans font-light uppercase text-white text-base sm:text-xl lg:text-[22px] xl:text-[24px] tracking-tight leading-tight line-clamp-2 animate-fade-in"
  //                   >
  //                     {amenities.items[active]?.title}
  //                   </p>
  //                 </div>

  //                 <div className="shrink-0 pb-0.5">
  //                   <span
  //                     key={`counter-${active}`}
  //                     className="font-mono text-xs sm:text-sm tracking-[2px] text-white/70"
  //                   >
  //                     {String(active + 1).padStart(2, "0")} /{" "}
  //                     {String(amenities.items.length).padStart(2, "0")}
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* RIGHT COLUMN: Scrollable Amenities List */}
  //           <div className="order-2 lg:order-2 flex flex-col pt-4 sm:pt-6 lg:pt-[4vh] pb-16 sm:pb-24 lg:pb-[35vh]">
  //             {amenities.items.map((item, i) => {
  //               const isActive = active === i;
  //               const formattedIndex = String(i + 1).padStart(2, "0");

  //               return (
  //                 <div
  //                   key={item.title}
  //                   ref={(el) => {
  //                     itemRefs.current[i] = el;
  //                   }}
  //                   onClick={() => handleItemClick(i)}
  //                   className={`group cursor-pointer border-t border-white/10 transition-colors duration-500 py-12 sm:py-16 lg:py-20 xl:py-24 min-h-[32vh] sm:min-h-[38vh] lg:min-h-[44vh] flex flex-col justify-center ${
  //                     i === amenities.items.length - 1 ? "border-b" : ""
  //                   }`}
  //                 >
  //                   {/* Number Badge */}
  //                   <span
  //                     className={`font-mono text-xs sm:text-sm tracking-[2px] uppercase block mb-3 sm:mb-4 transition-colors duration-500 ${
  //                       isActive ? "text-white/60 font-medium" : "text-white/20 group-hover:text-white/40"
  //                     }`}
  //                   >
  //                     {formattedIndex}
  //                   </span>

  //                   {/* Title */}
  //                   <h3
  //                     className={`font-sans font-light uppercase text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.2vw,36px)] xl:text-[38px] leading-[1.1] tracking-[-0.03em] transition-colors duration-500 ${
  //                       isActive ? "text-white" : "text-white/25 group-hover:text-white/45"
  //                     }`}
  //                   >
  //                     {item.title}
  //                   </h3>

  //                   {/* Body description */}
  //                   <p
  //                     className={`font-sans text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] tracking-[-0.02em] mt-3 sm:mt-4 max-w-xl transition-colors duration-500 ${
  //                       isActive ? "text-zinc-300" : "text-white/20 group-hover:text-white/35"
  //                     }`}
  //                   >
  //                     {item.body}
  //                   </p>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       </Panel>
  //     </section>
  //   );
  // }

}

{
  // "use client";

  // import { useState, useEffect, useRef } from "react";
  // import gsap from "gsap";
  // import { amenities } from "@/data/student-residences";
  // import { Eyebrow, Figure, Panel } from "@/components/ui/Primitives";
  // import { Heading } from "../utils/Heading";

  // export function Amenities() {
  //   const [active, setActive] = useState(0);
  //   const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  //   const prevActiveRef = useRef<number>(0);
  //   const isInitialMount = useRef<boolean>(true);

  //   useEffect(() => {
  //     const images = imageRefs.current;
  //     const currentImg = images[active];
  //     const prevIndex = prevActiveRef.current;
  //     const prevImg = images[prevIndex];

  //     if (!currentImg) return;

  //     // Initial mount: set active image visible, others hidden
  //     if (isInitialMount.current) {
  //       isInitialMount.current = false;
  //       images.forEach((img, idx) => {
  //         if (!img) return;
  //         if (idx === active) {
  //           gsap.set(img, { opacity: 1, scale: 1, zIndex: 2 });
  //         } else {
  //           gsap.set(img, { opacity: 0, scale: 1.05, zIndex: 1 });
  //         }
  //       });
  //       return;
  //     }

  //     // 1. Smoothly crossfade and scale the newly selected image
  //     gsap.fromTo(
  //       currentImg,
  //       { opacity: 0, scale: 1.05, zIndex: 2 },
  //       {
  //         opacity: 1,
  //         scale: 1,
  //         duration: 0.7,
  //         ease: "power2.out",
  //         overwrite: "auto",
  //       }
  //     );

  //     // 2. Smoothly fade out the previous image underneath
  //     if (prevImg && prevImg !== currentImg) {
  //       gsap.to(prevImg, {
  //         opacity: 0,
  //         scale: 0.98,
  //         duration: 0.6,
  //         ease: "power2.out",
  //         zIndex: 1,
  //         overwrite: "auto",
  //       });
  //     }

  //     // 3. Keep all other inactive images dormant
  //     images.forEach((img, idx) => {
  //       if (!img || idx === active || idx === prevIndex) return;
  //       gsap.set(img, { opacity: 0, zIndex: 0 });
  //     });

  //     prevActiveRef.current = active;
  //   }, [active]);

  //   useEffect(() => {
  //     const images = imageRefs.current;
  //     return () => {
  //       gsap.killTweensOf(images);
  //     };
  //   }, []);

  //   return (
  //     <section className="lg:pb-[1.25vw]">
  //       <Panel
  //         className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px]"
  //         innerClassName="pt-9 pb-12 sm:pt-12 sm:pb-16 lg:py-[min(3.1vw,60px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)]"
  //       >
  //         <Eyebrow dark>{amenities.eyebrow}</Eyebrow>

  //         <div className="mt-5 sm:mt-7 lg:mt-[min(2.4vw,46px)]">
  //           <Heading
  //             title1={amenities.titleTop + " " + amenities.titleBottom}
  //             title2={amenities.titleAccent}
  //             className="uppercase"
  //           />
  //         </div>

  //         <div className="grid grid-cols-1 lg:grid-cols-[828fr_831fr] lg:items-stretch lg:gap-[min(3.5vw,67px)] mt-5 sm:mt-7 lg:mt-[min(2.2vw,42px)]">
  //           {/* Image Box: on mobile appears first below heading (order-1), on lg in left column */}
  //           <div className="order-1 relative aspect-[16/10] lg:aspect-[828/726] w-full rounded-[20px] sm:rounded-[24px] lg:rounded-[var(--radius-card)] overflow-hidden lg:h-full lg:self-stretch">
  //             {amenities.items.map((item, i) => (
  //               <div
  //                 key={item.title}
  //                 ref={(el) => {
  //                   imageRefs.current[i] = el;
  //                 }}
  //                 aria-hidden={active !== i}
  //                 className={`absolute inset-0 will-change-transform ${i === 0 ? "opacity-100" : "opacity-0"
  //                   }`}
  //               >
  //                 <Figure
  //                   src={item.image}
  //                   alt={item.title}
  //                   dark
  //                   sizes="(min-width: 1024px) 40vw, 100vw"
  //                   className="h-full w-full"
  //                 />
  //               </div>
  //             ))}
  //           </div>

  //           {/* Amenities List: on mobile appears below image (order-2), on lg in right column */}
  //           <ul className="order-2 flex flex-col gap-2.5 sm:gap-3 lg:gap-[min(0.52vw,10px)] mt-6 sm:mt-8 lg:mt-0">
  //             {amenities.items.map((item, i) => {
  //               const isOpen = active === i;

  //               return (
  //                 <li key={item.title}>
  //                   <button
  //                     type="button"
  //                     onClick={() => setActive(i)}
  //                     onMouseEnter={() => setActive(i)}
  //                     onFocus={() => setActive(i)}
  //                     aria-expanded={isOpen}
  //                     className={`flex w-full items-start justify-between gap-4 sm:gap-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[var(--radius-card)] text-left transition-all duration-300 cursor-pointer min-h-[52px] sm:min-h-[58px] lg:min-h-[min(5.1042vw,98px)] px-5 py-4 sm:px-6 sm:py-5 lg:px-[min(1.5104vw,29px)] lg:py-[min(1.0vw,19px)] ${isOpen
  //                       ? "bg-paper text-ink shadow-sm"
  //                       : "bg-white/[0.07] text-white hover:bg-white/[0.12] active:bg-white/[0.15]"
  //                       }`}
  //                   >
  //                     <span className="flex-1 min-w-0">
  //                       <span className="font-sans font-normal uppercase text-[clamp(1.25rem,1.4583vw,28px)] leading-[1.1] tracking-[-0.04em] block !text-[15px] sm:!text-[18px] lg:!text-[clamp(1.25rem,1.4583vw,28px)] !tracking-[-0.02em]">
  //                         {item.title}
  //                       </span>

  //                       <span
  //                         className={`grid transition-all duration-300 ease-out ${isOpen
  //                           ? "grid-rows-[1fr] opacity-100 mt-2.5 sm:mt-3"
  //                           : "grid-rows-[0fr] opacity-0 mt-0"
  //                           }`}
  //                       >
  //                         <span className="overflow-hidden font-sans font-normal text-[14px] leading-[1.4286] tracking-[-0.04em] text-muted leading-relaxed sm:leading-normal">
  //                           {item.body}
  //                         </span>
  //                       </span>
  //                     </span>

  //                     <span
  //                       className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] shrink-0 transition-colors duration-300 pt-0.5 sm:pt-1 ${isOpen
  //                         ? "text-muted font-medium"
  //                         : "text-white/55"
  //                         }`}
  //                     >
  //                       {String(i + 1).padStart(2, "0")}
  //                     </span>
  //                   </button>
  //                 </li>
  //               );
  //             })}
  //           </ul>
  //         </div>
  //       </Panel>
  //     </section>
  //   );
  // }
}