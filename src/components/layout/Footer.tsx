"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { footer } from "@/data/layout";
import { Panel } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";
import { usePublicOptions } from "@/store/usePublicOptions";

export function Footer() {
  const { residenceCities, isFetched, fetchResidenceCities } = usePublicOptions();

  useEffect(() => {
    if (!isFetched) {
      fetchResidenceCities();
    }
  }, [isFetched, fetchResidenceCities]);

  return (
    // <footer className="pb-3 sm:pb-4 lg:pb-[1.6667vw]">
    <footer className="pt-2 sm:pt-4 lg:py-6">
      <ViewReveal duration={800}>
        <Panel
          className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px]"
          innerClassName="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-[min(4.9vw,95px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)] space-y-4 sm:space-y-8 lg:space-y-12"
        >
          {/* Top: Logo Lockup */}
          <Link href="/" aria-label="Aurus home" className="inline-block group">
            <div className="flex flex-col items-start">
              <Image
                src="/images/logo.png"
                alt="Aurus"
                width={130}
                height={28}
                priority
                className="brightness-0 invert w-[115px] sm:w-[130px] h-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              />
            </div>
          </Link>

          {/* Tagline: Italic Serif */}
          <p className="font-display italic font-normal tracking-[-0.03em] normal-case text-[28px] sm:text-[38px] lg:text-[46px] leading-[1.15] text-white">
            {footer.tagline}
          </p>

          {/* 4-Column Footer Navigation */}
          <div className="w-full grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8 xl:gap-12 py-8 sm:py-10 lg:py-12 border-t border-b border-white/15">
            {/* Column 1: Aurus Headquarters */}
            <div className="col-span-1 sm:col-span-3 lg:col-span-2">
              <h3 className="font-mono uppercase text-[12px] sm:text-[14px] leading-[1.7] tracking-[2px] text-white font-medium mb-4 sm:mb-5 lg:mb-6">
                AURUS HEADQUARTERS
              </h3>
              <div className="flex flex-col gap-2 font-mono uppercase text-[12px] sm:text-[14px] leading-[1.8] tracking-[1.5px] text-white/55">
                <p>ANDHERI EAST, MUMBAI, MAHARASHTRA 400069</p>
                <p>
                  TOLL-FREE:{" "}
                  <a
                    href="tel:18005720709"
                    className="hover:text-white transition-colors duration-200"
                  >
                    1800-572-0709
                  </a>
                </p>
                <p>
                  EMAIL:{" "}
                  <a
                    href="mailto:info@auruslife.com"
                    className="hover:text-white transition-colors duration-200"
                  >
                    INFO@AURUSLIFE.COM
                  </a>
                </p>
              </div>
            </div>

            {/* Column 2: Discover */}
            <div>
              <h3 className="font-mono uppercase text-[12px] sm:text-[14px] leading-[1.7] tracking-[2px] text-white font-medium mb-4 sm:mb-5 lg:mb-6">
                DISCOVER
              </h3>
              <ul className="flex flex-col gap-2 font-mono uppercase text-[12px] sm:text-[14px] leading-[1.8] tracking-[1.5px]">
                {footer.columns[1].type === "links" &&
                  footer.columns[1].links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white/55 hover:text-white transition-colors duration-200 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Column 3: Our Residences */}
            <div>
              <h3 className="font-mono uppercase text-[12px] sm:text-[14px] leading-[1.7] tracking-[2px] text-white font-medium mb-4 sm:mb-5 lg:mb-6">
                OUR RESIDENCES
              </h3>
              <ul className="flex flex-col gap-2 font-mono uppercase text-[12px] sm:text-[14px] leading-[1.8] tracking-[1.5px]">
                {residenceCities.map((city) => (
                  <li key={city._id}>
                    <Link
                      href={`/residences/${city.slug}`}
                      className="text-white/55 hover:text-white transition-colors duration-200 block"
                    >
                      {`Residences in ${city.name}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Concierge Hours */}
            <div>
              <h3 className="font-mono uppercase text-[12px] sm:text-[14px] leading-[1.7] tracking-[2px] text-white font-medium mb-4 sm:mb-5 lg:mb-6">
                CONCIERGE HOURS
              </h3>
              <div className="font-mono text-[12px] sm:text-[14px] leading-[1.8] tracking-[1px] text-white/55 max-w-[28ch]">
                <p>
                  Concierge desk active 10:00 AM – 7:00 PM daily. On-site resident
                  wardens 24/7.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-4 justify-between items-center">
            <p className="font-mono uppercase text-[12px] sm:text-[14px] leading-[1.8] tracking-[1px] text-white/55 font-light">
              © 2026 Aurus Life · A Colstay Limited brand
            </p>

            <div className="flex gap-3 sm:gap-6 font-mono uppercase text-[12px] sm:text-[14px] leading-[1.8] tracking-[1.5px] text-white/55 font-light">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/refund">Refund</Link>
            </div>
          </div>
        </Panel>
      </ViewReveal>
    </footer>
  );
}

export default Footer;
