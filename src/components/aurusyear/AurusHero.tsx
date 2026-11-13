
import React from "react";
import { Container } from "@/components/ui/Primitives";
import { aurusHeroData, AurusHeroData } from "@/data/aurusyear/aurusHero";
import { Heading } from "../utils/Heading";

export function AurusHero() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-6 lg:space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Right Stats Box */}
          <div className="">
            <Heading
              title1={aurusHeroData.titleTop}
              title2={aurusHeroData.titleAccent}
              className="uppercase max-w-[200px] sm:max-w-full"
            />

            <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[56ch] lg:max-w-[43ch] font-sans font-normal text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.4] tracking-[-0.03em] text-muted">
              {aurusHeroData.subtitle}
            </p>
          </div>

          {/* Right: Minimalist 3-Column Stats Container */}
          <div className="w-full sm:w-auto self-start lg:self-center">
            <div className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start divide-x divide-[#DDD8CE] rounded-[14px] sm:rounded-[18px] border border-[#DDD8CE] px-5 py-4 sm:px-7 sm:py-5">
              {aurusHeroData.stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col ${idx === 0
                    ? "pr-2 sm:pr-4 pl-1 sm:pl-2"
                    : idx === aurusHeroData.stats.length - 1
                      ? "pl-2 sm:pl-4 pr-1 sm:pr-2"
                      : "px-2 sm:px-4"
                    }`}
                >
                  <span className="font-sans text-[36px] sm:text-[44px] lg:text-[48px] font-light leading-none tracking-tight text-ink">
                    {stat.value}
                  </span>

                  <span className="mt-2.5 sm:mt-3 font-sans font-normal text-[11px] sm:text-[14px] leading-[1.3] uppercase tracking-[0.5px] text-ink max-w-[130px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AurusHero;



// import React from "react";
// import { Container } from "@/components/ui/Primitives";
// import { aurusHeroData, AurusHeroData } from "@/data/aurusyear/aurusHero";

// interface AurusHeroProps {
//   data?: AurusHeroData;
// }

// export function AurusHero({ data = aurusHeroData }: AurusHeroProps) {
//   const { titleTop, titleAccent, subtitle, stats } = data;

//   return (
//     <section className="pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8">
//       <Container>
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
//           {/* Left: Main Heading and Subtitle */}
//           <div className="max-w-2xl">
//             <h1 className="font-sans text-[clamp(2.6rem,5.2vw,78px)] font-light leading-none tracking-[-0.035em] text-ink">
//               {titleTop}{" "}
//               <span className="font-display italic font-normal tracking-normal text-ink">
//                 {titleAccent}
//               </span>
//             </h1>

//             <p className="mt-3.5 sm:mt-4 max-w-[480px] font-sans text-[13.5px] sm:text-[14.5px] lg:text-[15px] font-light leading-[1.55] text-[#77736B]">
//               {subtitle}
//             </p>
//           </div>

//           {/* Right: Minimalist 3-Column Stats Container */}
//           <div className="w-full sm:w-auto self-start lg:self-center">
//             <div className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start divide-x divide-[#DDD8CE] rounded-[14px] sm:rounded-[18px] border border-[#DDD8CE] px-5 py-4 sm:px-7 sm:py-5">
//               {stats.map((stat, idx) => (
//                 <div
//                   key={stat.label}
//                   className={`flex flex-col ${
//                     idx === 0
//                       ? "pr-4 sm:pr-6 pl-1 sm:pl-2"
//                       : idx === stats.length - 1
//                       ? "pl-4 sm:pl-6 pr-1 sm:pr-2"
//                       : "px-4 sm:px-6"
//                   }`}
//                 >
//                   <span className="font-sans text-[36px] sm:text-[44px] lg:text-[48px] font-light leading-none tracking-tight text-ink">
//                     {stat.value}
//                   </span>
//                   <span className="mt-2.5 sm:mt-3 font-mono text-[9px] sm:text-[10px] leading-[1.3] uppercase tracking-[0.5px] text-[#77736B] whitespace-pre-line">
//                     {stat.label}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// }

// export default AurusHero;
