import { chapter } from "@/data/student-residences";
import { Container, Eyebrow, Figure, PillButton } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";

export function ChapterBlock() {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <Eyebrow>{chapter.eyebrow}</Eyebrow>

        <div className="relative">
          {/* Watermark: desktop only */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-25 -right-6 -z-10 hidden select-none text-[15vw] leading-none tracking-[3px] font-semibold tracking-[-0.04em] text-ink/[0.06] uppercase lg:block"
          >
            {chapter.watermark}
          </span>

          {/* Heading and Body layout */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_min(21.198vw,407px)] lg:items-start lg:pr-[min(1.72vw,33px)] lg:gap-[2.4vw]">
            <Heading
              title1={chapter.titleTop + " " + chapter.titleBottom}
              title2={chapter.titleAccent}
              className="uppercase max-w-3xl 3xl:max-w-5xl"
            />

            <div className="lg:pt-2">
              <p className="font-sans font-normal text-[clamp(1rem,0.9896vw,19px)] leading-[1.3158] tracking-[-0.04em] text-muted">
                {chapter.body}
              </p>

              <PillButton href={chapter.cta.href} variant="dark" className="w-full flex justify-center lg:w-fit mt-4 sm: mt-6">
                {chapter.cta.label}
              </PillButton>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-2 lg:gap-[1.25vw">
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
