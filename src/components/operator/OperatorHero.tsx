"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { operatorHeroData } from "@/data/operator/operatorHero";
import { useScrollNavigation } from "@/components/utils/Scroll";

export function OperatorHero() {
  const hero = operatorHeroData;
  const { handleScroll } = useScrollNavigation();

  return (
    <section className="pt-8 sm:pt-12 lg:pt-16 pb-4 sm:pb-6 lg:pb-8">
      <Container className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Hero Title & Subtitle */}
        <div>
          <Heading
            as="h1"
            title1={hero.titleTop}
            title2={hero.titleAccent}
            className="uppercase max-w-lg sm:max-w-3xl"
          />

          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[68ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {hero.body}
          </p>
        </div>

        {/* Action Pills */}
        <ViewReveal duration={700} startDelay={100}>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
            {hero.actions.map((action, idx) => {
              const isSolid = action.variant === "solid";
              return (
                <Link
                  key={idx}
                  href={action.href}
                  onClick={(e) => handleScroll(e, action.href)}
                  className={`inline-flex items-center justify-center h-[38px] sm:h-[42px] px-5 sm:px-6 rounded-full font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase transition-all duration-300 ${isSolid
                    ? "bg-ink text-white hover:bg-neutral-800 shadow-sm"
                    : "border border-ink/30 text-ink hover:bg-ink hover:text-white"
                    }`}
                >
                  {action.label}
                </Link>
              );
            })}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default OperatorHero;
