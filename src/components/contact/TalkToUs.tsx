"use client";

import React from "react";
import Link from "next/link";
import { contactData, ContactPageData } from "@/data/contact";
import { Container } from "../ui/Primitives";
import { ViewReveal } from "../animation";
import { Heading } from "../utils/Heading";



export function TalkToUs() {
  const data = contactData.hero;

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        {/* Section Heading & Subtitle */}
        <div>
          <Heading
            as="h1"
            title1={data.titleTop}
            title2={data.titleAccent}
            className="uppercase max-w-4xl"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[48ch] font-sans font-regular text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.45] tracking-[-0.025em] text-muted">
            {data.body}
          </p>
        </div>

        {/* 3 Contact Channels Grid */}
        <ViewReveal duration={800} startDelay={100}>
          <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {data.channels.map((channel) => {
              const cardContent = (
                <div className="bg-white rounded-[20px] p-6 sm:p-7 border border-ink/15 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
                  <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] tracking-[2px] text-muted">
                    {channel.label}
                  </span>
                  <h3 className="font-sans font-regular text-[20px] sm:text-[22px] lg:text-[24px] text-ink mt-3 tracking-tight group-hover:text-neutral-700 transition-colors">
                    {channel.value}
                  </h3>
                  <p className="mt-1 font-sans font-regular text-[12px] sm:text-[14px] text-muted">
                    {channel.subtext}
                  </p>
                </div>
              );

              return channel.href ? (
                <Link
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block h-full"
                >
                  {cardContent}
                </Link>
              ) : (
                <div key={channel.label} className="h-full">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default TalkToUs;
