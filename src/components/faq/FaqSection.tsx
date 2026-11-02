"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { faqHero, faqCta } from "@/data/faq";
import { useContentStore } from "@/store/useContentStore";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import { MessageCircle } from "lucide-react";

interface FaqAccordionItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export function FaqAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  isLast,
}: FaqAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLSpanElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const el = contentRef.current;
    const plus = plusRef.current;
    if (!el) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!isOpen) {
        gsap.set(el, { height: 0, opacity: 0, display: "none" });
      } else {
        gsap.set(el, { height: "auto", opacity: 1, display: "block" });
        if (plus) gsap.set(plus, { rotate: 45 });
      }
      return;
    }

    if (isOpen) {
      gsap.killTweensOf(el);
      gsap.set(el, { display: "block", overflow: "hidden" });
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.42,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(el, { overflow: "visible" });
          },
        }
      );
      if (plus) {
        gsap.to(plus, { rotate: 45, duration: 0.35, ease: "power2.out" });
      }
    } else {
      gsap.killTweensOf(el);
      gsap.set(el, { overflow: "hidden" });
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });
      if (plus) {
        gsap.to(plus, { rotate: 0, duration: 0.35, ease: "power2.inOut" });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (contentRef.current) gsap.killTweensOf(contentRef.current);
      if (plusRef.current) gsap.killTweensOf(plusRef.current);
    };
  }, []);

  return (
    <div className={`transition-colors ${!isLast ? "border-b border-ink/15" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group cursor-pointer"
      >
        <span className="font-sans font-light text-[12px] sm:text-[16px] lg:text-[20px] text-ink group-hover:text-neutral-700 transition-colors">
          {question}
        </span>
        <span
          ref={plusRef}
          className="font-mono text-[18px] sm:text-[20px] text-ink/60 group-hover:text-ink shrink-0 inline-block will-change-transform"
        >
          +
        </span>
      </button>

      <div ref={contentRef} className="will-change-[height,opacity]">
        <div className="pb-5 pt-1 pr-6 font-sans font-light text-[10px] sm:text-[12px] lg:text-[14px] text-muted leading-relaxed">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const { publicFaqCategories, isLoadingPublicFaqs, fetchPublicFaqs } = useContentStore();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void fetchPublicFaqs({ grouped: true });
  }, [fetchPublicFaqs]);

  const categories = useMemo(() => {
    return (publicFaqCategories || []).filter(
      (cat) => Array.isArray(cat.items) && cat.items.length > 0
    );
  }, [publicFaqCategories]);

  useEffect(() => {
    if (categories.length > 0 && (!activeCategory || !categories.some((c) => c.category === activeCategory))) {
      setActiveCategory(categories[0].category);
    }
  }, [categories, activeCategory]);

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`faq-cat-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Section Heading & Subtitle */}
        <div>
          <Heading
            title1={faqHero.titleTop}
            title2={faqHero.titleAccent}
            className="uppercase max-w-4xl"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[48ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {faqHero.body}
          </p>
        </div>

        {/* Main FAQ Layout: Left Category Nav & Right Questions */}
        <ViewReveal duration={800} startDelay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 mt-10 sm:mt-12 lg:mt-16 items-start">
            {/* Left Column: Category Pills Filter */}
            <div className="lg:col-span-3 xl:col-span-3">
              {/* Mobile / Tablet: Horizontal Scrollable Pills */}
              <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 no-scrollbar">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.category;
                  return (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => handleCategoryClick(cat.category)}
                      className={`font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] rounded-full border px-4 py-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-ink text-paper border-ink"
                          : "border-ink/20 text-muted hover:border-ink/40 hover:text-ink bg-transparent"
                      }`}
                    >
                      {cat.categoryLabel.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* Desktop: Sticky Vertical Stack */}
              <div className="hidden lg:flex lg:flex-col lg:sticky lg:top-28 space-y-2.5">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.category;
                  return (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => handleCategoryClick(cat.category)}
                      className={`font-mono uppercase text-[10px] sm:text-[12px] tracking-[1.5px] rounded-full border px-5 py-2.5 text-left transition-all duration-200 cursor-pointer w-full ${
                        isActive
                          ? "bg-ink text-paper border-ink font-medium"
                          : "border-ink/20 text-ink hover:border-ink/50 hover:text-ink bg-transparent"
                      }`}
                    >
                      {cat.categoryLabel.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Categorized FAQ Accordions */}
            <div className="lg:col-span-9 space-y-10 sm:space-y-12">
              {isLoadingPublicFaqs && categories.length === 0 ? (
                <div className="space-y-6 py-8">
                  <div className="h-6 w-36 bg-ink/10 rounded animate-pulse" />
                  <div className="border-t border-b border-ink/15 divide-y divide-ink/15">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="py-5 flex items-center justify-between">
                        <div className="h-5 w-3/4 bg-ink/10 rounded animate-pulse" />
                        <div className="h-5 w-5 bg-ink/10 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="py-12 text-center rounded-[20px] border border-ink/10 bg-[#FAF8F5]">
                  <p className="font-sans text-[15px] text-muted">
                    No FAQs available at the moment.
                  </p>
                </div>
              ) : (
                categories.map((cat, catIdx) => (
                  <div
                    key={cat.category}
                    id={`faq-cat-${cat.category}`}
                    className={`scroll-mt-28 ${catIdx > 0 ? "pt-2" : ""}`}
                  >
                    {/* Category Eyebrow */}
                    <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
                      {cat.categoryLabel.toUpperCase()}
                    </span>

                    {/* Accordion Questions */}
                    <div className="border-t border-b border-ink/15">
                      {cat.items.map((item, index) => {
                        const isOpen = !!openItems[item.id];
                        const isLast = index === cat.items.length - 1;
                        return (
                          <FaqAccordionItem
                            key={item.id}
                            id={item.id}
                            question={item.question}
                            answer={item.answer}
                            isOpen={isOpen}
                            onToggle={() => toggleItem(item.id)}
                            isLast={isLast}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              )}

              {/* Bottom Banner: Still have a question? CTA */}
              <div className="bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-sans font-regular text-[12px] sm:text-[16px] lg:text-[20px] text-ink">
                    {faqCta.title}
                  </h3>
                  <p className="font-sans font-light text-[10px] sm:text-[12px] lg:text-[14px] text-muted leading-relaxed mt-1">
                    {faqCta.subtitle}
                  </p>
                </div>

                <a
                  href={faqCta.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] font-medium inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-paper px-6 sm:px-8 py-3.5 transition-all duration-300 hover:bg-neutral-800 shrink-0 w-full sm:w-auto text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{faqCta.buttonLabel}</span>
                </a>
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
