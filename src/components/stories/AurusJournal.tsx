"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { storiesData } from "@/data/stories";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";


export function AurusJournal() {
  const data = storiesData.journalSection;
  const bannerData = storiesData.communityBanner;

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
          <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {data.articles.map((article) => (
              <div
                key={article.id}
                className="rounded-[22px] bg-[#FAF8F5] border border-ink/[0.06] flex flex-col justify-start group transition-all duration-300 hover:shadow-lg hover:border-ink/15 hover:-translate-y-1"
              >
                {/* Article Card Top: Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[16px]">
                  <Image
                    src={article.image}
                    alt={article.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Meta info text & pill button */}
                <div className="p-4 sm:p-6">
                  <p className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted">
                    {article.category} • {article.date} • {article.readTime}
                  </p>

                  <h3 className="font-sans font-semibold text-[15px] sm:text-[17px] leading-[1.35] text-ink mt-2.5 transition-colors group-hover:text-neutral-700">
                    {article.title}
                  </h3>

                  <p className="font-sans font-regular text-[12px] sm:text-[13px] leading-[1.5] text-muted mt-2">
                    {article.excerpt}
                  </p>

                  <div className="mt-2.5 flex justify-end sm:justify-start items-center">
                    <Link
                      href={article.href}
                      className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-ink transition-all duration-300 hover:bg-ink hover:text-paper hover:border-ink w-fit "
                    >
                      <span>{article.ctaText}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <Link
              href={bannerData.cta.href}
              className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] font-medium inline-flex items-center justify-center rounded-full bg-ink text-paper px-7 sm:px-9 py-3.5 sm:py-4 transition-all duration-300 hover:bg-neutral-800 hover:shadow-sm active:scale-[0.99] w-full sm:w-auto text-center"
            >
              {bannerData.cta.label}
            </Link>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default AurusJournal;
