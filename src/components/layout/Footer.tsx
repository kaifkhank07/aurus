import Link from "next/link";
import Image from "next/image";
import { footer } from "@/data/footer";
import { Panel } from "@/components/ui/Primitives";
import { ViewReveal } from "../animation";

export function Footer() {
  return (
    // <footer className="pb-3 sm:pb-4 lg:pb-[1.6667vw]">
    <footer className="lg:pb-[1.6667vw]">
      <ViewReveal duration={800} startDelay={100}>
        <Panel
          className="bg-ink text-white rounded-t-[36px] sm:rounded-t-[48px] lg:rounded-[57px]"
          innerClassName="pt-12 sm:pt-16 lg:pt-[min(5vw,96px)] pb-16 sm:pb-20 lg:pb-[min(6vw,115px)] !px-5 sm:!px-8 lg:!px-[min(4.5313vw,87px)]"
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
          <p className="font-display italic font-normal tracking-[-0.03em] normal-case mt-6 sm:mt-8 lg:mt-10 text-[28px] sm:text-[38px] lg:text-[46px] leading-[1.15] text-white">
            {footer.tagline}
          </p>

          {/* Thin Divider Line */}
          <div className="w-full h-px bg-white/15 mt-8 sm:mt-10 lg:mt-12 mb-8 sm:mb-10 lg:mb-12" />

          {/* 4-Column Footer Navigation */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-8 xl:gap-12">
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
                {footer.columns[2].type === "links" &&
                  footer.columns[2].links.map((link) => (
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
        </Panel>
      </ViewReveal>
    </footer>
  );
}
