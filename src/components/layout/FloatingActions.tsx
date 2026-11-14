"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { componyInfoData, useAssets } from "@/data";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";


function PhoneCall() {
    const pulseRef = useRef<HTMLDivElement>(null);
    const assets = useAssets();

    const NUMBER = componyInfoData.mobile;

    useEffect(() => {
        if (!pulseRef.current) return;

        const ctx = gsap.context(() => {
            // Pulse animation.
            gsap.to(pulseRef.current, {
                scale: 1.2,
                opacity: 0.5,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <Link href={`tel:${NUMBER}`} aria-label="Call" className="block relative">
            <div className="relative aspect-square rounded-full shadow-lg cursor-pointer hover:opacity-80 transition-opacity duration-300">
                <div
                    ref={pulseRef}
                    className="absolute inset-0 rounded-full bg-[#01C501]/25"
                />

                <div className="relative p-3 bg-[#01C501] rounded-full shadow-lg cursor-pointer flex items-center justify-center">
                    <Image
                        src={assets.phonecall}
                        width={30}
                        height={30}
                        alt="Call Icon"
                    />
                </div>
            </div>
        </Link>
    );
}

function WhatsApp() {
    const assets = useAssets();

    const NUMBER = componyInfoData.whatsapp;
    const MESSAGE = componyInfoData.defaultWhatsAppMessage;

    const openChat = () => {
        const url = `https://wa.me/${NUMBER}?text=${encodeURIComponent(
            MESSAGE
        )}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            type="button"
            onClick={openChat}
            className="bg-[#01C501] text-white p-3 rounded-full shadow-lg cursor-pointer hover:opacity-80 transition-opacity duration-300 flex items-center justify-center"
            aria-label="WhatsApp"
        >
            <Image
                src={assets.whatsapp}
                width={30}
                height={30}
                alt="WhatsApp Icon"
            />
        </button>
    );
}

function ScrollToTop() {
    const scrollToTop = () => {
        const win = window as typeof window & {
            lenis?: {
                scrollTo: (
                    target: number,
                    options?: { duration?: number }
                ) => void;
            };
        };

        if (win.lenis) {
            win.lenis.scrollTo(0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className="p-3 rounded-full text-[#B58A62] border border-[#B58A62] bg-[#FAF8F5]/90 backdrop-blur-xs cursor-pointer hover:text-[#8B5E3C] hover:border-[#8B5E3C] hover:bg-[#FAF8F5] transition-all duration-300 flex items-center justify-center shadow-md"
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </button>
    );
}


export default function FloatingActions() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.to(containerRef.current, {
                y: -12,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                duration: 2,
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-center gap-3 select-none pointer-events-auto"
        >
            <PhoneCall />
            <WhatsApp />
            <ScrollToTop />
        </div>
    );
}
