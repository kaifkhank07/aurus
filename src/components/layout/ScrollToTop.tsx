"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!btnRef.current) return;

        const animation = gsap.to(btnRef.current, {
            y: -12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            duration: 2,
        });

        return () => {
            animation.kill();
        };
    }, []);

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
            ref={btnRef}
            onClick={scrollToTop}
            className="fixed bottom-2 md:bottom-3 right-6 z-50 p-3 rounded-full text-[#B58A62] border border-[#B58A62] cursor-pointer hover:text-[#8B5E3C] hover:border-[#8B5E3C] transition-all duration-300"
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </button>
    );
}