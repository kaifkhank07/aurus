"use client";

import React, { useState } from "react";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import { FaqAccordionItem } from "../faq/FaqSection";
import { PublicCity } from "@/types/city.types";

export const cityFaqData = [
  {
    id: "city-faq-1",
    question: "What types of student accommodation does Aurus offer?",
    answer:
      "Aurus offers thoughtfully designed private and shared student residences with comfortable living spaces and facilities designed around student needs.",
  },
  {
    id: "city-faq-2",
    question: "Are Aurus residences suitable for college students?",
    answer:
      "Yes. Aurus student residences are designed to provide a comfortable living environment with convenient access to educational institutions and essential facilities.",
  },
  {
    id: "city-faq-3",
    question: "What facilities are available at Aurus residences?",
    answer:
      "Aurus residences offer facilities including chef-curated dining, high-speed Wi-Fi, dedicated study spaces, and security arrangements for residents.",
  },
  {
    id: "city-faq-4",
    question: "Are meals included in student accommodation?",
    answer:
      "Aurus residences offer daily chef-curated dining with wholesome meals designed to support students' everyday nutritional needs.",
  },
  {
    id: "city-faq-5",
    question: "How can I book a student residence?",
    answer:
      "You can explore the available Aurus residences, choose a suitable property, and submit a visit or enquiry request through the website.",
  },
  {
    id: "city-faq-6",
    question: "Is security available at Aurus residences?",
    answer:
      "Aurus prioritizes resident safety through security arrangements that include biometric access, CCTV surveillance, and on-site wardens.",
  },
];

interface CityFaqProps {
  city?: PublicCity;
  citySlug?: string;
}

export function CityFaq({ citySlug }: CityFaqProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

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
            <div className="border-y border-ink/15">
              {cityFaqData.map((item, index) => {
                const isOpen = !!openItems[item.id];
                const isLast = index === cityFaqData.length - 1;

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
        </ViewReveal>
      </Container>
    </section>
  );
}

export default CityFaq;
