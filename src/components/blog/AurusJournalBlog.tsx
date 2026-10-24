"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogsData } from "@/data/blogs";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";

// Declared limit of 6 articles per page in pagination
const PAGE_LIMIT = 6;

export function AurusJournalBlog() {
  const data = blogsData.journalSection;
  const bannerData = blogsData.communityBanner;

  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const totalArticles = data.articles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_LIMIT));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const startIndex = (currentPage - 1) * PAGE_LIMIT;
  const currentArticles = data.articles.slice(startIndex, startIndex + PAGE_LIMIT);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Section Heading & Subtitle */}
        <div ref={gridTopRef}>
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

        {/* Articles Grid (Max 6 per page) */}
        <ViewReveal duration={800} startDelay={100}>
          <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {currentArticles.map((article) => (
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
                      className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-ink transition-all duration-300 hover:bg-ink hover:text-paper hover:border-ink w-fit"
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

        {/* Pagination Controls */}
        <ViewReveal duration={800} startDelay={150}>
          <div className="mt-12 sm:mt-16 lg:mt-20">
            {/* Top divider hairline rule */}
            <div className="w-full border-t border-ink/15" />

            {/* Pagination Controls Row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 pt-6 sm:pt-8">
              {/* Previous Button */}
              <div className="order-2 lg:order-1 flex justify-start items-center">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] rounded-full border px-4 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 disabled:opacity-30 disabled:border-ink/10 disabled:cursor-not-allowed border-ink/30 text-ink hover:enabled:bg-ink hover:enabled:text-paper cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true">&larr;</span>
                    <span>PREVIOUS</span>
                  </span>
                </button>
              </div>

              {/* Numbered Page Circles */}
              <div className="order-1 lg:order-2 col-span-2 lg:col-span-1 flex justify-center items-center gap-2 sm:gap-3 lg:px-3">
                {pageNumbers.map((page) => {
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Page ${page}`}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full font-mono text-[11px] sm:text-[12px] font-medium flex items-center justify-center transition-all duration-200 ${isActive
                        ? "bg-ink text-paper"
                        : "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper cursor-pointer"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="order-3 flex justify-end items-center">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] rounded-full border px-4 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 disabled:opacity-30 disabled:border-ink/10 disabled:cursor-not-allowed border-ink/30 text-ink hover:enabled:bg-ink hover:enabled:text-paper cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>NEXT</span>
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </ViewReveal>

        {/* Subscribe Banner CTA */}
        <ViewReveal duration={800} startDelay={200}>
          <div className="mt-12 sm:mt-16 lg:mt-20 bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] p-8 sm:p-12 lg:p-16 border border-ink/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
              {/* Left Column: Heading */}
              <div className="lg:col-span-5">
                <Heading
                  title1={bannerData.titleTop}
                  title2={bannerData.titleAccent}
                  className="uppercase"
                  title1ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                  title2ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                />
              </div>

              {/* Right Column: Description & Email Subscribe Input Form */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="font-sans font-light text-[14px] sm:text-[16px] lg:text-[18px] 3xl:text-[20px] leading-[1.45] text-muted opacity-50 max-w-lg">
                  {bannerData.description}
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="mt-4 sm:mt-6 border-b border-ink/15 pb-3 sm:pb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-transparent border-0 font-sans font-light text-[13px] sm:text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:ring-0 font-sans"
                  />

                  <button
                    type="submit"
                    className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] font-medium inline-flex items-center justify-center gap-2 rounded-full bg-ink text-paper px-6 sm:px-8 py-3 transition-all duration-300 hover:bg-neutral-800 active:scale-[0.99] shrink-0"
                  >
                    <span>{bannerData.cta.label}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </button>
                </form>

                {subscribed && (
                  <p className="font-mono text-[11px] tracking-[1px] text-[#C5A059] mt-2.5">
                    Thank you for subscribing!
                  </p>
                )}
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default AurusJournalBlog;
