"use client";

import { useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export interface AnimatedImageProps extends ImageProps {
    /** Extra classes applied to the image container */
    containerClassName?: string;

    /** Animation duration in seconds */
    duration?: number;

    /** Distance the image moves from */
    distance?: number;

    /** Direction the image enters from */
    direction?: "up" | "down" | "left" | "right";

    /** Initial opacity */
    initialOpacity?: number;

    /** GSAP easing */
    ease?: string;

    /** ScrollTrigger start position */
    start?: string;

    /** If true, animation replays whenever image enters viewport */
    replayOnScroll?: boolean;
}

export default function AnimatedImage({
    containerClassName = "",
    duration = 1.4,
    distance = 15,
    direction = "up",
    initialOpacity = 0,
    ease = "power3.out",
    start = "top 90%",
    replayOnScroll = false,
    className = "object-cover",
    ...props
}: AnimatedImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const image = imageRef.current;

        if (!container || !image) return;

        const initialPosition = {
            xPercent: 0,
            yPercent: 0,
        };

        switch (direction) {
            case "up":
                initialPosition.yPercent = distance;
                break;

            case "down":
                initialPosition.yPercent = -distance;
                break;

            case "left":
                initialPosition.xPercent = distance;
                break;

            case "right":
                initialPosition.xPercent = -distance;
                break;
        }

        const ctx = gsap.context(() => {
            gsap.set(image, {
                ...initialPosition,
                opacity: initialOpacity,
            });

            gsap.to(image, {
                xPercent: 0,
                yPercent: 0,
                opacity: 1,
                duration,
                ease,
                scrollTrigger: {
                    trigger: container,
                    start,
                    toggleActions: replayOnScroll
                        ? "play reverse play reverse"
                        : "play none none none",
                },
            });
        }, container);

        return () => {
            ctx.revert();
        };
    }, [
        direction,
        distance,
        duration,
        initialOpacity,
        ease,
        start,
        replayOnScroll,
    ]);

    const isFill = Boolean(props.fill);

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${isFill ? "h-full" : ""} overflow-hidden ${containerClassName}`}
        >
            <div
                ref={imageRef}
                className="relative w-full h-full"
            >
                <Image
                    className={className}
                    {...props}
                />
            </div>
        </div>
    );
}