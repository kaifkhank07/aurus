"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/data/layout";
import { ArrowRight } from "@/components/ui/Primitives";
import Image from "next/image";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-7 sm:px-10 lg:px-[4.5833vw] lg:py-[2.1vw]">
        <Link href="/" aria-label="Aurus home">
          <Image
            src="/images/logo.png"
            alt="Aurus"
            width={120}
            height={120}
            className="grayscale invert"
          />
        </Link>

        <nav className="hidden items-center gap-[2.4vw] lg:flex" aria-label="Primary">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-white transition-colors hover:text-white/70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={nav.cta.href}
          className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] hidden items-center gap-2 rounded-full border border-white/55 px-7 py-3.5 transition-colors hover:bg-white hover:text-ink lg:inline-flex"
        >
          {nav.cta.label}
          <ArrowRight />
        </Link>

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
        <div
          id="mobile-nav"
          className="mx-5 rounded-2xl border border-white/15 bg-ink/90 p-6 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-5" aria-label="Primary mobile">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/55 px-6 py-3"
            >
              {nav.cta.label}
              <ArrowRight />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
