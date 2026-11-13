"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { Heading } from "@/components/utils/Heading";
import { ViewReveal } from "@/components/animation";
import { PublicCity } from "@/types/city.types";
import {
  generateCityFooterLinkColumns,
  FooterLinkColumn,
} from "@/data/city/cityFooterLinks";
import { useCitySeoStore } from "@/store/useCitySeoStore";

interface CityFooterLinksProps {
  city?: PublicCity;
  citySlug?: string;
}

export function CityFooterLinks({
  city,
  citySlug,
}: CityFooterLinksProps) {
  const targetSlug = (citySlug || city?.slug || "mumbai").toLowerCase().trim();

  const {
    currentCity,
    localities,
    institutes,
    fetchCityLocalities,
    fetchCityInstitutes,
    fetchCityDetails,
  } = useCitySeoStore();

  useEffect(() => {
    if (targetSlug) {
      void fetchCityDetails(targetSlug);
      void fetchCityLocalities(targetSlug);
      void fetchCityInstitutes(targetSlug);
    }
  }, [targetSlug, fetchCityLocalities, fetchCityInstitutes, fetchCityDetails]);

  const activeCity = city || (currentCity?.slug?.toLowerCase() === targetSlug ? currentCity : null);
  const fallbackName = targetSlug
    ? targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1).replace(/-/g, " ")
    : "City";
  const cityName = activeCity?.name || activeCity?.city || fallbackName;

  // Strictly filter localities and institutes by the current city slug
  // Never show default or another city's data
  const citySpecificLocalities = useMemo(() => {
    return (localities || []).filter(
      (loc) => loc.citySlug?.toLowerCase() === targetSlug
    );
  }, [localities, targetSlug]);

  const citySpecificInstitutes = useMemo(() => {
    return (institutes || []).filter(
      (inst) => inst.citySlug?.toLowerCase() === targetSlug
    );
  }, [institutes, targetSlug]);

  const linkColumns: FooterLinkColumn[] = useMemo(() => {
    return generateCityFooterLinkColumns(
      cityName,
      targetSlug,
      citySpecificLocalities,
      citySpecificInstitutes
    );
  }, [cityName, targetSlug, citySpecificLocalities, citySpecificInstitutes]);

  const gridColsClass = useMemo(() => {
    const count = linkColumns.length;
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
  }, [linkColumns.length]);

  return (
    <section className="py-8 sm:py-12 lg:py-16 border-t border-ink/10">
      <Container className="space-y-6 sm:space-y-8 lg:space-y-10">
        <ViewReveal duration={800}>
          <Eyebrow>POPULAR SEARCHES · {cityName.toUpperCase()}</Eyebrow>
          <div className="mt-3 sm:mt-4">
            <Heading
              title1="Student Accommodation in"
              title2={`${cityName}.`}
              className="uppercase max-w-4xl"
              title1ClassName="text-[26px] sm:text-[34px] lg:text-[40px]"
              title2ClassName="text-[26px] sm:text-[34px] lg:text-[40px]"
            />
            <p className="mt-3 sm:mt-4 max-w-2xl font-sans font-normal text-[14px] sm:text-[16px] leading-[1.5] text-muted">
              Explore verified student residences, hostels, and PGs situated near leading campuses, transport links, and key student hubs across {cityName}.
            </p>
          </div>
        </ViewReveal>

        <ViewReveal duration={800} startDelay={100}>
          <div className={`grid gap-x-8 gap-y-8 lg:gap-x-6 lg:gap-y-0 pt-6 sm:pt-8 border-t border-ink/10 ${gridColsClass}`}>
            {linkColumns.map((item, index) => (
              <div key={index} className="min-w-0">
                <h3 className="mb-3 sm:mb-4 font-sans text-[15px] sm:text-[17px] font-medium leading-snug uppercase tracking-[-0.02em] text-ink pb-2 border-b border-ink/10">
                  {item.title}
                </h3>

                <ul className="flex flex-col gap-2 sm:gap-2.5">
                  {item.links.map((linkItem) => (
                    <li key={`${linkItem.href}-${linkItem.label}`}>
                      <Link
                        href={linkItem.href}
                        className="block w-fit font-sans text-[13px] sm:text-[14px] font-normal leading-[1.5] tracking-[-0.01em] text-muted transition-colors duration-200 hover:text-ink"
                      >
                        {linkItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ViewReveal>
      </Container>
    </section>
  );
}

export default CityFooterLinks;
