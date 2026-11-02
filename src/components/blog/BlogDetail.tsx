"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, ArrowRight } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { useContentStore } from "@/store/useContentStore";
import { SafeBlog, BLOG_CATEGORY_LABELS } from "@/types/blog.types";
import ScheduleVisitModal from "../shared/ScheduleVisitModal";

interface BlogDetailProps {
  slug?: string;
  blog?: SafeBlog | null;
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

export function BlogDetail({
  slug,
  blog: propBlog,
  className = "",
}: BlogDetailProps) {
  const { publicBlogs, latestBlogs, getPublicBlogBySlug } = useContentStore();
  const [blog, setBlog] = useState<SafeBlog | null>(propBlog || null);
  const [isLoading, setIsLoading] = useState<boolean>(!propBlog);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (propBlog) {
      setBlog(propBlog);
      setIsLoading(false);
      return;
    }

    if (!slug) {
      if (publicBlogs.length > 0) {
        setBlog(publicBlogs[0]);
      } else if (latestBlogs.length > 0) {
        setBlog(latestBlogs[0]);
      }
      setIsLoading(false);
      return;
    }

    const normalized = slug.toLowerCase().trim();
    const existing =
      publicBlogs.find((b) => b.slug.toLowerCase().trim() === normalized) ||
      latestBlogs.find((b) => b.slug.toLowerCase().trim() === normalized);

    if (existing) {
      setBlog(existing);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getPublicBlogBySlug(normalized).then((res) => {
      if (res.success && res.data) {
        setBlog(res.data);
      } else {
        setBlog(null);
      }
      setIsLoading(false);
    });
  }, [slug, propBlog, publicBlogs, latestBlogs, getPublicBlogBySlug]);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share && blog) {
          await navigator.share({
            title: blog.title,
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

  if (isLoading) {
    return (
      <article className={`pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12 ${className}`}>
        <Container>
          <div className="py-24 text-center">
            <p className="font-mono text-xs uppercase tracking-[2px] text-muted animate-pulse">
              Loading journal article...
            </p>
          </div>
        </Container>
      </article>
    );
  }

  if (!blog) {
    return (
      <article className={`pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12 ${className}`}>
        <Container>
          <div className="py-24 text-center space-y-4">
            <h1 className="font-serif text-2xl sm:text-3xl text-ink">Article Not Found</h1>
            <p className="font-mono text-xs uppercase tracking-[2px] text-muted">
              The article you are looking for does not exist or has been removed.
            </p>
            <div className="pt-4">
              <Link
                href="/blog"
                className="font-mono uppercase text-[11px] tracking-[1.5px] inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-ink hover:bg-ink hover:text-paper transition-all"
              >
                <span>&larr; BACK TO THE JOURNAL</span>
              </Link>
            </div>
          </div>
        </Container>
      </article>
    );
  }

  const categoryLabel =
    BLOG_CATEGORY_LABELS[blog.category] ||
    (blog.category ? blog.category.toUpperCase() : "JOURNAL");
  const dateText = formatDate(blog.createdAt);
  const readTimeText = `${blog.readDuration || 3} MIN READ`;
  const imageUrl = blog.image?.url || "/images/blog01.png";

  const paragraphs = blog.description
    ? blog.description
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
    : [];

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
                {categoryLabel} • {dateText} • {readTimeText}
              </p>

              {/* Title */}
              <h1 className="font-sans font-medium text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] leading-[1.12] tracking-[-0.03em] text-ink mt-3 sm:mt-4">
                {blog.title}
              </h1>

              {/* Featured Hero Image */}
              <div className="relative aspect-[16/9.5] sm:aspect-[16/9] w-full overflow-hidden rounded-[18px] sm:rounded-[22px] bg-ink/5 mt-6 sm:mt-8 shadow-sm">
                <Image
                  src={imageUrl}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Body Content */}
              <div className="mt-8 sm:mt-10 lg:mt-12 space-y-6 sm:space-y-7">
                {/* Subtitle / Intro Paragraph */}
                {blog.subtitle && (
                  <p className="font-sans font-light text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.65] text-ink/85">
                    {blog.subtitle}
                  </p>
                )}

                {/* Description Paragraphs */}
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-sans font-light text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] leading-[1.65] text-ink/75 whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="font-sans font-light text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] leading-[1.65] text-ink/75">
                    {blog.description}
                  </p>
                )}
              </div>

              {/* Footer / Meta & Share Bar */}
              <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Author Info */}
                <span className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] text-muted">
                  PUBLISHED BY AURUS EDITORIAL TEAM
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

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] rounded-full border border-ink/25 px-5 py-2.5 bg-ink text-paper hover:bg-paper hover:text-ink transition-all duration-300 w-full sm:w-auto text-center cursor-pointer"
                  >
                    BOOK A VISIT
                  </button>
                </div>
              </div>
            </ViewReveal>
          </div>
        </div>
      </Container>

      {/* Schedule a Visit Modal */}
      <ScheduleVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </article>
  );
}

export default BlogDetail;
