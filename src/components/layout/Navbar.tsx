"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/data/layout";
import { ArrowRight, Container } from "@/components/ui/Primitives";
import Image from "next/image";


export interface NavbarProps {
  variant?: "auto" | "light" | "dark";
  className?: string;
}

export function Navbar({ variant = "auto", className = "" }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isLight = variant === "light";
  const isDark = variant === "dark";

  // When mobile menu is open, header background becomes cream to match the shutter seamlessly
  const headerBg = open
    ? "bg-cream text-ink border-b-transparent shadow-none"
    : "bg-cream text-ink border-b border-line";

  // If explicitly dark variant, allow dark overlay; for auto and light, render the cream navbar matching the design reference
  const headerClasses = isDark
    ? `absolute inset-x-0 top-0 z-50 transition-colors duration-300 ${open ? "bg-cream text-ink border-b-transparent shadow-none" : "text-white"
      }`
    : `relative w-full z-50 transition-colors duration-300 ${headerBg}`;

  // Logo: dark logo on cream background (default/light/auto), inverted only if closed dark overlay
  const logoClasses =
    isDark && !open
      ? "w-[120px] sm:w-[135px] lg:w-[155px] h-auto object-contain grayscale invert"
      : "w-[120px] sm:w-[135px] lg:w-[155px] h-auto object-contain";

  // Mobile CTA styles
  const mobileCtaClasses = open
    ? "border-ink text-ink hover:bg-ink hover:text-paper"
    : isDark
      ? "border-white/60 text-white hover:bg-cream hover:text-ink"
      : "border-ink text-ink hover:bg-ink hover:text-paper";

  // Desktop CTA styles
  const desktopCtaClasses = isDark
    ? "border-white/55 text-white hover:bg-white hover:text-ink"
    : "border-ink text-ink hover:bg-ink hover:text-paper";

  const hamburgerBarColor = open ? "bg-ink" : isDark ? "bg-white" : "bg-ink";

  return (
    <header className={`${headerClasses} ${className}`}>
      <Container className="relative z-50 flex items-center justify-between py-3.5 sm:py-4 lg:py-5">
        {/* Brand Logo */}

        <Link href="/" aria-label="Aurus home" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Aurus Luxury Student Residences"
            width={155}
            height={42}
            priority
            className={logoClasses}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-8 lg:gap-10 xl:gap-12 lg:flex"
          aria-label="Primary"
        >
          {nav.links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/residences" &&
                (pathname === "/residences" || pathname?.includes("residences")));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono uppercase text-[12px] lg:text-[13px] leading-[1.7857] tracking-[2px] transition-opacity hover:opacity-70 ${isDark ? "text-white" : "text-ink"
                  } ${isActive ? "underline underline-offset-8 decoration-1" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA (Pill Button with Arrow) */}
        <div className="hidden lg:flex items-center justify-end shrink-0">
          <Link
            href={nav.cta.href}
            className={`font-mono uppercase text-[11px] lg:text-[12px] leading-none tracking-[2px] inline-flex items-center gap-2 rounded-full border px-6 py-2.5 lg:px-7 lg:py-3 transition-colors duration-200 ${desktopCtaClasses}`}
          >
            <span className="uppercase">{nav.cta.label}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile & Tablet Controls: ENQUIRE Button + 2-Line Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 lg:hidden">
          {/* Mobile Enquire Button */}
          <Link
            href={nav.cta.href}
            className={`font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] font-space-mono tracking-[1.5px] uppercase transition-colors duration-200 active:scale-95 ${mobileCtaClasses}`}
          >
            <span>{nav.cta.label}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* 2-line Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-nav-menu"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center p-1 focus:outline-none"
          >
            <span className="relative flex h-[8px] w-[22px] flex-col justify-between">
              <span
                className={`block h-[1.5px] w-full rounded-full transition-all duration-300 ease-in-out ${hamburgerBarColor} ${open ? "translate-y-[3.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full rounded-full transition-all duration-300 ease-in-out ${hamburgerBarColor} ${open ? "-translate-y-[3.25px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </Container>

      {/* Dimmed backdrop overlay when open (below header bar) */}

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-ink/35 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 lg:hidden ${open
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
          }`}
      />

      {/* Mobile & Tablet Shutter Menu Overlay */}
      <div
        id="mobile-nav-menu"
        aria-hidden={!open}
        className={`absolute top-full inset-x-0 z-40 grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out lg:hidden bg-cream text-ink border-b border-line shadow-2xl ${open
            ? "grid-rows-[1fr] opacity-100 visible pointer-events-auto"
            : "grid-rows-[0fr] opacity-0 invisible pointer-events-none"
          }`}
      >
        <div className="overflow-hidden min-h-0">
          <nav
            className="flex flex-col gap-4 px-5 py-6 sm:px-8 sm:py-7 bg-cream text-ink"
            aria-label="Primary mobile"
          >

            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[13px] sm:text-[14px] text-ink transition-opacity hover:opacity-60"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={nav.cta.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex items-center gap-2 rounded-full border border-ink bg-ink text-paper hover:bg-neutral-800 px-5 py-2.5 text-[12px] tracking-[2px] uppercase transition-all duration-200 active:scale-95"
              >
                <span>{nav.cta.label}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
