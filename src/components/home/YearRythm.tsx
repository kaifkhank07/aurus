
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import type Lenis from "lenis";
import { Eyebrow, Panel } from "../ui/Primitives";
import { Heading } from "../utils/Heading";
import { yearlyRhythmData } from "@/data/home/yearRythmData";

type LenisWindow = Window & {
  lenis?: Lenis;
};

export default function YearRythm() {
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef = useRef(0);
  const isInitialMount = useRef(true);

  // GSAP crossfade animation between images
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

        gsap.set(img, {
          opacity: idx === active ? 1 : 0,
          scale: idx === active ? 1 : 1.05,
          zIndex: idx === active ? 2 : 1,
        });
      });

      return;
    }

    if (prevIndex === active) return;

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

    images.forEach((img, idx) => {
      if (!img || idx === active || idx === prevIndex) return;
      gsap.set(img, { opacity: 0, zIndex: 0 });
    });

    prevActiveRef.current = active;
  }, [active]);

  // Clean up GSAP animations
  useEffect(() => {
    const images = imageRefs.current;

    return () => {
      gsap.killTweensOf(images);
    };
  }, []);

  // Detect the timeline item closest to the reading center
  const updateActiveByScroll = useCallback(() => {
    if (!sectionRef.current) return;

    const isMobile = window.innerWidth < 1024;
    let triggerLine = window.innerHeight * 0.5;

    if (isMobile && stickyRef.current) {
      const stickyRect = stickyRef.current.getBoundingClientRect();
      const stickyBottom =
        stickyRect.bottom > 0 ? stickyRect.bottom : stickyRect.height;

      triggerLine =
        stickyBottom + (window.innerHeight - stickyBottom) * 0.48;
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

    setActive((prev) =>
      prev !== closestIndex ? closestIndex : prev
    );
  }, []);

  // Scroll, resize and Lenis listeners
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

    const win = window as unknown as LenisWindow;

    if (win.lenis?.on) {
      win.lenis.on("scroll", onScroll);
    }

    updateActiveByScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (win.lenis?.off) {
        win.lenis.off("scroll", onScroll);
      }
    };
  }, [updateActiveByScroll]);

  // Smoothly center clicked timeline item
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
      const stickyBottom =
        stickyRect.bottom > 0 ? stickyRect.bottom : stickyRect.height;

      targetLine =
        stickyBottom + (window.innerHeight - stickyBottom) * 0.48;
    }

    const targetScroll =
      currentScroll + rect.top - (targetLine - rect.height / 2);

    const win = window as unknown as LenisWindow;

    if (win.lenis?.scrollTo) {
      win.lenis.scrollTo(targetScroll, { duration: 1.1 });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-0"
    >
      <Panel
        className="bg-ink text-white rounded-[36px] sm:rounded-[48px] lg:rounded-[57px] overflow-visible"
        innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
      >
        {/* Eyebrow */}
        <Eyebrow dark>{yearlyRhythmData.eyebrow}</Eyebrow>

        {/* Heading and Description */}
        <div>
          <Heading
            title1={yearlyRhythmData.titleTop}
            title2={yearlyRhythmData.titleAccent}
            className="uppercase max-w-[248px] sm:max-w-full text-white"
          />

          <p className="max-w-[440px] mt-4 sm:mt-5 font-sans font-light text-[clamp(0.9rem,0.9896vw,19px)] leading-sung text-white/80 opacity-80 sm:opacity-100 sm:tracking-normal ">
            {yearlyRhythmData.body}
          </p>
        </div>

        {/* Main Grid: Sticky Image + Scrollable Timeline */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-14 xl:gap-20 items-start">

          {/* STICKY IMAGE CARD */}
          <div
            ref={stickyRef}
            className="order-1 lg:order-1 sticky top-0 lg:top-16 xl:top-18 z-20 w-full self-start bg-ink pt-2 pb-3 sm:pt-3 sm:pb-4 lg:bg-transparent lg:py-0"
          >
            <div className="relative w-full h-[220px] xs:h-[250px] sm:h-[300px] md:h-[360px] lg:h-[540px] xl:h-[580px] rounded-[18px] sm:rounded-[24px] lg:rounded-[28px] overflow-hidden bg-[#121212] border border-white/10 shadow-2xl isolate [transform:translateZ(0)]">

              {/* Stacked Images */}
              {yearlyRhythmData.timeline.map((slot, i) => (
                <div
                  key={slot.time}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  aria-hidden={active !== i}
                  className={`absolute inset-0 rounded-[inherit] overflow-hidden will-change-transform ${i === 0
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                    }`}
                >
                  <Image
                    src={slot.image}
                    alt={slot.activity}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    priority={i <= 1}
                    className="object-cover rounded-[inherit]"
                  />
                </div>
              ))}

              {/* Dark Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 lg:h-52 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-20 rounded-b-[inherit]" />

              {/* Active Timeline Information */}
              <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-6 lg:p-8 flex items-end justify-between gap-3 sm:gap-4 pointer-events-none">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] sm:text-xs tracking-[2px] text-white/60 mb-2">
                    {yearlyRhythmData.timeline[active]?.time}
                  </p>

                  <p
                    key={`activity-${active}`}
                    className="font-sans font-light uppercase text-white text-sm sm:text-lg lg:text-[22px] xl:text-[24px] tracking-tight leading-tight line-clamp-2"
                  >
                    {yearlyRhythmData.timeline[active]?.activity}
                  </p>
                </div>

                <div className="shrink-0 pb-0.5">
                  <span
                    key={`counter-${active}`}
                    className="font-mono text-[11px] sm:text-xs lg:text-sm tracking-[2px] text-white/70"
                  >
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(yearlyRhythmData.timeline.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SCROLLABLE TIMELINE */}
          <div className="order-2 lg:order-2 flex flex-col pt-2 sm:pt-4 lg:pt-[4vh] pb-16 sm:pb-24 lg:pb-[35vh]">
            {yearlyRhythmData.timeline.map((slot, i) => {
              const isActive = active === i;

              return (
                <div
                  key={slot.time}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => handleItemClick(i)}
                  className={`group cursor-pointer border-t border-white/10 transition-colors duration-500 py-10 sm:py-14 lg:py-20 xl:py-24 min-h-[30vh] sm:min-h-[36vh] lg:min-h-[44vh] flex flex-col justify-center ${i === yearlyRhythmData.timeline.length - 1
                      ? "border-b"
                      : ""
                    }`}
                >
                  {/* Time */}
                  <span
                    className={`font-mono text-xs sm:text-sm tracking-[2px] uppercase block mb-3 sm:mb-4 transition-colors duration-500 ${isActive
                        ? "text-white/60 font-medium"
                        : "text-white/20 group-hover:text-white/40"
                      }`}
                  >
                    {slot.time}
                  </span>

                  {/* Activity */}
                  <h3
                    className={`font-sans font-light uppercase text-xl sm:text-2xl lg:text-[clamp(1.75rem,2.2vw,36px)] xl:text-[38px] leading-[1.1] tracking-[-0.03em] transition-colors duration-500 ${isActive
                        ? "text-white"
                        : "text-white/25 group-hover:text-white/45"
                      }`}
                  >
                    {slot.activity}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    </section>
  );
}



// "use client";

// import Image from "next/image";
// import { Eyebrow, Panel } from "../ui/Primitives";
// import { ViewReveal } from "../animation";
// import { Heading } from "../utils/Heading";
// import { yearlyRhythmData } from "@/data/home/yearRythmData";

// export default function YearRythm() {
//   return (
//     <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-0">
//       <Panel
//         className="bg-ink text-white rounded-[30px] sm:rounded-[48px] lg:rounded-[57px] overflow-hidden"
//         innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
//       >
//         <ViewReveal duration={800}>
//           {/* Eyebrow Header */}
//           <Eyebrow dark={true}>{yearlyRhythmData.eyebrow}</Eyebrow>

//           {/* 2-Column Section Content */}
//           <div className="mt-8 sm:mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16">
//             {/* Left Column: Heading, Subtitle & Dining Image */}
//             <div className="flex flex-col">
//               <Heading
//                 title1={yearlyRhythmData.titleTop}
//                 title2={yearlyRhythmData.titleAccent}
//                 className="uppercase max-w-sm sm:max-w-md lg:max-w-none text-white"
//               />

//               <p className="mt-4 sm:mt-5 text-white/40 font-sans font-light text-[14px] sm:text-[16px] lg:text-[16px] leading-[1.6] max-w-lg">
//                 {yearlyRhythmData.body}
//               </p>

//               <div className="mt-6 sm:mt-8 relative aspect-[4/3] sm:aspect-[10/6] w-full overflow-hidden rounded-[16px] sm:rounded-[20px] bg-white/5">
//                 <Image
//                   src={yearlyRhythmData.timeline[0].image}
//                   alt={yearlyRhythmData.timeline[0].activity}
//                   fill
//                   sizes="(min-width: 1024px) 40vw, 100vw"
//                   className="object-cover transition-transform duration-700 ease-out hover:scale-105"
//                 />
//               </div>
//             </div>

//             {/* Right Column: Daily Rhythm Timeline */}
//             {/* <div className="lg:pt-10"> */}
//             <div className="lg:mt-auto">
//               {yearlyRhythmData.timeline.map((slot, index) => (
//                 <div
//                   key={slot.time}
//                   className={`flex items-baseline gap-3.5 sm:gap-6 py-3.5 sm:py-4.5 lg:py-5 border-b border-white/10 transition-colors duration-200 hover:bg-white/[0.03] ${index === 0 ? "border-t" : ""}`}
//                 >
//                   <span className="font-mono text-[12px] sm:text-[14px] uppercase tracking-[1.5px] text-white/40 w-[68px] sm:w-[82px] shrink-0 font-medium">
//                     {slot.time}
//                   </span>
//                   <p className="font-sans text-[12px] sm:text-[16px] lg:text-[28px] 3xl:text-[30px] text-white/90 font-light uppercase leading-snug">
//                     {slot.activity}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </ViewReveal>
//       </Panel>
//     </section>
//   );
// }
