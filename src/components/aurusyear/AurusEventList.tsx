"use client";

import React, { useState, useMemo } from "react";
import { Container } from "@/components/ui/Primitives";
import { aurusEventsData, AurusEventsData } from "@/data/aurusyear/aurusEvents";
import AurusYearCard from "./AurusYearCard";

interface AurusEventListProps {
  data?: AurusEventsData;
}

export function AurusEventList({ data = aurusEventsData }: AurusEventListProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (!selectedMonth) return data.events;
    return data.events.filter((e) => e.month === selectedMonth);
  }, [selectedMonth, data.events]);

  return (
    <section className="pb-8 sm:pb-12 lg:pb-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-10">
        {/* Timeline Filter Bar */}
        <div className="w-full border-b border-ink/10">
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="grid min-w-[760px] grid-flow-col auto-cols-fr">
              {data.timeline.map((item) => {
                const isSelected = selectedMonth === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedMonth(isSelected ? null : item.key)}
                    title={`Filter by ${item.label}`}
                    className={`group flex min-h-[38px] flex-col items-start justify-center border-r border-ink/10 px-2 text-left transition-colors duration-200 first:pl-1 last:border-r-0 sm:min-h-[42px] sm:px-3 ${isSelected ? "bg-ink/[0.04]" : "hover:bg-ink/[0.025]"
                      }`}
                  >
                    <span
                      className={`font-mono font-light text-[11px] sm:text-[14px] leading-[1.3] uppercase tracking-[0.8px] transition-colors sm:text-[9px] sm:tracking-[1px] ${isSelected ? "text-ink" : "text-muted group-hover:text-ink"
                        }`}
                    >
                      {item.label}
                    </span>

                    <span
                      className={`mt-3 font-sans font-regular text-[11px] sm:text-[14px] lg:text-[19px] leading-[1.3] transition-colors sm:text-[12px] ${isSelected ? "text-ink" : "text-ink/80"
                        }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {selectedMonth && (
          <div className="flex items-center justify-between pb-2">
            <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-[#77736B]">
              Showing: <strong className="text-ink">{selectedMonth}</strong> ({filteredEvents.length} {filteredEvents.length === 1 ? "Experience" : "Experiences"})
            </span>
            <button
              type="button"
              onClick={() => setSelectedMonth(null)}
              className="font-mono text-[11px] uppercase tracking-[1.5px] text-ink/70 hover:text-ink underline underline-offset-4 cursor-pointer"
            >
              Show All
            </button>
          </div>
        )}

        {/* 3-Column Experience Grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#DDD7CD] p-8 text-center">
            <p className="font-sans text-[15px] text-[#77736B]">
              No experiences found for this selection.
            </p>
            <button
              type="button"
              onClick={() => setSelectedMonth(null)}
              className="mt-4 font-mono text-[11px] uppercase tracking-[1.5px] text-ink underline underline-offset-4 hover:opacity-75 cursor-pointer"
            >
              View All Experiences
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {/* {filteredEvents.map((event) => ( */}
            {filteredEvents.slice(0, -1).map((event) => (
              <AurusYearCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

// Support both naming variants as requested
export { AurusEventList as AuruEventList };
export default AurusEventList;
