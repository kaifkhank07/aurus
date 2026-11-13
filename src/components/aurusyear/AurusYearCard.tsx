import React from "react";
import Image from "next/image";
import { IAurusYearEvent } from "@/data/aurusyear";

interface AurusYearCardProps {
  event: IAurusYearEvent;
}

export function AurusYearCard({ event }: AurusYearCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-[22px] sm:rounded-[26px] border border-[#E7E2D8] bg-white transition-all duration-300 hover:border-[#D8D2C6]">
      {/* Top Media & Content */}
      <div className="flex flex-col">
        {/* Image with Tag */}
        <div className="relative aspect-[16/10.5] w-full overflow-hidden rounded-t-[14px] sm:rounded-t-[18px] bg-neutral-100">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badge */}
          <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 shadow-sm backdrop-blur-md">
            <span className="block font-mono text-[9px] sm:text-[10px] font-medium tracking-[1.2px] uppercase text-ink">
              {event.badge}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 space-y-3">
          {/* Month & Index Header */}
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] uppercase text-[#77736B]">
              {event.month}
            </span>
            <span className="font-display italic text-[17px] sm:text-[19px] text-[#88847C]">
              {event.number}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#EBE7DF]" />

          {/* Title */}
          <h3 className="font-sans text-[15px] sm:text-[16.5px] font-medium uppercase tracking-[0.3px] text-ink leading-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p className="font-sans text-[12px] sm:text-[14px] font-regular leading-sung text-muted">
            {event.description}
          </p>

          {/* Optional Footnote And Divider */}
          {event.note && (
            <>
              <div className="h-px w-full bg-[#EBE7DF]" />

              <p className="flex items-start gap-1.5 font-sans text-[11px] sm:text-[13px] font-regular leading-sung text-ink">
                <span className="shrink-0">✦</span>
                {event.note}
              </p>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default AurusYearCard;

