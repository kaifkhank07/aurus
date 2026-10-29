import { testimonial } from "@/data/shared";
import { Container } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";

export function Testimonial() {
  return (
    // <section className="pb-14 sm:pb-20 lg:pb-[min(12vw,230px)]">
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <ViewReveal duration={800}>
          <figure className="mx-auto flex min-h-[auto] lg:min-h-[min(37.81vw,726px)] max-w-[1690px] flex-col items-center justify-center rounded-[28px] sm:rounded-[36px] lg:rounded-[var(--radius-panel)] bg-cream-deep px-5 sm:px-12 lg:px-16 py-10 sm:py-14 lg:py-[min(4.2vw,80px)] text-center">
            <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-muted lg:text-ink">{testimonial.eyebrow}</p>
            <blockquote className="font-sans font-light normal-case text-ink mx-auto mt-5 sm:mt-7 lg:mt-[2.2vw] max-w-[28ch] text-[20px] sm:text-[24px] lg:font-sans lg:font-light lg:uppercase lg:text-[clamp(2.125rem,5.2083vw,100px)] lg:leading-[0.9] lg:tracking-[-0.04em] lg:text-ink lg:uppercase lg:!text-[clamp(1.6rem,3.02vw,58px)] leading-[1.3] lg:!leading-[1.15]">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="font-sans font-normal uppercase text-[18px] leading-[1.3889] tracking-[2px] mt-5 sm:mt-7 lg:mt-[1.9vw] text-muted lg:text-ink !text-[10px] sm:!text-[11px] lg:!text-[18px] tracking-[1.5px] lg:tracking-[2px] uppercase">
              {testimonial.attribution}
            </figcaption>
          </figure>
        </ViewReveal>
      </Container>
    </section>
  );
}
