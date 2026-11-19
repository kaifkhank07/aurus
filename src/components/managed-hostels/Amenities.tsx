
"use client";

import { managedAmenities } from "@/data/managed-hostels";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";
import {
  House,
  Sparkles,
  Wifi,
  Monitor,
  Utensils,
  Dumbbell,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const amenityIcons = [
  House,
  Sparkles,
  Wifi,
  Monitor,
  Utensils,
  Dumbbell,
  ShieldCheck,
  Smartphone,
];

export function Amenities() {
  return (
    <section id="amenities" className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        <Eyebrow>
          {managedAmenities.eyebrowLeft}
        </Eyebrow>

        {/* Amenities Divider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:border-t-0 sm:border-b border-line">
          {managedAmenities.items.map((item, index) => {
            const Icon = amenityIcons[index];

            const isLastColumnTablet = (index + 1) % 2 === 0;
            const isLastColumnDesktop = (index + 1) % 4 === 0;
            const isFirstRowDesktop = index < 4;

            return (
              <ViewReveal
                key={item.id}
                duration={600}
                startDelay={index * 50}
              >
                <div
                  className={[
                    "h-full min-w-0 flex flex-col py-6 sm:py-7 lg:py-8",
                    "border-t border-line lg:border-t-0",
                    "sm:px-5 lg:px-6",
                    !isLastColumnTablet
                      ? "sm:border-r sm:border-line"
                      : "sm:border-r-0",
                    !isLastColumnDesktop
                      ? "lg:border-r lg:border-line"
                      : "lg:border-r-0",
                    isFirstRowDesktop
                      ? "lg:border-b lg:border-line"
                      : "",
                    index % 2 === 0 ? "sm:pl-0" : "",
                    index % 4 === 0 ? "lg:pl-0" : "",
                    isLastColumnDesktop ? "lg:pr-0" : "",
                  ].join(" ")}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted">
                    <Icon size={15} strokeWidth={1.4} />
                  </div>

                  {/* Title */}
                  <h4 className="font-sans font-medium text-[17px] sm:text-[19px] text-ink mt-3 tracking-tight">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="font-sans font-normal text-[13px] sm:text-[14px] text-muted leading-relaxed mt-2 max-w-sm">
                    {item.description}
                  </p>
                </div>
              </ViewReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
