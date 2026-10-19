import Link from "next/link";
import { chapter } from "@/data/chapter";
import { Container, Eyebrow, Figure, PillButton, ArrowRight } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";

export function ChapterBlock() {
  return (
    <section className="relative overflow-hidden pt-4 pb-14 sm:pb-20 lg:pt-0 lg:pb-[min(6vw,115px)]">
      <Container>
        <Eyebrow>{chapter.eyebrow}</Eyebrow>

        <div className="relative mt-6 sm:mt-8 lg:mt-[min(2.4vw,46px)]">
          {/* Watermark: desktop only */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-25 -right-6 -z-10 hidden select-none text-[16vw] leading-none tracking-[2px] font-semibold tracking-[-0.04em] text-ink/[0.06] uppercase lg:block"
          >
            {chapter.watermark}
          </span>

          {/* Heading and Body layout */}
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_min(21.198vw,407px)] lg:items-start lg:pr-[min(1.72vw,33px)] lg:gap-[2.4vw]">
            <Heading
              title1={chapter.titleTop + " " + chapter.titleBottom}
              title2={chapter.titleAccent}
              className="uppercase max-w-3xl"
            />

            <div className="lg:pt-2">
              <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] text-muted">{chapter.body}</p>
              <PillButton href={chapter.cta.href} variant="dark" className="mt-7">
                {chapter.cta.label}
              </PillButton>
            </div>
          </div>
        </div>

        {/* Group 27 Images: Vertically stacked on mobile/tablet, 2-column grid on desktop */}
        <div className="mt-8 flex flex-col gap-4 sm:gap-5 lg:mt-[min(2.4vw,46px)] lg:grid lg:grid-cols-2 lg:gap-[1.25vw]">
          {chapter.images.map((image) => (
            <ViewReveal duration={800} startDelay={100} key={image.alt}>
              <Figure
                src={image.src}
                alt={image.alt}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[16/11] sm:aspect-[16/10] lg:aspect-[830/572] w-full rounded-[20px] sm:rounded-[26px] lg:rounded-[var(--radius-media)]"
              />
            </ViewReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
