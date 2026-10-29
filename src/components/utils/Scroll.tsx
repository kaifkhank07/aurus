"use client";

import { useCallback } from "react";

export function useScrollNavigation() {
    const handleScroll = useCallback(
        (
            e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
            href: string
        ) => {
            if (!href.startsWith("#") || href.length <= 1) return;

            const targetId = href.slice(1);
            const element = document.getElementById(targetId);

            if (!element) return;

            // Prevent URL hash changes and default navigation.
            e.preventDefault();

            element.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
                block: "start",
            });
        },
        []
    );

    return { handleScroll };
}