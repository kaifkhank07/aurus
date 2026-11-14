"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, navmenu } from "@/data/layout";
import { ArrowRight } from "@/components/ui/Primitives";
import Image from "next/image";
import { useAssets } from "@/data";
import { EnquiryModal } from "@/components/shared/EnquiryModal";

export interface NavProps {
  variant?: "auto" | "light" | "dark";
  className?: string;
}

export function Nav({ variant = "dark", className = "" }: NavProps) {
  const [open, setOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const assets = useAssets();

  const isDark = variant === "dark";

  // Desktop CTA styles
  const desktopCtaClasses = isDark
    ? "border-white/55 text-white hover:bg-white hover:text-ink"
    : "border-ink text-ink hover:bg-ink hover:text-paper";

  return (
    <header className={`absolute inset-x-0 top-0 text-white transition-all duration-300 ${open ? "z-[70]" : "z-50"}`}>
      <div className="relative z-[70] mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-7 sm:px-10 lg:px-[4.5833vw] lg:py-[2.1vw]">
        <Link href="/" aria-label="Aurus home">
          <Image
            src={assets.logo}
            alt="Aurus"
            width={120}
            height={120}
            className="grayscale invert"
          />
        </Link>

        <nav className="hidden items-center gap-4 lg:gap-6 lg:flex" aria-label="Primary">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[1px] text-white transition-colors hover:text-white/70"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={nav.cta0.href}
            className={`font-mono uppercase text-[11px] lg:text-[12px] leading-none tracking-[2px] inline-flex items-center gap-2 rounded-full border px-6 py-2.5 lg:px-7 lg:py-3 transition-colors duration-200 cursor-pointer ${desktopCtaClasses}`}
          >
            {nav.cta0.label}
            <ArrowRight />
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsEnquiryOpen(true)}
          className={`font-mono uppercase text-[11px] lg:text-[12px] leading-none tracking-[2px] inline-flex items-center gap-2 rounded-full border px-6 py-2.5 lg:px-7 lg:py-3 transition-colors duration-200 cursor-pointer ${desktopCtaClasses}`}
        >
          <span className="uppercase">{nav.cta.label}</span>
          <ArrowRight className="h-3 w-3" />
        </button>

        {/* <button
          type="button"
          onClick={() => setIsEnquiryOpen(true)}
          className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] hidden items-center gap-2 rounded-full border border-white/55 px-7 py-3.5 transition-colors hover:bg-white hover:text-ink lg:inline-flex cursor-pointer"
        >
          {nav.cta.label}
          <ArrowRight />
        </button> */}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] flex items-center gap-2 rounded-full border border-white/55 px-4 py-2.5 lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/45 lg:hidden"
          />
          <div
            id="mobile-nav"
            className="relative mx-5 rounded-2xl border border-white/15 bg-ink/90 p-6 backdrop-blur-md z-[70] lg:hidden"
          >
            <nav className="flex flex-col gap-5" aria-label="Primary mobile">
              {navmenu.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </header>
  );
}
