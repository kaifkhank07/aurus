"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { nav, navmenu } from "@/data/layout";
import { ArrowRight } from "@/components/ui/Primitives";
import Image from "next/image";
import { useAssets } from "@/data";
import { EnquiryModal } from "@/components/shared/EnquiryModal";

export interface NavbarProps {
    variant?: "auto" | "light" | "dark";
    className?: string;
}

export function LandingNavbar({ variant = "auto", className = "" }: NavbarProps) {
    const [open, setOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const pathname = usePathname();

    const assets = useAssets();

    const isDark = variant === "dark";

    // When mobile menu is open, header background becomes cream to match seamlessly
    const headerBg = "bg-cream text-ink";

    // Header container classes
    const headerClasses = isDark
        ? `relative w-full z-50 transition-colors duration-300 ${open ? "bg-cream text-ink" : "text-white"}`
        : `relative w-full z-50 transition-colors duration-300 ${headerBg}`;

    // Mobile CTA styles
    const mobileCtaClasses = open
        ? "text-ink border-ink hover:bg-ink hover:text-paper"
        : isDark
            ? "text-white border-white/80 hover:bg-cream hover:text-ink"
            : "text-ink border-ink/80 hover:bg-ink hover:text-paper";

    // Desktop CTA styles
    const desktopCtaClasses = isDark
        ? "text-white border-white/80 hover:bg-white hover:text-ink"
        : "text-ink border-ink/80 hover:bg-ink hover:text-paper";

    const hamburgerBarColor = open ? "bg-ink" : isDark ? "bg-white" : "bg-ink";

    return (
        <header className={`${headerClasses} ${className}`}>
            <div className="relative z-50 flex w-full items-center justify-between px-2 sm:px-4 lg:px-6 py-3 sm:py-3.5 lg:h-[72px]">
                {/* Brand Wordmark (Left) */}
                <div className="flex items-center shrink-0">
                    <Link href="/" aria-label="Aurus home" className="flex items-center shrink-0">
                        <Image
                            src={assets.logo2}
                            alt="Aurus Luxury Student Residences"
                            width={155}
                            height={42}
                            priority
                            className="w-[120px] sm:w-[135px] lg:w-[155px] h-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation Links (Center) */}
                <nav
                    className="hidden items-center gap-7 lg:gap-9 xl:gap-11 lg:flex"
                    aria-label="Primary"
                >
                    {nav.links.map((link) => {
                        const isActive =
                            pathname === link.href ||
                            (link.href === "/hostels" &&
                                (pathname === "/hostels" || pathname?.includes("hostel"))) ||
                            (link.href === "/real-stories" &&
                                (pathname === "/real-stories" || pathname?.includes("real-stories")));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-mono uppercase text-[11px] lg:text-[12px] xl:text-[13px] leading-none tracking-[2px] transition-opacity hover:opacity-70 ${isDark ? "text-white" : "text-ink"
                                    } ${isActive ? "underline underline-offset-8 decoration-1" : ""}`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop CTA (Pill Button with Arrow - Right) */}
                <div className="hidden lg:flex items-center justify-end shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsEnquiryOpen(true)}
                        className={`font-mono uppercase text-[11px] lg:text-[12px] leading-none tracking-[2px] inline-flex items-center gap-2 rounded-full border px-5 py-2.5 lg:px-6 lg:py-2.5 transition-colors duration-200 cursor-pointer ${desktopCtaClasses}`}
                    >
                        <span className="uppercase">{nav.cta.label}</span>
                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>

                {/* Mobile & Tablet Controls: ENQUIRE Button + 2-Line Hamburger */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsEnquiryOpen(true)}
                        className={`font-mono uppercase text-[11px] sm:text-[12px] leading-none tracking-[1.5px] inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 transition-colors duration-200 active:scale-95 cursor-pointer ${mobileCtaClasses}`}
                    >
                        <span>{nav.cta.label}</span>
                        <ArrowRight className="h-3 w-3" />
                    </button>

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
            </div>

            {/* Dimmed page backdrop for mobile menu */}
            <div
                aria-hidden="true"
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-[60] bg-black/45 transition-opacity duration-300 lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Mobile & tablet side menu */}
            <aside
                id="mobile-nav-menu"
                aria-hidden={!open}
                className={`fixed inset-y-0 right-0 z-[70] flex w-[82vw] max-w-[420px] flex-col bg-black px-5 pb-7 pt-6 text-white transition-transform duration-300 ease-out sm:px-8 lg:hidden ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="mt-8 mb-7 flex items-center justify-between">
                    <Link href="/" aria-label="Aurus home" className="flex items-center shrink-0">
                        <Image
                            src={assets.logo2}
                            alt="Aurus Luxury Student Residences"
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
                        className="rounded-full border border-white/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[1.5px]"
                    >
                        Close
                    </button>
                </div>

                <nav aria-label="Primary mobile" className="flex flex-col">
                    {navmenu.links.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            tabIndex={open ? 0 : -1}
                            onClick={() => setOpen(false)}
                            className="flex items-end gap-3 border-b border-white/20 py-3 font-sans font-light text-white/80 uppercase tracking-[1px] transition-opacity hover:opacity-60"
                        >
                            <span className="text-[18px] mb-1.5">
                                {String(index + 1).padStart(2, "0")}.
                            </span>
                            <span className="text-[28px] whitespace-nowrap">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col items-end pb-8">
                    {/* <button
                        type="button"
                        tabIndex={open ? 0 : -1}
                        onClick={() => {
                            setOpen(false);
                            setIsEnquiryOpen(true);
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-[10px] uppercase tracking-[1px] text-black transition-colors hover:bg-neutral-200 cursor-pointer"
                    >
                        <span>{nav.cta.label}</span>
                        <ArrowRight className="h-3 w-3" />
                    </button> */}

                    <a
                        href="tel:+9118005720709"
                        className="mt-3 text-right font-sans font-light text-white/80 text-[16px] tracking-[1px] transition-opacity hover:opacity-60"
                    >
                        Toll-free: 1800-572-0709
                    </a>
                    <a
                        href="mailto:info@auruslife.com"
                        className="text-right font-sans font-light text-white/80 text-[16px] tracking-[1px] transition-opacity hover:opacity-60"
                    >
                        info@auruslife.com
                    </a>
                </div>
            </aside>

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={isEnquiryOpen}
                onClose={() => setIsEnquiryOpen(false)}
            />
        </header>
    );
}
