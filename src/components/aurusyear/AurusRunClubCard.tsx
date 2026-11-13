import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Primitives";
import { aurusEventsData, IAurusEvent } from "@/data";

interface AurusRunClubCardProps {
  data?: IAurusEvent;
  runClub?: IAurusEvent;
}

export function AurusRunClubCard({
  data = aurusEventsData.events.find((event) => event.id === "the-aurus-run-club"),
  runClub: legacyRunClub,
}: AurusRunClubCardProps) {
  const item = legacyRunClub || data;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-10">
        <div className="group rounded-[22px] sm:rounded-[28px] border border-[#E7E2D8] bg-white transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 lg:gap-0 overflow-hidden">
          {/* Left Column: Image with Badge */}
          <div className="md:col-span-5 relative aspect-[16/10.5] sm:aspect-[16/10] w-full overflow-hidden bg-neutral-100">
            <Image
              src={item?.image || ""}
              alt={item?.title || ""}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Badge */}
            <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 shadow-sm backdrop-blur-md">
              <span className="block font-mono text-[9px] sm:text-[10px] font-medium tracking-[1.2px] uppercase text-ink">
                {item?.badge}
              </span>
            </div>
          </div>

          {/* Right Column: Info & Description */}
          <div className="md:col-span-7 flex flex-col justify-between p-3 sm:p-4 lg:p-6 space-y-3">
            {/* Header row: ONGOING and Divider */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] uppercase text-[#77736B]">
                  {item?.month}
                </span>
                <span className="font-display italic text-[17px] sm:text-[19px] text-[#88847C]">
                  {item?.number}
                </span>
              </div>

              <div className="h-px w-full bg-[#EBE7DF]" />

              {/* Title */}
              <h3 className="font-sans text-[15px] sm:text-[16.5px] font-medium uppercase tracking-[0.3px] text-ink leading-tight">
                {item?.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-[12px] sm:text-[14px] font-regular leading-sung text-muted">
                {item?.description}
              </p>
            </div>

            {/* Optional Footnote And Divider */}
            {item?.note && (
              <div className="space-y-3">
                <div className="h-px w-full bg-[#EBE7DF]" />

                <p className="flex items-start gap-1.5 font-sans text-[11px] sm:text-[13px] font-regular leading-sung text-ink">
                  <span className="shrink-0">✦</span>
                  {item.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AurusRunClubCard;
