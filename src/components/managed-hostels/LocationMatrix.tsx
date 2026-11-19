"use client";

import Link from "next/link";
import { managedLocation } from "@/data/managed-hostels";
import { Container, Eyebrow, ArrowRight } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";

export function LocationMatrix() {
  return (
    <section id="location" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Eyebrow Header */}
        <Eyebrow
          right={
            <Link
              href={managedLocation.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-muted hover:text-neutral-600 transition-colors text-[11px] sm:text-[12px] uppercase tracking-[2px] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{managedLocation.eyebrowRight}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {managedLocation.eyebrowLeft}
        </Eyebrow>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-start">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-6 xl:col-span-6">
            <Heading
              title1={managedLocation.titleTop}
              title2={managedLocation.titleAccent}
              className="uppercase tracking-tight"
            />

            <p className="mt-4 sm:mt-6 font-sans font-normal text-[14px] sm:text-[16px] lg:text-[17px] leading-[1.5] text-muted max-w-md">
              {managedLocation.description}
            </p>
          </div>

          {/* Right Column: Travel Distances Matrix */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-start">
            <ViewReveal duration={700}>
              <div className="divide-y divide-line/80 border-t border-b border-line/80">
                {managedLocation.destinations.map((item) => (
                  <div
                    key={item.destination}
                    className="py-4 sm:py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-sans font-light text-[15px] sm:text-[17px] lg:text-[20px] text-ink">
                      {item.destination}
                    </span>

                    <span className="font-mono text-[10.5px] sm:text-[12px] uppercase tracking-[1.5px] text-muted whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </ViewReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
