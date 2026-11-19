"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "@/components/ui/Primitives";
import { componyInfoData, managedNav, useAssets } from "@/data";
import { EnquiryModal } from "@/components/shared/EnquiryModal";
import { useScrollNavigation } from "@/components/utils/Scroll";

export interface ManagedNavbarProps {
  variant?: "auto" | "light" | "dark";
  className?: string;
}

export function ManagedNavbar({
  variant = "light",
  className = "",
}: ManagedNavbarProps) {
  const [open, setOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const pathname = usePathname();
  const assets = useAssets();
  const { handleScroll } = useScrollNavigation();

  const isDark = variant === "dark";

  // Base background styles
  const headerBg = open
    ? "bg-cream text-ink border-b-transparent shadow-none"
    : isDark
    ? "bg-transparent text-white"
    : "bg-cream text-ink border-b border-line";

  const headerClasses = isDark
    ? `absolute inset-x-0 top-0 transition-colors duration-300 ${
        open
          ? "z-[70] bg-cream text-ink border-b-transparent shadow-none"
          : "z-50 text-white"
      }`
    : `relative w-full transition-colors duration-300 ${
        open ? "z-[70]" : "z-50"
      } ${headerBg}`;

  // Logo inverted for dark overlay when drawer is closed
  const logoClasses =
    isDark && !open
      ? "w-[120px] sm:w-[135px] lg:w-[155px] h-auto object-contain grayscale invert"
      : "w-[120px] sm:w-[135px] lg:w-[155px] h-auto object-contain";

  // CTA button styling
  const desktopCtaClasses = isDark
    ? "border-white/55 text-white hover:bg-white hover:text-ink"
    : "border-ink/40 text-ink hover:bg-ink hover:text-paper";

  const mobileCtaClasses = open
    ? "border-ink text-ink hover:bg-ink hover:text-paper"
    : isDark
    ? "border-white/60 text-white hover:bg-cream hover:text-ink"
    : "border-ink text-ink hover:bg-ink hover:text-paper";

  const hamburgerBarColor = open ? "bg-ink" : isDark ? "bg-white" : "bg-ink";

  // Responsive container padding matching Aurus navbars
  const innerWrapperClasses = isDark
    ? "relative z-50 mx-auto flex w-full max-w-[1920px] items-center justify-between px-6 py-6 sm:px-10 lg:px-[min(4.5833vw,88px)] lg:py-[2.1vw]"
    : "relative z-50 mx-auto flex w-full max-w-[1920px] items-center justify-between px-5 sm:px-8 lg:px-[6.25vw] py-3.5 sm:py-4 lg:py-5";

  const onNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setOpen(false);
    if (pathname === "/managed-hostels" && href.startsWith("#")) {
      handleScroll(e, href);
    }
  };

  return (
    <header className={`${headerClasses} ${className}`}>
      <div className={innerWrapperClasses}>
        {/* Brand Logo (Left) */}
        <Link href="/" aria-label="Aurus home" className="flex items-center shrink-0">
          <Image
            src={assets.logo}
            alt="Aurus Managed Residences"
            width={155}
            height={42}
            priority
            className={logoClasses}
          />
        </Link>

        {/* Desktop Navigation Links (Center) */}
        <nav
          className="hidden items-center gap-6 xl:gap-8 lg:flex"
          aria-label="Managed Residences Navigation"
        >
          {managedNav.links.map((link) => {
            const fullHref =
              pathname === "/managed-hostels"
                ? link.href
                : `/managed-hostels${link.href}`;

            return (
              <Link
                key={link.label}
                href={fullHref}
                onClick={(e) => onNavClick(e, link.href)}
                className={`font-mono uppercase text-[11px] lg:text-[12px] xl:text-[13px] leading-none tracking-[1.5px] transition-opacity hover:opacity-70 ${
                  isDark ? "text-white" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button (Right) */}
        <div className="hidden lg:flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => setIsEnquiryOpen(true)}
            className={`font-mono uppercase text-[11px] lg:text-[12px] leading-none tracking-[2px] inline-flex items-center gap-2 rounded-full border px-6 py-2.5 lg:px-7 lg:py-2.5 transition-colors duration-200 cursor-pointer ${desktopCtaClasses}`}
          >
            <span>{managedNav.cta.label}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Mobile & Tablet Controls: ENQUIRE Button + 2-Line Hamburger Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 lg:hidden">
          <button
            type="button"
            onClick={() => setIsEnquiryOpen(true)}
            className={`font-mono uppercase inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-[12px] tracking-[1.5px] transition-colors duration-200 active:scale-95 cursor-pointer ${mobileCtaClasses}`}
          >
            <span>{managedNav.cta.label}</span>
            <ArrowRight className="h-3 w-3" />
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-managed-nav"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center p-1 focus:outline-none cursor-pointer"
          >
            <span className="relative flex h-[8px] w-[22px] flex-col justify-between">
              <span
                className={`block h-[1.5px] w-full rounded-full transition-all duration-300 ease-in-out ${hamburgerBarColor} ${
                  open ? "translate-y-[3.25px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full rounded-full transition-all duration-300 ease-in-out ${hamburgerBarColor} ${
                  open ? "-translate-y-[3.25px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dimmed Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/45 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile & Tablet Side Menu Drawer */}
      <aside
        id="mobile-managed-nav"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[82vw] max-w-[420px] flex-col bg-black px-5 pb-7 pt-6 text-white transition-transform duration-300 ease-out sm:px-8 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mt-8 mb-7 flex items-center justify-between">
          <Link href="/" aria-label="Aurus home" className="flex items-center shrink-0">
            <Image
              src={assets.logo}
              alt="Aurus Managed Residences"
              width={155}
              height={42}
              priority
              className="w-[120px] sm:w-[135px] lg:w-[155px] h-auto object-contain grayscale invert"
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-full border border-white/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[1.5px] cursor-pointer"
          >
            Close
          </button>
        </div>

        <nav aria-label="Managed mobile primary" className="flex flex-col">
          {managedNav.links.map((link, index) => {
            const fullHref =
              pathname === "/managed-hostels"
                ? link.href
                : `/managed-hostels${link.href}`;

            return (
              <Link
                key={link.label}
                href={fullHref}
                tabIndex={open ? 0 : -1}
                onClick={(e) => onNavClick(e, link.href)}
                className="flex items-end gap-3 border-b border-white/20 py-3.5 font-sans font-light text-white/80 uppercase tracking-[1px] transition-opacity hover:opacity-60"
              >
                <span className="text-[17px] mb-1 font-mono text-white/50">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <span className="text-[24px] sm:text-[28px] whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-end pb-8">
          <a
            href={`tel:${componyInfoData.mobile}`}
            className="mt-3 text-right font-sans font-light text-white/80 text-[15px] sm:text-[16px] tracking-[1px] transition-opacity hover:opacity-60"
          >
            Toll-free: {componyInfoData.mobile}
          </a>
          <a
            href={`mailto:${componyInfoData.email}`}
            className="text-right font-sans font-light text-white/80 text-[15px] sm:text-[16px] tracking-[1px] transition-opacity hover:opacity-60"
          >
            {componyInfoData.email}
          </a>
        </div>
      </aside>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialCity="Ahmedabad"
      />
    </header>
  );
}

export default ManagedNavbar;
