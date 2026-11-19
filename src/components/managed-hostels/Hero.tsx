
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { managedHero } from "@/data/managed-hostels";
import { Figure, ArrowRight } from "@/components/ui/Primitives";
import { HeroHeading } from "../utils/HeroHeading";
import { useScrollNavigation } from "../utils/Scroll";
import ScheduleVisitModal from "../shared/ScheduleVisitModal";
import EnquiryModal from "../shared/EnquiryModal";
import { componyInfoData } from "@/data";

export function Hero() {
  const mobileImageRef = useRef<HTMLImageElement>(null);
  const desktopImageRef = useRef<HTMLImageElement>(null);
  const { handleScroll } = useScrollNavigation();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (desktopImageRef.current) {
        gsap.fromTo(
          desktopImageRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 2, ease: "power2.out" }
        );
      }
    });

    mm.add("(max-width: 1023px)", () => {
      if (mobileImageRef.current) {
        gsap.fromTo(
          mobileImageRef.current,
          { scale: 1.12, transformOrigin: "center center" },
          { scale: 1, duration: 2, ease: "power2.out" }
        );
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      {/* Mobile & Tablet Hero (< lg breakpoint) */}
      {/* <div className="flex h-[calc(100svh-64px)] w-full flex-col overflow-hidden bg-cream sm:h-[calc(100svh-68px)] lg:hidden"> */}
      <div className="flex min-h-[calc(100svh-64px)] w-full flex-col bg-cream sm:min-h-[calc(100svh-68px)] lg:hidden">
        <section className="mx-auto flex min-h-0 w-full flex-1 flex-col justify-start px-4 pb-5 pt-4 sm:px-6 sm:pb-7 sm:pt-4">
          {/* Rounded Image Card */}
          <div className="relative isolate flex min-h-[260px] max-h-[46vh] w-full flex-1 flex-col justify-between overflow-hidden rounded-[24px] p-5 text-white shadow-sm sm:max-h-[50vh] sm:rounded-[34px] sm:p-8">
            <Figure
              imageRef={mobileImageRef}
              src={managedHero.image}
              alt="Aurus managed residences in GIFT City Gandhinagar"
              priority
              quiet
              sizes="(max-width: 640px) 100vw, 640px"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />

            {/* Gradient Overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-black/35"
            />

            {/* Top Eyebrow */}
            <p className="font-mono text-[11px] uppercase leading-[1.7857] tracking-[1.8px] text-white/90 sm:text-[12px]">
              {managedHero.eyebrow}
            </p>

            {/* Bottom Heading */}
            <div className="mt-auto">
              <HeroHeading
                as="h1"
                animate={true}
                className="font-sans text-[32px] font-light leading-[1.08] tracking-[-0.04em] text-white sm:text-[46px]"
              >
                <span className="block">{managedHero.titleLine1}</span>
                <span className="mt-1 block">
                  {managedHero.titleLine2Prefix}{" "}
                  <span className="font-display font-normal italic normal-case">
                    {managedHero.titleAccent}
                  </span>
                </span>
              </HeroHeading>
            </div>
          </div>

          {/* Text Details Below Image */}
          <div className="mt-4 shrink-0 space-y-4 px-1 sm:mt-6">
            {/* Body Description */}
            <p className="font-sans text-[14px] font-normal leading-[1.4] tracking-[-0.015em] text-ink sm:text-[17px] sm:leading-[1.45]">
              {managedHero.body}
            </p>

            {/* Stacked Action Buttons */}
            <div className="flex w-full flex-col gap-2.5 sm:gap-3.5">
              <button
                type="button"
                onClick={(e) => handleScroll(e, "#living")}
                className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-ink bg-ink font-mono text-[12px] uppercase tracking-[2px] text-paper outline-none transition-all duration-300 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.99] sm:h-[50px] sm:text-[13px]"
              >
                <span>View Residences</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-ink bg-transparent font-mono text-[12px] uppercase tracking-[2px] text-ink outline-none transition-all duration-300 hover:bg-ink hover:text-paper focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.99] sm:h-[50px] sm:text-[13px]"
              >
                <span>Schedule A Visit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Mobile Key Details Card */}
            <div className="rounded-[22px] border border-white/15 bg-black/85 p-5 text-white shadow-2xl backdrop-blur-md sm:p-6">
              <span className="mb-3.5 block text-[12px] uppercase tracking-[2px] text-[#D6B86D]">
                {managedHero.keyDetailsTitle}
              </span>

              <div className="grid grid-cols-[0.85fr_1.5fr] items-center gap-x-4 gap-y-3">
                {managedHero.keyDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="col-span-2 grid grid-cols-subgrid items-center"
                  >
                    <p className="text-[11px] uppercase tracking-[1.5px] text-white/60">
                      {detail.label}
                    </p>

                    <p className="whitespace-nowrap font-sans text-[13px] tracking-[1.5px] text-white">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Desktop Hero (>= lg breakpoint) */}
      <section className="mx-auto hidden h-[calc(100svh-84px)] min-h-0 w-full max-w-[1920px] overflow-hidden p-3 sm:p-4 lg:block lg:py-[1.6667vw]">
        <div className="relative isolate h-full min-h-0 w-full overflow-hidden rounded-panel">
          <Figure
            imageRef={desktopImageRef}
            src={managedHero.image}
            alt="Aurus managed residences in GIFT City Gandhinagar"
            priority
            quiet
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />

          <div className="relative flex h-full min-h-0 flex-col justify-center px-6 text-white sm:px-10 lg:px-[min(4.5833vw,88px)]">
            {/* Eyebrow */}
            <p className="font-mono text-[clamp(11px,0.7292vw,14px)] uppercase leading-[1.7857] tracking-[2px] text-white opacity-85">
              {managedHero.eyebrow}
            </p>

            {/* Heading */}
            <HeroHeading
              as="h1"
              animate={true}
              className="mt-[clamp(16px,3.5vh,min(6.7vw,120px))] max-w-[22ch] font-sans text-[clamp(2.75rem,7.2vw,140px)] font-light leading-[0.92] tracking-[-0.04em]"
            >
              <span className="block">{managedHero.titleLine1}</span>
              <span className="mt-1 block">
                {managedHero.titleLine2Prefix}{" "}
                <span className="font-display font-normal italic normal-case">
                  {managedHero.titleAccent}
                </span>
              </span>
            </HeroHeading>

            {/* Description */}
            <p className="mt-[clamp(14px,2.2vh,min(2.4vw,44px))] max-w-xs font-light text-xs leading-relaxed opacity-90 sm:text-sm lg:max-w-sm lg:text-base xl:text-lg">
              {managedHero.body}
            </p>

            {/* Action Buttons */}
            <div className="mt-[clamp(16px,2.8vh,min(2.6vw,46px))] flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex h-[min(2.2917vw,44px)] min-h-[40px] cursor-pointer items-center gap-2.5 rounded-full border border-white bg-white px-[min(1.4583vw,28px)] font-mono text-[clamp(11px,0.7292vw,14px)] uppercase leading-[1.7857] tracking-[2px] text-ink outline-none transition-colors duration-300 hover:opacity-85"
              >
                <span>BOOK A VIEWING</span>
                <ArrowRight />
              </button>

              <button
                type="button"
                onClick={() => window.open(`https://wa.me/${componyInfoData.whatsapp}", "_blank`)}
                className="inline-flex h-[min(2.2917vw,44px)] min-h-[40px] cursor-pointer items-center gap-2.5 rounded-full border border-white/60 bg-transparent px-[min(1.4583vw,28px)] font-mono text-[clamp(11px,0.7292vw,14px)] uppercase leading-[1.7857] tracking-[2px] text-white outline-none transition-colors duration-300 hover:bg-white hover:text-ink"
              >
                <span>WHATSAPP US</span>
                <ArrowRight />
              </button>
            </div>

            {/* Desktop Key Details Card */}
            <div className="absolute bottom-6 right-6 z-10 w-[290px] rounded-[22px] border border-white/15 bg-black/85 p-5 text-white shadow-2xl backdrop-blur-md lg:bottom-[clamp(24px,4vh,48px)] lg:right-[min(4.5833vw,88px)] xl:w-[320px] sm:p-6">
              <span className="mb-3.5 block text-[12px] uppercase tracking-[2px] text-[#D6B86D]">
                {managedHero.keyDetailsTitle}
              </span>

              <div className="grid grid-cols-[0.85fr_1.5fr] items-center gap-x-4 gap-y-3">
                {managedHero.keyDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="col-span-2 grid grid-cols-subgrid items-center"
                  >
                    <p className="text-[11px] uppercase tracking-[1.5px] text-white/60">
                      {detail.label}
                    </p>
                    <p className="whitespace-nowrap font-sans text-[13px] tracking-[1.5px] text-white">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialCity="Ahmedabad"
        residenceLocation="GIFT City, Gandhinagar"
        residenceTitle="Aurus GIFT City Residences"
      />

      {/* General Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialCity="Ahmedabad"
      />
    </>
  );
}



// "use client";

// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { managedHero } from "@/data/managed-hostels";
// import { Figure, ArrowRight } from "@/components/ui/Primitives";
// import { Navbar } from "../layout/Navbar";
// import { Nav } from "../layout/Nav";
// import { HeroHeading } from "../utils/HeroHeading";
// import { useScrollNavigation } from "../utils/Scroll";
// import ScheduleVisitModal from "../shared/ScheduleVisitModal";
// import EnquiryModal from "../shared/EnquiryModal";

// export function Hero() {
//   const mobileImageRef = useRef<HTMLImageElement>(null);
//   const desktopImageRef = useRef<HTMLImageElement>(null);
//   const { handleScroll } = useScrollNavigation();

//   const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
//   const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

//   useEffect(() => {
//     const prefersReducedMotion =
//       typeof window !== "undefined" &&
//       window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     if (prefersReducedMotion) return;

//     const mm = gsap.matchMedia();

//     // Desktop Hero (>= 1024px): background image smooth zoom-in
//     mm.add("(min-width: 1024px)", () => {
//       if (desktopImageRef.current) {
//         gsap.fromTo(
//           desktopImageRef.current,
//           { scale: 1.12, transformOrigin: "center center" },
//           { scale: 1, duration: 2.0, ease: "power2.out" }
//         );
//       }
//     });

//     // Mobile & Tablet Hero (< 1024px): background image smooth zoom-in
//     mm.add("(max-width: 1023px)", () => {
//       if (mobileImageRef.current) {
//         gsap.fromTo(
//           mobileImageRef.current,
//           { scale: 1.12, transformOrigin: "center center" },
//           { scale: 1, duration: 2.0, ease: "power2.out" }
//         );
//       }
//     });

//     return () => {
//       mm.revert();
//     };
//   }, []);

//   return (
//     <>
//       {/* Mobile & Tablet Hero (< lg breakpoint) */}
//       <div className="block lg:hidden w-full bg-cream min-h-[90svh] flex flex-col">
//         {/* Top Navbar for Mobile/Tablet */}
//         {/* <Navbar variant="light" /> */}

//         {/* Hero Content Container */}
//         <section className="mx-auto w-full flex-1 flex flex-col justify-start px-4 pt-4 pb-6 sm:px-6 sm:pt-4 sm:pb-8">
//           {/* Rounded Card Container with Image & Overlaid Typography */}
//           <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[34px] w-full p-5 sm:p-8 text-white shadow-sm flex-1 min-h-[320px] max-h-[52vh] sm:max-h-[56vh]">
//             <Figure
//               imageRef={mobileImageRef}
//               src={managedHero.image}
//               alt="Aurus managed residences in GIFT City Gandhinagar"
//               priority
//               quiet
//               sizes="(max-width: 640px) 100vw, 640px"
//               className="absolute inset-0 -z-10 h-full w-full object-cover"
//             />

//             {/* Gradient Overlay for Legibility */}
//             {/* <div
//               aria-hidden="true"
//               className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/30"
//             /> */}

//             {/* Top Eyebrow */}
//             <p className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] text-white/90">
//               {managedHero.eyebrow}
//             </p>

//             {/* Bottom Heading */}
//             <div className="mt-auto">
//               <HeroHeading
//                 as="h1"
//                 animate={true}
//                 className="font-sans font-light tracking-[-0.04em] text-[34px] sm:text-[48px] leading-[1.05] text-white"
//               >
//                 <span className="block">{managedHero.titleLine1}</span>
//                 <span className="block mt-1">
//                   {managedHero.titleLine2Prefix}{" "}
//                   <span className="font-display italic font-normal normal-case">
//                     {managedHero.titleAccent}
//                   </span>
//                 </span>
//               </HeroHeading>
//             </div>
//           </div>

//           {/* Text Details Below Image */}
//           <div className="mt-4 sm:mt-6 px-1 shrink-0 space-y-4">
//             <p className="font-sans text-[14px] sm:text-[17px] leading-[1.4] sm:leading-[1.45] tracking-[-0.015em] text-ink font-normal">
//               {managedHero.body}
//             </p>

//             {/* Stacked Action Buttons */}
//             <div className="flex flex-col gap-2.5 sm:gap-3.5 w-full">
//               <button
//                 type="button"
//                 onClick={(e) => handleScroll(e, "#living")}
//                 className="font-mono uppercase text-[12px] sm:text-[13px] tracking-[2px] flex h-[46px] sm:h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-ink bg-ink text-paper hover:bg-neutral-800 transition-all duration-300 outline-none active:scale-[0.99] cursor-pointer"
//               >
//                 <span>View Residences</span>
//                 <ArrowRight className="h-3.5 w-3.5" />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setIsScheduleModalOpen(true)}
//                 className="font-mono uppercase text-[12px] sm:text-[13px] tracking-[2px] flex h-[46px] sm:h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper transition-all duration-300 outline-none active:scale-[0.99] cursor-pointer"
//               >
//                 <span>Schedule A Visit</span>
//                 <ArrowRight className="h-3.5 w-3.5" />
//               </button>
//             </div>

//             {/* Mobile Key Details Card */}
//             <div className="rounded-[20px] bg-neutral-900 p-5 text-white shadow-md border border-neutral-800 mt-4">
//               <span className="text-[12px] tracking-[2px] uppercase text-[#D6B86D] block mb-3.5">
//                 {managedHero.keyDetailsTitle}
//               </span>

//               <div className="space-y-2 text-xs">
//                 {managedHero.keyDetails.map((detail) => (
//                   <div
//                     key={detail.label}
//                     className="flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-b-0"
//                   >
//                     <span className="text-[11px] tracking-[1.5px] uppercase text-white/60">
//                       {detail.label}
//                     </span>

//                     <span className="font-sans text-white text-[13px] tracking-[1.5px]">
//                       {detail.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Desktop Hero (>= lg breakpoint) */}
//       <section className="hidden lg:block mx-auto w-full max-w-[1920px] overflow-hidden p-3 sm:p-4 lg:py-[1.6667vw] lg:h-[100svh]">
//         <div className="rounded-panel overflow-hidden relative isolate h-full w-full min-h-0">
//           <Figure
//             imageRef={desktopImageRef}
//             src={managedHero.image}
//             alt="Aurus managed residences in GIFT City Gandhinagar"
//             priority
//             quiet
//             sizes="100vw"
//             className="absolute inset-0 -z-10 h-full w-full object-cover"
//           />

//           {/* Gradient Overlay for Text & Key Details Readability */}
//           {/* <div
//             aria-hidden="true"
//             className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent"
//           /> */}

//           {/* <Nav /> */}

//           {/* Main Hero Container */}
//           <div className="relative flex h-full flex-col justify-center px-6 text-white sm:px-10 lg:px-[min(4.5833vw,88px)] pt-[clamp(70px,9vh,120px)] pb-[clamp(24px,4vh,48px)]">
//             <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-white opacity-85">
//               {managedHero.eyebrow}
//             </p>

//             <HeroHeading
//               as="h1"
//               animate={true}
//               className="font-sans font-light text-[clamp(2.75rem,7.2vw,140px)] leading-[0.92] tracking-[-0.04em] mt-[clamp(16px,3.5vh,min(6.7vw,120px))] max-w-[22ch]"
//             >
//               <span className="block">{managedHero.titleLine1}</span>
//               <span className="block mt-1">
//                 {managedHero.titleLine2Prefix}{" "}
//                 <span className="font-display italic font-normal normal-case">
//                   {managedHero.titleAccent}
//                 </span>
//               </span>
//             </HeroHeading>

//             <p className="mt-[clamp(14px,2.2vh,min(2.4vw,44px))] max-w-xs lg:max-w-sm font-light text-xs sm:text-sm lg:text-base xl:text-lg leading-relaxed opacity-90">
//               {managedHero.body}
//             </p>

//             <div className="mt-[clamp(16px,2.8vh,min(2.6vw,46px))] flex flex-wrap gap-4">
//               <button
//                 type="button"
//                 onClick={(e) => handleScroll(e, "#living")}
//                 className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex h-[min(2.2917vw,44px)] min-h-[40px] items-center gap-2.5 rounded-full border border-white bg-white text-ink px-[min(1.4583vw,28px)] transition-colors duration-300 outline-none hover:opacity-85 cursor-pointer"
//               >
//                 <span>View Residences</span>
//                 <ArrowRight />
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setIsScheduleModalOpen(true)}
//                 className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex h-[min(2.2917vw,44px)] min-h-[40px] items-center gap-2.5 rounded-full border border-white/60 bg-transparent text-white px-[min(1.4583vw,28px)] transition-colors duration-300 outline-none hover:bg-white hover:text-ink cursor-pointer"
//               >
//                 <span>Schedule A Visit</span>
//                 <ArrowRight />
//               </button>
//             </div>

//             {/* Desktop Key Details Floating Card on Bottom-Right */}
//             <div className="absolute right-6 bottom-6 lg:right-[min(4.5833vw,88px)] lg:bottom-[clamp(24px,4vh,48px)] z-10 w-[290px] xl:w-[320px] rounded-[22px] bg-black/85 backdrop-blur-md p-5 sm:p-6 text-white border border-white/15 shadow-2xl">
//               <span className="text-[12px] tracking-[2px] uppercase text-[#D6B86D] block mb-3.5">
//                 {managedHero.keyDetailsTitle}
//               </span>

//               <div className="grid grid-cols-[0.85fr_1.5fr] gap-x-4 gap-y-3 items-center">
//                 {managedHero.keyDetails.map((detail, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-subgrid col-span-2 items-center"
//                   >
//                     <p className="text-[11px] tracking-[1.5px] uppercase text-white/60">
//                       {detail.label}
//                     </p>

//                     <p className="font-sans text-white text-[13px] tracking-[1.5px] whitespace-nowrap">
//                       {detail.value}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Schedule Visit Modal */}
//       <ScheduleVisitModal
//         isOpen={isScheduleModalOpen}
//         onClose={() => setIsScheduleModalOpen(false)}
//         initialCity="Ahmedabad"
//         residenceLocation="GIFT City, Gandhinagar"
//         residenceTitle="Aurus GIFT City Residences"
//       />

//       {/* General Enquiry Modal */}
//       <EnquiryModal
//         isOpen={isEnquiryModalOpen}
//         onClose={() => setIsEnquiryModalOpen(false)}
//         initialCity="Ahmedabad"
//       />
//     </>
//   );
// }
