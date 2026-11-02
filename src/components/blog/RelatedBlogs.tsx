"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { useContentStore } from "@/store/useContentStore";
import { SafeBlog, BLOG_CATEGORY_LABELS } from "@/types/blog.types";

interface RelatedBlogsProps {
  currentSlug?: string;
  blogs?: SafeBlog[];
  className?: string;
}

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

export function RelatedBlogs({
  currentSlug,
  blogs: propBlogs,
  className = "",
}: RelatedBlogsProps) {
  const { publicBlogs, latestBlogs, fetchLatestBlogs } = useContentStore();

  useEffect(() => {
    if (!propBlogs && latestBlogs.length === 0 && publicBlogs.length === 0) {
      fetchLatestBlogs();
    }
  }, [propBlogs, latestBlogs.length, publicBlogs.length, fetchLatestBlogs]);

  const displayBlogs = useMemo(() => {
    if (propBlogs && propBlogs.length > 0) {
      return propBlogs;
    }
    const source = publicBlogs.length > 0 ? publicBlogs : latestBlogs;
    return source
      .filter(
        (b) =>
          !currentSlug ||
          b.slug.toLowerCase().trim() !== currentSlug.toLowerCase().trim()
      )
      .slice(0, 3);
  }, [propBlogs, publicBlogs, latestBlogs, currentSlug]);

  if (displayBlogs.length === 0) return null;

  return (
    <section className={`py-8 sm:py-12 lg:py-16 ${className}`}>
      <Container>
        <ViewReveal duration={800} startDelay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {displayBlogs.map((article) => {
              const categoryLabel =
                BLOG_CATEGORY_LABELS[article.category] ||
                (article.category ? article.category.toUpperCase() : "JOURNAL");
              const dateText = formatDate(article.createdAt);
              const readTimeText = `${article.readDuration || 3} MIN READ`;
              const imageUrl = article.image?.url || "/images/blog01.png";
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
        </ViewReveal>
      </Container>
    </section>
  );
}

export default RelatedBlogs;
