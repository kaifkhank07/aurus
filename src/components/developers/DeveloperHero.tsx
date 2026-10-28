"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { developersData } from "@/data/developers";


export function DeveloperHero() {
  const { hero } = developersData;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Hero Title & Subtitle */}
        <div>
          <Heading
            as="h1"
            title1={hero.titleTop}
            title2={hero.titleAccent}
            className="uppercase max-w-lg sm:max-w-4xl lg:max-w-5xl"
          />

          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[64ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {hero.body}
          </p>
        </div>

        {/* Action Pills */}
        <ViewReveal duration={700} startDelay={100} className="mt-6 sm:mt-8">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
            {hero.actions.map((action, idx) => {
              const isSolid = action.variant === "solid";
              return (
                <Link
                  key={idx}
                  href={action.href}
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

        {/* Hero Large Image */}
        <ViewReveal duration={900} startDelay={200} className="mt-8 sm:mt-10 lg:mt-12">
          <div className="relative aspect-[16/10] sm:aspect-[16/8.5] lg:aspect-[2.1/1] w-full overflow-hidden rounded-[20px] sm:rounded-[32px] lg:rounded-[44px] bg-ink/5 shadow-md">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1920px) 1800px, 100vw"
              className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.015]"
            />
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default DeveloperHero;
