import Link from "next/link";
import { intro } from "@/data/intro";
import { Container, Eyebrow } from "@/components/ui/Primitives";
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
        </div>
      </Container>
    </section>
  );
}
