"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import { useContentStore } from "@/store/useContentStore";
import { FaqAccordionItem } from "../faq/FaqSection";

export default function Faq() {
  const {
    publicFaqCategories,
    fetchPublicFaqs,
    isLoadingPublicFaqs,
  } = useContentStore();

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void fetchPublicFaqs({ grouped: true });
  }, [fetchPublicFaqs]);

  const items = useMemo(() => {
    const bookingCat = publicFaqCategories.find(
      (c) => c.category === "general" && c.items && c.items.length > 0
    );

    if (bookingCat) {
      return bookingCat.items;
    }

    const firstWithItems = publicFaqCategories.find(
      (c) => c.items && c.items.length > 0
    );

    return firstWithItems ? firstWithItems.items : [];
  }, [publicFaqCategories]);

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Section Heading & Subtitle */}
        <Heading
          title1="Frequently Asked"
          title2=""
          className="max-w-4xl uppercase sm:max-w-none text-center"
          title1ClassName="text-[24px] sm:text-[35px]"
          title2ClassName="text-[24px] sm:text-[35px]"
        />

        {/* Accordions */}
        <ViewReveal duration={800}>
          <div className="w-full max-w-5xl mx-auto space-y-10 sm:space-y-12">
            {isLoadingPublicFaqs && items.length === 0 ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-between border-b border-ink/15 py-5"
                  >
                    <div className="h-5 w-2/3 animate-pulse rounded bg-ink/10" />
                    <div className="h-5 w-5 animate-pulse rounded bg-ink/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-y border-ink/15">
                {items.map((item, index) => {
                  const isOpen = !!openItems[item.id];
                  const isLast = index === items.length - 1;

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
            )}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}