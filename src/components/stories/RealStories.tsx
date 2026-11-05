"use client";

import React, { useEffect } from "react";
import { realStoriesData } from "@/data";
import { useContentStore } from "@/store/useContentStore";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import NumberRoller from "../animation/NumberRoller";
import { Star } from "lucide-react";

function getInitials(name?: string): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function RealStories() {
  const data = realStoriesData;
  const { publicStories, isLoadingPublicStories, fetchPublicStories } = useContentStore();

  useEffect(() => {
    void fetchPublicStories();
  }, [fetchPublicStories]);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Section Heading & Subtitle */}
        <div>
          <Heading
            as="h1"
            title1={data.titleTop}
            title2={data.titleAccent}
            className="uppercase"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[44ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {data.body}
          </p>
        </div>

        {/* Stats Row */}
        <ViewReveal duration={800} startDelay={100}>
          {/* Mobile / Tablet (< lg): 2x2 Grid with hairline dividers */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-6 sm:gap-x-10 lg:hidden">
            {data.stats.map((stat) => {
              return (
                <div
                  key={stat.label}
                  className="flex flex-col justify-start"
                >
                  <NumberRoller
                    value={stat.value}
                    className="font-mono font-regular text-[32px] sm:text-[38px] lg:text-[46px] leading-none text-ink tracking-tight tabular-nums"
                  />
                  <span className="font-mono font-regular text-[10px] sm:text-[11px] lg:text-[14px] tracking-[1.5px] uppercase text-muted mt-3 block">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Desktop (>= lg): 4-Column Divider Row */}
          <div className="hidden lg:grid lg:grid-cols-4">
            {data.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col justify-start ${idx > 0
                  ? "border-l border-ink/15 pl-8 xl:pl-10"
                  : "pr-8 xl:pr-10"
                  }`}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <NumberRoller
                    value={stat.value}
                    className="font-regular text-[40px] xl:text-[46px] 3xl:text-[50px] leading-none text-ink tracking-tight tabular-nums"
                  />
                  <span className="font-light text-[10px] sm:text-[11px] xl:text-[14px] tracking-[1.5px] uppercase text-muted mt-3.5 block">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </div>
        </ViewReveal>

        {/* Review Cards Grid */}
        <ViewReveal duration={800} startDelay={150}>
          {isLoadingPublicStories && publicStories.length === 0 ? (
            <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 border border-ink/15 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[220px] animate-pulse"
                >
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-3.5 h-3.5 bg-ink/10 rounded-xs" />
                      ))}
                    </div>
                    <div className="space-y-2.5 mt-5">
                      <div className="h-4 bg-ink/10 rounded w-full" />
                      <div className="h-4 bg-ink/10 rounded w-5/6" />
                      <div className="h-4 bg-ink/10 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 mt-6 pt-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ink/10 shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="h-3.5 bg-ink/10 rounded w-28" />
                      <div className="h-3 bg-ink/10 rounded w-36" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : publicStories.length === 0 ? (
            <div className="mt-10 sm:mt-12 lg:mt-16 py-12 text-center rounded-[20px] border border-ink/10 bg-[#FAF8F5]">
              <p className="font-sans text-[15px] sm:text-[17px] text-muted">
                No resident stories available at the moment.
              </p>
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {publicStories.map((story) => {
                const rating = Math.min(5, Math.max(1, Math.round(story.rating || 5)));
                const initials = getInitials(story.name);
                const role = [story.profession, story.location].filter(Boolean).join(" · ");

                return (
                  <div
                    key={story.id}
                    className="bg-white rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 border border-ink/15 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    {/* Top: Stars & Quote */}
                    <div>
                      <div
                        className="flex items-center gap-1"
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {[...Array(rating)].map((_, i) => (
                          <Star
                            key={i}
                            fill="#77736B"
                            className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-[#77736B]"
                            strokeWidth={1.3}
                          />
                        ))}
                      </div>

                      <p className="font-display font-regular text-[16px] sm:text-[18px] lg:text-[20px] 3xl:text-[26px] leading-[1.4] text-ink mt-4 sm:mt-5">
                        &ldquo;{story.description}&rdquo;
                      </p>
                    </div>

                    {/* Bottom: Avatar initials & Name/College */}
                    <div className="flex items-center gap-3.5 mt-6 pt-2">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#77736B]/50 flex items-center justify-center font-mono text-[10px] sm:text-[12px] font-medium text-[#77736B] shrink-0 select-none">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-sans font-medium text-[13px] sm:text-[14px] lg:text-[18px] 3xl:text-[20px] text-[#77736B] leading-tight truncate">
                          {story.name}
                        </h4>
                        {role && (
                          <span className="font-sans font-regular text-[11px] sm:text-[12px] 3xl:text-[14px] text-muted mt-0.5 truncate">
                            {role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ViewReveal>
      </Container>
    </section>
  );
}

export default RealStories;
