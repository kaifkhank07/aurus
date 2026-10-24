"use client";

import React, { useState } from "react";
import { faqData } from "@/data/faq";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import { MessageCircle } from "lucide-react";


export default function FaqSection() {
  const data = faqData;
  const [activeCategory, setActiveCategory] = useState<string>(data.categories[0]?.id || "");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

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
            title1={data.hero.titleTop}
            title2={data.hero.titleAccent}
            className="uppercase max-w-4xl"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[48ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {data.hero.body}
          </p>
        </div>

        {/* Main FAQ Layout: Left Category Nav & Right Questions */}
        <ViewReveal duration={800} startDelay={100}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 mt-10 sm:mt-12 lg:mt-16 items-start">
            {/* Left Column: Category Pills Filter */}
            <div className="lg:col-span-3 xl:col-span-3">
              {/* Mobile / Tablet: Horizontal Scrollable Pills */}
              <div className="flex lg:hidden overflow-x-auto pb-2 gap-2 no-scrollbar">
                {data.categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`font-mono uppercase text-[10px] sm:text-[11px] tracking-[1.5px] rounded-full border px-4 py-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${isActive
                        ? "bg-ink text-paper border-ink"
                        : "border-ink/20 text-muted hover:border-ink/40 hover:text-ink bg-transparent"
                        }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>

              {/* Desktop: Sticky Vertical Stack */}
              <div className="hidden lg:flex lg:flex-col lg:sticky lg:top-28 space-y-2.5">
                {data.categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`font-mono uppercase text-[10px] sm:text-[12px] tracking-[1.5px] rounded-full border px-5 py-2.5 text-left transition-all duration-200 cursor-pointer w-full ${isActive
                        ? "bg-ink text-paper border-ink font-medium"
                        : "border-ink/20 text-ink hover:border-ink/50 hover:text-ink bg-transparent"
                        }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Categorized FAQ Accordions */}
            <div className="lg:col-span-9 space-y-10 sm:space-y-12">
              {data.categories.map((cat, catIdx) => (
                <div
                  key={cat.id}
                  id={`faq-cat-${cat.id}`}
                  className={`scroll-mt-28 ${catIdx > 0 ? "pt-2" : ""}`}
                >
                  {/* Category Eyebrow */}
                  <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
                    {cat.title}
                  </span>

                  {/* Accordion Questions */}
                  <div className="border-t border-b border-ink/15">
                    {cat.items.map((item, index) => {
                      const isOpen = !!openItems[item.id];
                      const isLast = index === cat.items.length - 1;
                      return (
                        <div key={item.id} className={`transition-colors ${!isLast ? "border-b border-ink/15" : ""
                          }`}>
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isOpen}
                            className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left group cursor-pointer"
                          >
                            <span className="font-sans font-light text-[12px] sm:text-[16px] lg:text-[20px] text-ink group-hover:text-neutral-700 transition-colors">
                              {item.question}
                            </span>
                            <span
                              className={`font-mono text-[18px] sm:text-[20px] text-ink/60 group-hover:text-ink transition-transform duration-300 shrink-0 ${isOpen ? "rotate-45" : ""
                                }`}
                            >
                              +
                            </span>
                          </button>

                          {isOpen && (
                            <div className="pb-5 pt-1 pr-6 font-sans font-light text-[10px] sm:text-[12px] lg:text-[14px] text-muted leading-relaxed animate-fadeIn">
                              <p>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Bottom Banner: Still have a question? CTA */}
              <div className="bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-sans font-regular text-[12px] sm:text-[16px] lg:text-[20px] text-ink">
                    {data.cta.title}
                  </h3>
                  <p className="font-sans font-light text-[10px] sm:text-[12px] lg:text-[14px] text-muted leading-relaxed mt-1">
                    {data.cta.subtitle}
                  </p>
                </div>

                <a
                  href={data.cta.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] font-medium inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-paper px-6 sm:px-8 py-3.5 transition-all duration-300 hover:bg-neutral-800 shrink-0 w-full sm:w-auto text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{data.cta.buttonLabel}</span>
                </a>
              </div>
            </div>
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}
