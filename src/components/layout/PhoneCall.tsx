"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { componyInfoData, useAssets } from "@/data";

export default function PhoneCall() {
  const btnRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const assets = useAssets();

  const NUMBER = componyInfoData.mobile


  useEffect(() => {
    if (!btnRef.current || !pulseRef.current) return;

    const ctx = gsap.context(() => {
      // Floating animation (same as WhatsApp).
      gsap.to(btnRef.current, {
        y: -12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 2,
      });

      // Existing pulse animation.
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
    <Link href={`tel:${NUMBER}`} aria-label="Call">
      <div
        ref={btnRef}
        className="fixed bottom-31 md:bottom-34 right-6 aspect-square z-50 rounded-full shadow-lg cursor-pointer hover:opacity-80 transition-opacity duration-300"
      >
        <div
          ref={pulseRef}
          className="absolute inset-0 rounded-full bg-[#01C501]/25"
        />

        <div className="relative p-3 bg-[#01C501] rounded-full shadow-lg cursor-pointer">
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
