import Link from "next/link";
import Image from "next/image";
import { intro } from "@/data/intro";
import { landing } from "@/data/landing";
import { Container, Eyebrow, ArrowRight } from "@/components/ui/Primitives";
import NumberRoller from "../animation/NumberRoller";
import ViewReveal from "../animation/ViewReveal";

export function Intro() {
  return (
    // Figma: statement top 1149, stats row top 1616
    <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-[min(5.2vw,100px)] lg:pb-[min(7.5vw,144px)]">
      <Container>
        {/* Figma: Manrope 400 / 42px / 60px, full 1683px column */}
        <ViewReveal duration={800} startDelay={100}>
          <p className="font-sans font-normal text-[clamp(1.375rem,2.1875vw,42px)] leading-[1.4286] tracking-[-0.04em] max-w-[1683px]">{intro.statement}</p>
        </ViewReveal>

        {/* CTA Button: full-width on mobile/tablet, inline ghost button on desktop */}
        <Link
          href={intro.cta.href}
          className="mt-6 flex h-[48px] sm:h-[52px] w-full items-center justify-center border border-ink bg-transparent font-space-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase text-ink transition-colors duration-200 hover:bg-ink hover:text-paper lg:mt-[min(2.8vw,54px)] lg:inline-flex lg:h-[min(2.8125vw,54px)] lg:min-h-[46px] lg:w-fit lg:border-ink/30 lg:px-[min(1.5625vw,30px)] lg:hover:text-cream"
        >
          {intro.cta.label}
        </Link>

        <div className="mt-10 sm:mt-12 lg:mt-[min(5.9vw,113px)]">
          <Eyebrow>{intro.eyebrow}</Eyebrow>

          {/* Mobile & Tablet Stats (< lg): 2x2 Grid of rounded cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden mt-6 sm:mt-8">
            {intro.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[18px] bg-paper p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
              >
                <NumberRoller
                  value={stat.value}
                  className="font-sans text-[28px] sm:text-[34px] font-semibold text-ink tracking-[-0.03em] tabular-nums"
                />
                <span className="font-space-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted mt-3 block">
                  {stat.label === "Resident Support" ? "SUPPORT" : stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop Stats (>= lg): 4-column divider row */}
          <dl className="hidden lg:grid lg:grid-cols-4 mt-6 sm:mt-8 lg:mt-[min(2.4vw,46px)]">
            {intro.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-[2.4vw] ${i > 0 ? "border-l border-line" : ""}`}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <NumberRoller
                    value={stat.value}
                    className="font-sans font-normal uppercase text-[clamp(2.25rem,2.9167vw,56px)] leading-[1] tracking-[-0.04em] tabular-nums"
                  />
                  <span className="font-sans font-normal text-[14px] leading-[1.4286] tracking-[-0.04em] mt-3 block uppercase text-ink">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          {/* Residence Image Cards below stats */}
          {/* It is below code */}
        </div>
      </Container>
    </section>
  );
}


{
  //  <ViewReveal className="">
  //         <div className="mt-10 sm:mt-14 lg:mt-[min(4vw,70px)] grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-[min(1.5vw,28px)]">
  //           {landing.brands.map((brand) => (
  //             <Link
  //               key={brand.titleTop}
  //               href={brand.cta.href}
  //               className="group relative isolate flex flex-col justify-between overflow-hidden rounded-[24px] sm:rounded-[34px] lg:rounded-[40px] p-5 sm:p-8 lg:p-[min(2.5vw,48px)] h-[46vh] min-h-[260px] max-h-[46vh] sm:h-[50vh] sm:max-h-[50vh] lg:h-auto lg:min-h-[580px] lg:max-h-none text-white transition-shadow duration-300 hover:shadow-2xl"
  //             >
  //               <Image
  //                 src={brand.image}
  //                 alt={brand.alt}
  //                 fill
  //                 sizes="(min-width: 1024px) 50vw, 100vw"
  //                 className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
  //               />

  //               {/* Dark gradient overlay for text legibility */}
  //               <div
  //                 aria-hidden="true"
  //                 className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/25"
  //               />

  //               {/* Bottom Content Area */}
  //               <div className="mt-auto">
  //                 <p className="font-mono uppercase text-[10px] sm:text-[12px] tracking-[2px] text-white/80">
  //                   {brand.eyebrow.replace("·", "//").toUpperCase()}
  //                 </p>

  //                 <h3 className="font-sans font-light text-[24px] xs:text-[27px] sm:text-[34px] lg:text-[clamp(2rem,2.6vw,50px)] leading-[1.08] tracking-[-0.04em] text-white mt-1.5 sm:mt-3">
  //                   {brand.titleTop}
  //                   <br />
  //                   <span className="font-display italic font-normal tracking-[-0.03em] normal-case">
  //                     {brand.titleAccent}
  //                   </span>
  //                 </h3>

  //                 <p className="font-sans font-normal text-[11.5px] xs:text-[12px] sm:text-[14px] lg:text-[15px] leading-[1.35] sm:leading-[1.45] tracking-[-0.02em] text-white/85 mt-1.5 sm:mt-3 max-w-[480px] line-clamp-2 sm:line-clamp-none">
  //                   {brand.body}
  //                 </p>

  //                 <p className="font-mono text-[9.5px] xs:text-[10.5px] sm:text-[12px] lg:text-[13px] tracking-[0.5px] text-white/70 mt-1 sm:mt-2 truncate sm:overflow-visible">
  //                   {brand.cities}
  //                 </p>

  //                 <span className="font-mono uppercase text-[10px] sm:text-[12px] tracking-[2px] inline-flex items-center gap-2 rounded-full bg-white text-ink px-4 py-2 sm:px-6 sm:py-3 mt-3 sm:mt-5 transition-all duration-300 group-hover:bg-ink group-hover:text-paper">
  //                   {brand.cta.label}
  //                   <ArrowRight />
  //                 </span>
  //               </div>
  //             </Link>
  //           ))}
  //         </div>
  //       </ViewReveal>
}