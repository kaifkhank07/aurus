"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { componyInfoData, useAssets } from "@/data";

export default function WhatsApp() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const assets = useAssets();

    const NUMBER = componyInfoData.whatsapp;
    const MESSAGE = componyInfoData.defaultWhatsAppMessage;

    useEffect(() => {
        if (!btnRef.current) return;

        gsap.to(btnRef.current, {
            y: -12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            duration: 2,
        });
    }, []);

    const openChat = () => {
        const url = `https://wa.me/${NUMBER}?text=${encodeURIComponent(
            MESSAGE
        )}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            ref={btnRef}
            onClick={openChat}
            className="fixed bottom-16 md:bottom-18 right-6 z-50 bg-[#01C501] text-white p-3 rounded-full shadow-lg cursor-pointer hover:opacity-80 transition-opacity duration-300"
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
