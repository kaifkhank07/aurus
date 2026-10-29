"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogsData, JournalArticle } from "@/data/blog";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";

interface RelatedBlogsProps {
  articles?: JournalArticle[];
  className?: string;
}

export function RelatedBlogs({
  articles = blogsData.journalSection.articles.slice(0, 3),
  className = "",
}: RelatedBlogsProps) {
  return (
    <section className={`py-8 sm:py-12 lg:py-16 ${className}`}>
      <Container>
        <ViewReveal duration={800} startDelay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {articles.map((article) => (
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
                <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <p className="font-mono text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-muted">
                      {article.category} • {article.date} • {article.readTime}
                    </p>

                    <h3 className="font-sans font-semibold text-[15px] sm:text-[17px] leading-[1.35] text-ink mt-2.5 transition-colors group-hover:text-neutral-700">
                      {article.title}
                    </h3>

                    <p className="font-sans font-regular text-[12px] sm:text-[13px] leading-[1.5] text-muted mt-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end sm:justify-start items-center">
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
      </Container>
    </section>
  );
}

export default RelatedBlogs;
