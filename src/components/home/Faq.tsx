"use client";

import React, { useState } from "react";
import { faqData } from "@/data/faq";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";
import { MessageCircle } from "lucide-react";


export default function Faq() {
    const data = faqData;
    const filteredData = data.categories.filter((item) => item.id === "booking");
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (itemId: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    return (
        <section className="py-8 sm:py-12 lg:py-16 border">
            <Container>
                {/* Section Heading & Subtitle */}
                <div>
                    <Heading
                        title1="Frequently"
                        title2="Asked"
                        className="uppercase max-w-4xl sm:max-w-none sm:text-center"
                        title1ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                        title2ClassName="text-[38px] sm:text-[42px] md:text-6xl lg:text-7xl xl:text-[56px]"
                    />
                </div>

                {/* Main FAQ Layout: Left Category Nav & Right Questions */}
                <ViewReveal duration={800} startDelay={100}>
                    <div className="mt-8 sm:mt-10 lg:mt-12 space-y-10 sm:space-y-12 px-6 sm:px-8 lg:px-16 border">
                        {filteredData.map((cat, catIdx) => (
                            <div
                                key={cat.id}
                                id={`faq-cat-${cat.id}`}
                                className={`scroll-mt-28 ${catIdx > 0 ? "pt-2" : ""}`}
                            >
                                {/* Category Eyebrow */}
                                {/* <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] text-muted mb-2 block">
                                    {cat.title}
                                </span> */}

                                {/* Accordion Questions */}
                                <div className="border-b border-ink/15">
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
                    </div>
                </ViewReveal>
            </Container>
        </section>
    );
}
