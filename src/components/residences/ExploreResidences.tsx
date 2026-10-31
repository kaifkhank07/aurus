"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { exploreResidences, type ExploreResidenceItem } from "@/data/residences";
import { ArrowRight, Container, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { useMasterStore } from "@/store/useMasterStore";

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Formats tenantType array into user-facing occupancy badge string.
 */
function formatOccupancyBadge(tenantType: string[] = []): string {
  if (!Array.isArray(tenantType) || tenantType.length === 0) {
    return "Co-ed Living";
  }
  const normalized = tenantType.map((t) => String(t).toLowerCase());
  if (
    normalized.includes("co-ed") ||
    normalized.includes("coed") ||
    (normalized.includes("girls") && normalized.includes("boys"))
  ) {
    return "Co-ed Living";
  }
  if (normalized.includes("girls")) {
    return "Girls Only";
  }
  if (normalized.includes("boys")) {
    return "Boys Only";
  }
  return "Co-ed Living";
}

export function ExploreResidences() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedGender, setSelectedGender] = useState(
    "All Wings (Girls / Boys / Co-ed)"
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState("All Occupancies");
  const [hasFetched, setHasFetched] = useState(false);

  // Store data hooks
  const {
    publicHostels,
    isLoadingPublicHostels,
    publicHostelsError,
    fetchPublicHostels,
  } = useHostelAndEnquiryStore();

  const {
    publicCities,
    publicOccupancies,
    fetchPublicCities,
    fetchPublicOccupancies,
  } = useMasterStore();

  // Fetch public data on mount
  useEffect(() => {
    fetchPublicHostels().finally(() => setHasFetched(true));
    fetchPublicCities();
    fetchPublicOccupancies();
  }, [fetchPublicHostels, fetchPublicCities, fetchPublicOccupancies]);

  // Dynamic City options
  const cityOptions = useMemo(() => {
    const set = new Set<string>();
    publicCities.forEach((c) => {
      if (c.isActive !== false) {
        const name = c.name || c.city;
        if (name) set.add(name);
      }
    });
    publicHostels.forEach((h) => {
      const cityName =
        typeof h.location?.city === "object" && h.location?.city !== null
          ? (h.location.city as { city?: string; name?: string }).city ||
          (h.location.city as { city?: string; name?: string }).name
          : typeof h.location?.city === "string"
            ? h.location.city
            : undefined;
      if (cityName) set.add(cityName);
    });
    return ["All Cities", ...Array.from(set)];
  }, [publicCities, publicHostels]);

  // Dynamic Gender Wing options
  const genderWingOptions = useMemo(() => {
    const wings = new Set<string>(["Girls Only", "Boys Only", "Co-ed Living"]);
    publicHostels.forEach((h) => {
      const badge = formatOccupancyBadge(h.tenantType);
      if (badge) wings.add(badge);
    });
    return ["All Wings (Girls / Boys / Co-ed)", ...Array.from(wings)];
  }, [publicHostels]);

  // Dynamic Occupancy options from master store
  const occupancyOptions = useMemo(() => {
    const list = publicOccupancies
      .filter((occ) => occ.isActive !== false)
      .map((occ) => occ.name)
      .filter(Boolean);
    return ["All Occupancies", ...Array.from(new Set(list))];
  }, [publicOccupancies]);

  // Map public hostels to ExploreResidenceItem format
  const dynamicItems: ExploreResidenceItem[] = useMemo(() => {
    return publicHostels.map((hostel) => {
      // 1. City Name
      let cityName = "";
      if (typeof hostel.location?.city === "object" && hostel.location?.city !== null) {
        cityName =
          (hostel.location.city as { city?: string; name?: string }).city ||
          (hostel.location.city as { city?: string; name?: string }).name ||
          "";
      } else if (typeof hostel.location?.city === "string") {
        cityName = hostel.location.city;
      }

      // 2. Locality Name
      let localityName = "";
      if (typeof hostel.location?.locality === "object" && hostel.location?.locality !== null) {
        localityName = (hostel.location.locality as { name?: string }).name || "";
      } else if (typeof hostel.location?.locality === "string") {
        localityName = hostel.location.locality;
      }

      // 3. Locality display text
      const localityText =
        localityName && cityName
          ? `${localityName} · ${cityName}`
          : localityName || cityName || "Prime Location";

      // 4. Room occupancy matching from master store
      let matchedOccupancy = "";
      if (publicOccupancies && publicOccupancies.length > 0) {
        for (const occ of publicOccupancies) {
          const occNameLower = occ.name.toLowerCase();
          if (
            hostel.title?.toLowerCase().includes(occNameLower) ||
            hostel.subtitle?.toLowerCase().includes(occNameLower) ||
            hostel.description?.toLowerCase().includes(occNameLower)
          ) {
            matchedOccupancy = occ.name;
            break;
          }
        }
      }
      const roomOccupancy =
        matchedOccupancy || publicOccupancies[0]?.name || "Single Occupancy";

      // 5. Image
      const image =
        hostel.frontImage?.url ||
        hostel.galleryImages?.[0]?.url ||
        hostel.firstImage?.url ||
        "/images/image03.png";

      // 6. Colleges / Keywords
      const colleges = Array.isArray(hostel.metadata?.keywords)
        ? hostel.metadata.keywords
        : [];

      return {
        id: hostel.id || (hostel._id ? String(hostel._id) : hostel.slug),
        _id: hostel._id ? String(hostel._id) : hostel.id,
        slug: hostel.slug,
        name: hostel.title || "Residence",
        occupancy: formatOccupancyBadge(hostel.tenantType),
        roomOccupancy,
        city: cityName,
        featured: true,
        locality: localityText,
        distance:
          hostel.subtitle ||
          hostel.location?.address ||
          (cityName ? `Prime location in ${cityName}` : "Prime location"),
        priceFrom: hostel.rent
          ? `₹${Number(hostel.rent).toLocaleString("en-IN")}`
          : "₹50,000",
        href: `/residences/${hostel.slug || hostel.id}`,
        image,
        colleges,
      };
    });
  }, [publicHostels, publicOccupancies]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All Cities");
    setSelectedGender("All Wings (Girls / Boys / Co-ed)");
    setSelectedOccupancy("All Occupancies");
  };

  const filteredItems = useMemo(() => {
    return dynamicItems.filter((item) => {
      // Search text filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (item.name || "").toLowerCase().includes(query);
        const matchesLocality = (item.locality || "").toLowerCase().includes(query);
        const matchesDistance = (item.distance || "").toLowerCase().includes(query);
        const matchesCity = (item.city || "").toLowerCase().includes(query);
        const matchesColleges = item.colleges?.some((college) =>
          college.toLowerCase().includes(query)
        );

        if (
          !matchesName &&
          !matchesLocality &&
          !matchesDistance &&
          !matchesCity &&
          !matchesColleges
        ) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== "All Cities") {
        const selCity = selectedCity.toLowerCase();
        const itemCity = (item.city || "").toLowerCase();
        const itemLocality = (item.locality || "").toLowerCase();
        if (itemCity !== selCity && !itemLocality.includes(selCity)) {
          return false;
        }
      }

      // Gender Wing filter
      if (selectedGender !== "All Wings (Girls / Boys / Co-ed)") {
        if (item.occupancy !== selectedGender) {
          return false;
        }
      }

      // Occupancy Option filter
      if (selectedOccupancy !== "All Occupancies") {
        const occLower = selectedOccupancy.toLowerCase();
        const itemOccLower = (item.roomOccupancy || "").toLowerCase();
        const matchesOcc =
          itemOccLower === occLower ||
          itemOccLower.includes(occLower) ||
          occLower.includes(itemOccLower) ||
          (item.name || "").toLowerCase().includes(occLower) ||
          (item.distance || "").toLowerCase().includes(occLower);
        if (!matchesOcc) {
          return false;
        }
      }

      return true;
    });
  }, [dynamicItems, searchQuery, selectedCity, selectedGender, selectedOccupancy]);

  const isLoading = isLoadingPublicHostels || (!hasFetched && publicHostels.length === 0);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Heading & Subtitle */}
        <div className="">
          <Heading
            title1={exploreResidences.titleTop}
            title2={exploreResidences.titleAccent}
            className="uppercase max-w-[28ch] sm:max-w-none"
          />
          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[56ch] lg:max-w-[43ch] font-sans font-normal text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.4] tracking-[-0.03em] text-muted">
            {exploreResidences.body}
          </p>
        </div>

        {/* Filter Bar */}
        <ViewReveal duration={800}>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.3fr_1fr_auto] gap-3.5 sm:gap-4 items-end p-4 sm:p-5 lg:p-6 rounded-[20px] border border-ink/10 bg-[#FAF8F5]">
            {/* Field 1: Search */}
            <div className="w-full">
              <label
                htmlFor="search-residences"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                SEARCH
              </label>
              <input
                id="search-residences"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by locality, college (NMIMS, Amity, Symbiosis) or chapter..."
                className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 text-[13px] text-ink placeholder:text-[#88847c]/70 placeholder:text-[11.5px] sm:placeholder:text-[12.5px] outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
              />
            </div>

            {/* Field 2: City */}
            <div className="w-full">
              <label
                htmlFor="filter-city"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                CITY
              </label>
              <div className="relative w-full">
                <select
                  id="filter-city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
              </div>
            </div>

            {/* Field 3: Gender Wing */}
            <div className="w-full">
              <label
                htmlFor="filter-gender"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                GENDER WING
              </label>
              <div className="relative w-full">
                <select
                  id="filter-gender"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
                >
                  {genderWingOptions.map((wing) => (
                    <option key={wing} value={wing}>
                      {wing}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
              </div>
            </div>

            {/* Field 4: Occupancy Option */}
            <div className="w-full">
              <label
                htmlFor="filter-occupancy"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                OCCUPANCY OPTION
              </label>
              <div className="relative w-full">
                <select
                  id="filter-occupancy"
                  value={selectedOccupancy}
                  onChange={(e) => setSelectedOccupancy(e.target.value)}
                  className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
                >
                  {occupancyOptions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
              </div>
            </div>

            {/* Action: Reset Filters */}
            <div className="mt-1 md:mt-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={resetFilters}
                className="flex h-[46px] w-full lg:w-auto items-center justify-center rounded-full border border-ink/30 px-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[2px] text-ink transition-colors duration-200 hover:bg-ink hover:text-white cursor-pointer whitespace-nowrap"
              >
                RESET FILTERS
              </button>
            </div>
          </div>
        </ViewReveal>

        {/* Counter Summary */}
        <p className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] text-[#88847c] mt-6 mb-4 lg:mt-0 lg:mb-6">
          {isLoading
            ? "LOADING RESIDENCES..."
            : `SHOWING ${String(filteredItems.length).padStart(2, "0")} RESIDENCES`}
        </p>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
            <p className="font-sans text-[16px] text-muted">
              Loading residences...
            </p>
          </div>
        ) : publicHostelsError ? (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
            <p className="font-sans text-[16px] text-muted">
              {publicHostelsError}
            </p>
            <button
              type="button"
              onClick={() => fetchPublicHostels({ limit: 100 }, true)}
              className="mt-4 font-mono text-[11px] uppercase tracking-[2px] text-ink border-b border-ink/40 pb-0.5 hover:border-ink transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => (
              <ResidenceCard
                key={item.id || item._id || item.slug || item.name}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
            <p className="font-sans text-[16px] text-muted">
              No residences found matching your filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 font-mono text-[11px] uppercase tracking-[2px] text-ink border-b border-ink/40 pb-0.5 hover:border-ink transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}

export function ResidenceCard({ item }: { item: ExploreResidenceItem }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-ink/10 bg-[#faf8f4] transition-all duration-300 hover:border-ink/25 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Residence Image */}
      <div className="relative aspect-[373/220] w-full shrink-0 overflow-hidden rounded-t-[14px]">
        <Figure
          src={item.image}
          alt={`${item.name} residence interior`}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 90vw"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Occupancy Badge */}
        <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute left-4 top-4 rounded-full bg-[#faf8f4] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
          {item.occupancy}
        </span>

        {/* Featured Badge */}
        {/* {item.featured && (
          <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute right-4 top-4 rounded-full bg-[#d8c89b] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
            Featured
          </span>
        )} */}
      </div>

      {/* Residence Details */}
      <div className="flex flex-1 flex-col px-5 pb-3 pt-4">
        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] text-[9px] uppercase tracking-[0.24em] text-[#88847c]">
          {item.locality}
        </p>

        <h3 className="mt-2 text-[clamp(27px,3vw,36px)] font-light uppercase leading-[1.05] tracking-[-0.055em] text-ink">
          {item.name}
        </h3>

        <p className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] mt-2 text-[9px] uppercase tracking-[0.08em] text-[#88847c]">
          {item.distance}
        </p>

        {/* Price and Action */}
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
          <div className="min-w-0">
            <span className="block text-[10px] uppercase text-[#88847c] tracking-[0.04em] font-light">
              Starts from
            </span>

            <span className="mt-0.5 block whitespace-nowrap text-[17px] font-medium leading-none tracking-[-0.04em] text-ink">
              {item.priceFrom}
              <span className="ml-1 text-[9px] font-normal tracking-normal text-[#88847c]">
                /mo
              </span>
            </span>
          </div>

          <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] inline-flex shrink-0 items-center gap-2 rounded-full border-b-2 border-ink/30 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-[#77736c] transition-colors group-hover:bg-ink group-hover:text-[#faf8f4]">
            View Residence
            <ArrowRight />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ExploreResidences;
