import Link from "next/link";
import { journey } from "@/data/journey";
import { ArrowRight, Container } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";

export function Journey() {
  return (
    <section className="relative overflow-hidden pb-16 sm:pb-20 lg:pb-[min(6vw,115px)]">
      <Container className="relative text-center">
        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-muted lg:text-ink">{journey.eyebrow}</p>
        <Heading
          title1={journey.titleTop}
          title2={journey.titleAccent}
          className="uppercase"
        />

        <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] mx-auto mt-4 sm:mt-5 lg:mt-[min(1.3vw,25px)] max-w-[380px] sm:max-w-[440px] lg:max-w-[529px] text-muted !text-[13.5px] sm:!text-[15px] lg:!text-[19px] !leading-[1.5] lg:!leading-[1.32]">
          {journey.body}
        </p>

        {/* Mobile: stacked full-width pill buttons */}
        <div className="mt-8 sm:mt-10 flex w-full max-w-[380px] sm:max-w-[420px] mx-auto flex-col gap-3 sm:gap-3.5 lg:hidden">
          {journey.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] flex h-[48px] sm:h-[52px] w-full items-center justify-center rounded-full border border-ink/35 text-ink tracking-[2px] text-[11px] sm:text-[12px] transition-colors duration-300 hover:bg-ink hover:text-cream"
            >
              <span className="inline-flex items-center gap-2">
                {action.label}
                <ArrowRight />
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop: circular buttons with ghost watermark background */}
        <div className="relative mt-[min(2.4vw,46px)] hidden lg:flex items-center justify-center">
          {/* Ghost wordmark behind the CTAs */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none text-center text-[22vw] leading-none font-light tracking-[-0.045em] text-ink/[0.06]"
          >
            {journey.watermark}
          </span>

          <div className="flex items-center gap-[min(2.7vw,52px)]">
            {journey.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] flex aspect-square w-[10.2vw] min-w-[120px] items-center justify-center rounded-full p-4 text-center leading-relaxed transition-colors duration-300 ${
                  action.solid
                    ? "bg-ink text-cream hover:bg-ink/85"
                    : "border border-ink/35 text-ink hover:bg-ink hover:text-cream"
                }`}
              >
                <span className="inline-flex items-center gap-1 px-3">
                  {action.label}
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

