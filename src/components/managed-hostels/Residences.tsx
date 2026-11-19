
"use client";

import { useState } from "react";
import { managedResidences } from "@/data/managed-hostels";
import { Container, Eyebrow, ArrowRight, PillButton } from "@/components/ui/Primitives";
import EnquiryModal from "../shared/EnquiryModal";
import { Dot } from "lucide-react";

export function Residences() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedResidenceTitle, setSelectedResidenceTitle] = useState("");

  const handleEnquire = (title: string) => {
    setSelectedResidenceTitle(`Aurus GIFT City - ${title}`);
    setIsEnquiryOpen(true);
  };

  return (
    <>
      <section id="living" className="py-8 sm:py-12 lg:py-16">
        <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
          <Eyebrow
            right={
              <span className="font-mono text-muted text-[11px] sm:text-[12px] uppercase tracking-[2px]">
                {managedResidences.eyebrowRight}
              </span>
            }
          >
            {managedResidences.eyebrowLeft}
          </Eyebrow>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
            {managedResidences.types.map((type) => (
              <div
                key={type.title}
                className="rounded-[12px] sm:rounded-[14px] bg-[#FAF9F6] p-5 sm:p-6 lg:p-7 border border-line flex flex-col shadow-2xs space-y-3 sm:space-y-4"
              >
                <div className="flex items-center gap-1.5">
                  <Dot className="text-[#D6B86D]" strokeWidth={5} size={24} />
                  {/* <span className="h-[4px] w-[4px] rounded-full bg-[#D6B86D]" /> */}
                  <span className="font-mono text-[10px] sm:text-[12px] tracking-[1.5px] uppercase text-muted">
                    {type.tag}
                  </span>
                </div>

                <h3 className="text-[28px] sm:text-[36px] font-sans font-light tracking-tight text-ink uppercase">
                  {type.title}
                </h3>

                <p className="text-[11px] sm:text-[15px] text-muted leading-relaxed font-normal">
                  {type.subtitle}
                </p>

                <div className="h-px w-full bg-line" />

                <dl className="space-y-2">
                  {type.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid grid-cols-[64px_1fr] sm:grid-cols-[76px_1fr] gap-3 items-baseline"
                    >
                      <dt className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] text-muted uppercase">
                        {spec.label}
                      </dt>

                      <dd className="font-sans text-[11px] sm:text-[16px] text-ink leading-relaxed font-light">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleEnquire(type.title)}
                    className="font-mono uppercase text-[11px] sm:text-[13px] tracking-[2px] flex h-[36px] sm:h-[42px] w-full sm:w-fit px-6 lg:px-3.5 items-center justify-center gap-2.5 rounded-full border border-ink bg-ink text-paper hover:bg-neutral-800 transition-all duration-300 outline-none active:scale-[0.99] cursor-pointer"
                  >
                    <span>{type.ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialCity="Ahmedabad"
      />
    </>
  );
}


// "use client";

// import { useState } from "react";
// import { managedResidences } from "@/data/managed-hostels";
// import { Container, Eyebrow, ArrowRight } from "@/components/ui/Primitives";
// import EnquiryModal from "../shared/EnquiryModal";

// export function Residences() {
//   const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
//   const [selectedResidenceTitle, setSelectedResidenceTitle] = useState("");

//   const handleEnquire = (title: string) => {
//     setSelectedResidenceTitle(`Aurus GIFT City - ${title}`);
//     setIsEnquiryOpen(true);
//   };

//   return (
//     <>
//       <section id="living" className="py-8 sm:py-12 lg:py-16">
//         <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
//           {/* Eyebrow Header */}
//           <Eyebrow
//             right={
//               <span className="font-mono text-muted text-[11px] sm:text-[12px] uppercase tracking-[2px]">
//                 {managedResidences.eyebrowRight}
//               </span>
//             }
//           >
//             {managedResidences.eyebrowLeft}
//           </Eyebrow>

//           {/* 2-Column Residence Cards Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
//             {managedResidences.types.map((type, index) => (
//               <div
//                 key={index}
//                 className="rounded-[12px] sm:rounded-[16px] bg-[#FAF9F6] p-6 sm:p-8 lg:p-10 border border-line flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow duration-300"
//               >
//                 <div>
//                   <span className="font-mono text-[10.5px] sm:text-[11.5px] tracking-[2px] uppercase text-muted block">
//                     {type.tag}
//                   </span>

//                   <h3 className="text-[22px] sm:text-[28px] lg:text-[32px] font-sans font-light tracking-tight text-ink uppercase mt-2.5">
//                     {type.title}
//                   </h3>

//                   <p className="text-[13px] sm:text-[14.5px] text-muted mt-2 leading-relaxed font-normal">
//                     {type.subtitle}
//                   </p>

//                   <div className="my-5 sm:my-6 h-px w-full bg-line" aria-hidden="true" />

//                   {/* Specifications Table */}
//                   <dl className="space-y-3">
//                     {type.specs.map((spec) => (
//                       <div
//                         key={spec.label}
//                         className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1.5 border-b border-line/60 last:border-b-0"
//                       >
//                         <dt className="font-mono text-[10.5px] sm:text-[11px] tracking-[1.5px] text-muted uppercase w-[100px] shrink-0">
//                           {spec.label}
//                         </dt>
//                         <dd className="font-sans text-[12.5px] sm:text-[13.5px] text-ink leading-relaxed font-normal">
//                           {spec.value}
//                         </dd>
//                       </div>
//                     ))}
//                   </dl>
//                 </div>

//                 {/* Bottom CTA Button */}
//                 <div className="mt-8 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => handleEnquire(type.title)}
//                     className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] inline-flex h-[44px] sm:h-[48px] w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-ink text-paper px-7 transition-all duration-300 hover:bg-neutral-800 active:scale-[0.99] cursor-pointer"
//                   >
//                     <span>{type.ctaLabel}</span>
//                     <ArrowRight className="h-3.5 w-3.5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* Enquiry Modal */}
//       <EnquiryModal
//         isOpen={isEnquiryOpen}
//         onClose={() => setIsEnquiryOpen(false)}
//         initialCity="Ahmedabad"
//       />
//     </>
//   );
// }
