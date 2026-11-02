"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { storiesData } from "@/data/stories";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import ScheduleVisitModal from "../shared/ScheduleVisitModal";
import { useContentStore } from "@/store/useContentStore";
import { BLOG_CATEGORY_LABELS } from "@/types/blog.types";

function formatDate(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return "";
  }
}

export function AurusJournal() {
  const data = storiesData.journalSection;
  const bannerData = storiesData.communityBanner;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { latestBlogs, isLoadingLatestBlogs, fetchLatestBlogs } = useContentStore();

  useEffect(() => {
    fetchLatestBlogs();
  }, [fetchLatestBlogs]);

  const articlesToDisplay = latestBlogs.slice(0, 3);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Section Heading & Subtitle */}
        <div>
          <Heading
            as="h2"
            title1={data.titleTop}
            title2={data.titleAccent}
            className="uppercase"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[44ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {data.body}
          </p>
        </div>

        {/* 3 Articles Grid */}
        <ViewReveal duration={800} startDelay={100}>
          {isLoadingLatestBlogs && articlesToDisplay.length === 0 ? (
            <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="rounded-[22px] bg-[#FAF8F5] border border-ink/[0.06] flex flex-col justify-start animate-pulse"
                >
                  <div className="relative aspect-[16/10] w-full bg-ink/5 rounded-t-[16px]" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-3 w-1/2 bg-ink/10 rounded" />
                    <div className="h-5 w-3/4 bg-ink/10 rounded" />
                    <div className="h-3.5 w-full bg-ink/10 rounded" />
                    <div className="h-3.5 w-2/3 bg-ink/10 rounded" />
                    <div className="pt-2 flex justify-start">
                      <div className="h-8 w-28 bg-ink/10 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : articlesToDisplay.length === 0 ? null : (
            <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {articlesToDisplay.map((article) => {
                const categoryLabel =
                  BLOG_CATEGORY_LABELS[article.category] ||
                  (article.category ? article.category.toUpperCase() : "JOURNAL");
                const dateText = formatDate(article.createdAt);
                const readTimeText = `${article.readDuration || 3} MIN READ`;
                const imageUrl = article.image?.url || "/images/journal-1.png";
                const excerpt =
                  article.subtitle ||
                  (article.description
                    ? article.description.length > 120
                      ? `${article.description.slice(0, 120)}...`
                      : article.description
                    : "");

                return (
                  <div
                    key={article.id}
                    className="rounded-[22px] bg-[#FAF8F5] border border-ink/[0.06] flex flex-col justify-start group transition-all duration-300 hover:shadow-lg hover:border-ink/15 hover:-translate-y-1"
                  >
                    {/* Article Card Top: Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[16px] bg-ink/5">
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Meta info text & pill button */}
                    <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <p className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted">
                          {categoryLabel} • {dateText} • {readTimeText}
                        </p>

                        <h3 className="font-sans font-semibold text-[15px] sm:text-[17px] leading-[1.35] text-ink mt-2.5 transition-colors group-hover:text-neutral-700">
                          {article.title}
                        </h3>

                        <p className="font-sans font-regular text-[12px] sm:text-[13px] leading-[1.5] text-muted mt-2 line-clamp-3">
                          {excerpt}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-end sm:justify-start items-center">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-ink transition-all duration-300 hover:bg-ink hover:text-paper hover:border-ink w-fit"
                        >
                          <span>READ GUIDE</span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ViewReveal>

        {/* Community Banner CTA */}
        <ViewReveal duration={800} startDelay={200}>
          <div className="mt-10 sm:mt-12 lg:mt-14 bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] p-8 sm:p-12 lg:p-16 border border-ink/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8">
            {/* Left Column: Heading */}
            <Heading
              title1={bannerData.titleTop}
              title2={bannerData.titleAccent}
              className="uppercase max-w-[240px] sm:max-w-[660px]"
              title1ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
              title2ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
            />

            {/* Right Column: CTA Pill Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] font-medium inline-flex items-center justify-center rounded-full bg-ink text-paper px-7 sm:px-9 py-3.5 sm:py-4 transition-all duration-300 hover:bg-neutral-800 hover:shadow-sm active:scale-[0.99] w-full sm:w-auto text-center cursor-pointer"
            >
              {bannerData.cta.label}
            </button>
          </div>
        </ViewReveal>
      </Container>

      {/* Schedule a Visit Modal */}
      <ScheduleVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export default AurusJournal;
