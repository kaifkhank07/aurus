"use client";

import { propertyOverview } from "@/data/managed-hostels";
import { Container, Eyebrow, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";

export function PropertyOverview() {
  return (
    <section id="overview" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Section Header Eyebrow */}
        <Eyebrow
          right={
            <span className="font-mono text-muted text-[11px] sm:text-[12px] uppercase tracking-[2px]">
              {propertyOverview.eyebrowRight}
            </span>
          }
        >
          {propertyOverview.eyebrowLeft}
        </Eyebrow>

        {/* 2-Column Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column: Property Aerial Image */}
          <div className="h-full [&>div]:h-full">
            <ViewReveal duration={800}>
              <div className="relative h-full min-h-[300px] sm:min-h-[400px] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
                <Figure
                  src={propertyOverview.image}
                  alt="Aurus GIFT City Managed Residences Architecture"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </ViewReveal>
          </div>

          {/* Right Column: Heading, Description & Details List */}
          <div className="flex flex-col justify-start space-y-3 sm:space-y-6 lg:space-y-12">
            <Heading
              title1={propertyOverview.titleTop}
              title2={propertyOverview.titleAccent}
              className="uppercase"
            />

            <p className="font-sans font-normal text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.5] text-muted max-w-md">
              {propertyOverview.description}
            </p>

            <div className="h-px w-full bg-line" aria-hidden="true" />

            {/* Specifications List */}
            <dl className="space-y-3.5 sm:space-y-5 lg:pb-16">
              {propertyOverview.features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
                >
                  <dt className="font-mono text-[13px] sm:text-[14.5px] tracking-[1.5px] text-muted/90 uppercase w-[110px] sm:w-[130px] shrink-0">
                    {feature.label}
                  </dt>
                  <dd className="font-sans text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.5] text-ink font-normal">
                    {feature.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
