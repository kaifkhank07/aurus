"use client";

import Image from "next/image";
import { lifePageData } from "@/data";
import { Container, Eyebrow } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

export default function CafeAndApp() {
  const { cafeAndApp } = lifePageData;
  const { cafe, app } = cafeAndApp;

  return (
    <section className="py-8 sm:py-12 lg:py-20">
      <Container className="space-y-16 sm:space-y-20 lg:space-y-24">
        {/* Block 1: In-House Cafe (Image Left, Text Right) */}
        <ViewReveal duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Cafe Image */}
            <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 w-full">
              <div className="relative aspect-[16/10] sm:aspect-[16/12] w-full overflow-hidden rounded-[18px] sm:rounded-[10px] bg-ink/5 border border-ink/10 shadow-sm group">
                <Image
                  src={cafe.image.src}
                  alt={cafe.image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: Cafe Copy */}
            <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              <Eyebrow rule={false}>{cafe.eyebrow}</Eyebrow>

              <div className="mt-4 sm:mt-5">
                <Heading
                  title1={cafe.titleTop}
                  title2={cafe.titleAccent}
                  className="uppercase"
                />

                <p className="mt-4 sm:mt-5 font-sans font-light text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.6] text-muted max-w-lg">
                  {cafe.body}
                </p>
              </div>
            </div>
          </div>
        </ViewReveal>

        {/* Block 2: Resident App (Text Left, Image Right) */}
        <ViewReveal duration={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: App Copy & Bullet Points */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              <Eyebrow rule={false}>{app.eyebrow}</Eyebrow>

              <div className="mt-4 sm:mt-5">
                <Heading
                  title1={app.titleTop}
                  title2={app.titleAccent}
                  className="uppercase"
                />

                <p className="mt-4 sm:mt-5 font-sans font-light text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.6] text-muted max-w-lg">
                  {app.body}
                </p>

                {/* Bullets List */}
                <ul className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3 font-sans font-light text-[13.5px] sm:text-[15px] lg:text-[16px] text-ink/85">
                  {app.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink/40 shrink-0" />
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: App / Lounge Image */}
            <div className="lg:col-span-6 xl:col-span-6 w-full">
              <div className="relative aspect-[16/10] sm:aspect-[16/12] w-full overflow-hidden rounded-[18px] sm:rounded-[10px] bg-ink/5 border border-ink/10 shadow-sm group">
                <Image
                  src={app.image.src}
                  alt={app.image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
