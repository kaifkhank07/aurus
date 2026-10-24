"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { singleBlogData, BlogDetailData } from "@/data/blogs";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";

interface BlogDetailProps {
  post?: BlogDetailData;
  className?: string;
}

export function BlogDetail({
  post = singleBlogData,
  className = "",
}: BlogDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: post.title,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      } catch {
        // user dismissed or share not supported
      }
    }
  };

  return (
    <article className={`pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12 ${className}`}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Back Link */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <Link
                href="/blog"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-ink/80 hover:text-ink transition-colors inline-flex items-center gap-2 pb-1.5 border-b border-ink/25 group"
              >
                <span className="transition-transform duration-200 group-hover:-translate-x-0.5">&larr;</span>
                <span>BACK TO THE JOURNAL</span>
              </Link>
            </div>
          </div>

          {/* Main Column: Header, Image, Body & Footer Bar */}
          <div className="lg:col-span-9 max-w-[840px]">
            <ViewReveal duration={800}>
              {/* Category & Meta */}
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[2px] uppercase text-muted">
                {post.category} • {post.date} • {post.readTime}
              </p>

              {/* Title */}
              <h1 className="font-sans font-medium text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] leading-[1.12] tracking-[-0.03em] text-ink mt-3 sm:mt-4">
                {post.title}
              </h1>

              {/* Featured Hero Image */}
              <div className="relative aspect-[16/9.5] sm:aspect-[16/9] w-full overflow-hidden rounded-[18px] sm:rounded-[22px] bg-ink/5 mt-6 sm:mt-8 shadow-sm">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Body Content */}
              <div className="mt-8 sm:mt-10 lg:mt-12 space-y-6 sm:space-y-7">
                {/* Intro Paragraph */}
                <p className="font-sans font-light text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.65] text-ink/85">
                  {post.intro}
                </p>

                {/* Numbered Sections */}
                {post.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2 pt-1">
                    <h2 className="font-sans font-medium text-[15px] sm:text-[16px] lg:text-[17px] text-ink tracking-tight">
                      {section.title}
                    </h2>
                    <p className="font-sans font-light text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] leading-[1.65] text-ink/75">
                      {section.description}
                    </p>
                  </div>
                ))}

                {/* Conclusion */}
                <p className="font-sans font-light text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] leading-[1.65] text-ink/75 pt-2">
                  {post.conclusion}
                </p>
              </div>

              {/* Footer / Meta & Share Bar */}
              <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Author Info */}
                <span className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] text-muted">
                  PUBLISHED BY {post.author}
                </span>

                {/* Action Buttons */}
                <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] rounded-full border border-ink/25 px-5 py-2.5 text-ink hover:bg-ink hover:text-paper transition-all duration-300 w-full sm:w-auto text-center cursor-pointer"
                  >
                    {copied ? "LINK COPIED!" : "SHARE ARTICLE"}
                  </button>

                  <Link
                    href="/contact"
                    className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] font-medium rounded-full bg-ink text-paper px-6 py-2.5 hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0"
                  >
                    <span>BOOK A VISIT</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </Link>
                </div>
              </div>
            </ViewReveal>
          </div>
        </div>
      </Container>
    </article>
  );
}

export default BlogDetail;
