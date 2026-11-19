// "use client";

// import { useState, useRef, useEffect } from "react";
// import gsap from "gsap";
// import Link from "next/link";
// import { managedFaq } from "@/data/managed-hostels";
// import { Container, Eyebrow, ArrowRight } from "@/components/ui/Primitives";

// interface AccordionRowProps {
//   question: string;
//   answer: string;
//   isOpen: boolean;
//   onToggle: () => void;
//   isLast: boolean;
// }

// function AccordionRow({
//   question,
//   answer,
//   isOpen,
//   onToggle,
//   isLast,
// }: AccordionRowProps) {
//   const contentRef = useRef<HTMLDivElement>(null);
//   const plusRef = useRef<HTMLSpanElement>(null);
//   const isInitialMount = useRef(true);

//   useEffect(() => {
//     const el = contentRef.current;
//     const plus = plusRef.current;
//     if (!el) return;

//     if (isInitialMount.current) {
//       isInitialMount.current = false;

//       if (!isOpen) {
//         gsap.set(el, { height: 0, opacity: 0, display: "none" });
//       } else {
//         gsap.set(el, { height: "auto", opacity: 1, display: "block" });
//         if (plus) gsap.set(plus, { rotate: 45 });
//       }
//       return;
//     }

//     if (isOpen) {
//       gsap.killTweensOf(el);
//       gsap.set(el, { display: "block", overflow: "hidden" });

//       gsap.fromTo(
//         el,
//         { height: 0, opacity: 0 },
//         {
//           height: "auto",
//           opacity: 1,
//           duration: 0.38,
//           ease: "power2.out",
//           onComplete: () => {
//             gsap.set(el, { overflow: "visible" });
//           },
//         }
//       );

//       if (plus) {
//         gsap.to(plus, { rotate: 45, duration: 0.32, ease: "power2.out" });
//       }
//     } else {
//       gsap.killTweensOf(el);
//       gsap.set(el, { overflow: "hidden" });

//       gsap.to(el, {
//         height: 0,
//         opacity: 0,
//         duration: 0.32,
//         ease: "power2.inOut",
//         onComplete: () => {
//           gsap.set(el, { display: "none" });
//         },
//       });

//       if (plus) {
//         gsap.to(plus, { rotate: 0, duration: 0.32, ease: "power2.inOut" });
//       }
//     }
//   }, [isOpen]);

//   return (
//     <div className={!isLast ? "border-b border-ink/15" : ""}>
//       <button
//         type="button"
//         onClick={onToggle}
//         aria-expanded={isOpen}
//         className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group cursor-pointer"
//       >
//         <span className="font-sans font-light text-[15px] sm:text-[17px] lg:text-[19px] text-ink group-hover:text-neutral-700 transition-colors">
//           {question}
//         </span>

//         <span
//           ref={plusRef}
//           className="font-light text-[26px] sm:text-[30px] text-muted shrink-0 inline-block will-change-transform leading-none"
//         >
//           +
//         </span>
//       </button>

//       <div ref={contentRef} className="will-change-[height,opacity]">
//         <div className="pb-5 pt-1 pr-6 font-sans font-normal text-[13px] sm:text-[14.5px] lg:text-[16px] text-muted leading-relaxed">
//           <p>{answer}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function ManagedFaq() {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   const handleToggle = (index: number) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section id="faqs" className="py-8 sm:py-12 lg:py-16">
//       <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
//         <Eyebrow
//           right={
//             <Link
//               href="/faq"
//               className="font-mono text-muted hover:text-neutral-600 transition-colors text-[11px] sm:text-[12px] uppercase tracking-[2px] inline-flex items-center gap-1.5 cursor-pointer"
//             >
//               <span>{managedFaq.eyebrowRight}</span>
//               <ArrowRight className="h-3 w-3" />
//             </Link>
//           }
//         >
//           {managedFaq.eyebrowLeft}
//         </Eyebrow>

//         {/* Accordion Container */}
//         <div className="w-full max-w-5xl mx-auto space-y-10 sm:space-y-12">
//           <div className="border-y border-ink/15">
//             {managedFaq.faqs.map((faq, index) => (
//               <AccordionRow
//                 key={faq.id}
//                 question={faq.question}
//                 answer={faq.answer}
//                 isOpen={openIndex === index}
//                 onToggle={() => handleToggle(index)}
//                 isLast={index === managedFaq.faqs.length - 1}
//               />
//             ))}
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { managedFaq } from "@/data/managed-hostels";
import { Container, Eyebrow, ArrowRight } from "@/components/ui/Primitives";

interface AccordionRowProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function AccordionRow({
  question,
  answer,
  isOpen,
  onToggle,
  isLast,
}: AccordionRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLSpanElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const el = contentRef.current;
    const plus = plusRef.current;
    if (!el) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!isOpen) {
        gsap.set(el, { height: 0, opacity: 0, display: "none" });
      } else {
        gsap.set(el, { height: "auto", opacity: 1, display: "block" });
        if (plus) gsap.set(plus, { rotate: 45 });
      }
      return;
    }

    if (isOpen) {
      gsap.killTweensOf(el);
      gsap.set(el, { display: "block", overflow: "hidden" });
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.38,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(el, { overflow: "visible" });
          },
        }
      );
      if (plus) {
        gsap.to(plus, { rotate: 45, duration: 0.32, ease: "power2.out" });
      }
    } else {
      gsap.killTweensOf(el);
      gsap.set(el, { overflow: "hidden" });
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.32,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
      if (plus) {
        gsap.to(plus, { rotate: 0, duration: 0.32, ease: "power2.inOut" });
      }
    }
  }, [isOpen]);

  return (
    <div className={`transition-colors ${!isLast ? "border-b border-line" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group cursor-pointer"
      >
        <span className="font-sans font-light text-[15px] sm:text-[17px] lg:text-[19px] text-ink group-hover:text-neutral-700 transition-colors">
          {question}
        </span>
        <span
          ref={plusRef}
          className="font-light text-[26px] sm:text-[30px] text-muted shrink-0 inline-block will-change-transform leading-none"
        >
          +
        </span>
      </button>

      <div ref={contentRef} className="will-change-[height,opacity]">
        <div className="pb-5 pt-1 pr-6 font-sans font-normal text-[13px] sm:text-[14.5px] lg:text-[16px] text-muted leading-relaxed">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function ManagedFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow Header */}
        <Eyebrow
          right={
            <Link
              href="/faq"
              className="font-mono text-muted hover:text-neutral-600 transition-colors text-[11px] sm:text-[12px] uppercase tracking-[2px] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{managedFaq.eyebrowRight}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {managedFaq.eyebrowLeft}
        </Eyebrow>

        {/* Centered Accordion Container */}
        <div className="max-w-4xl mx-auto divide-y divide-line/70 border-t border-b border-line/70">
          {managedFaq.faqs.map((faq, index) => (
            <AccordionRow
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              isLast={index === managedFaq.faqs.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
