"use client";

import { useState, useMemo, useEffect } from "react";
import { Container } from "@/components/ui/Primitives";
import { ViewReveal } from "@/components/animation";
import { ResidenceCard } from "@/components/residences/ResidenceCard";
import { PublicCity } from "@/types/city.types";
import { SafeHostel } from "@/types/hostel.types";
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

interface CityResidenceContentProps {
  city: PublicCity;
  residences?: SafeHostel[];
}

const genderWingOptions = [
  "All Wings (Girls / Boys / Co-ed)",
  "Girls Only",
  "Boys Only",
  "Co-ed Living",
];

export function CityResidenceContent({
  city,
  residences = [],
}: CityResidenceContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState(
    "All Wings (Girls / Boys / Co-ed)"
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState("All Occupancies");

  const { publicOccupancies, fetchPublicOccupancies } = useMasterStore();

  useEffect(() => {
    if (publicOccupancies.length === 0) {
      void fetchPublicOccupancies();
    }
  }, [fetchPublicOccupancies, publicOccupancies.length]);

  const occupancyOptions = useMemo(() => {
    const dynamicNames = publicOccupancies
      .map((o) => o.name)
      .filter((n): n is string => Boolean(n));
    return ["All Occupancies", ...Array.from(new Set(dynamicNames))];
  }, [publicOccupancies]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGender("All Wings (Girls / Boys / Co-ed)");
    setSelectedOccupancy("All Occupancies");
  };

  const filteredItems = useMemo(() => {
    return residences.filter((hostel) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const title = (hostel.title || "").toLowerCase();
        const subtitle = (hostel.subtitle || "").toLowerCase();
        const address = (hostel.location?.address || "").toLowerCase();

        const localityName =
          typeof hostel.location?.locality === "object" && hostel.location?.locality !== null
            ? (hostel.location.locality.name || "").toLowerCase()
            : typeof hostel.location?.locality === "string"
            ? hostel.location.locality.toLowerCase()
            : "";

        const keywords = Array.isArray(hostel.metadata?.keywords)
          ? hostel.metadata.keywords.map((k) => (k || "").toLowerCase())
          : [];

        const combinedText = [title, subtitle, address, localityName, ...keywords].join(" ");
        if (!combinedText.includes(query)) {
          return false;
        }
      }

      // 2. Gender Wing Filter
      if (selectedGender !== "All Wings (Girls / Boys / Co-ed)") {
        const tenant = (hostel.tenantType || "").toLowerCase().trim();
        if (selectedGender === "Girls Only" && tenant !== "girls") return false;
        if (selectedGender === "Boys Only" && tenant !== "boys") return false;
        if (selectedGender === "Co-ed Living" && tenant !== "co-ed") return false;
      }

      // 3. Occupancy Filter
      if (selectedOccupancy !== "All Occupancies") {
        const occQuery = selectedOccupancy.toLowerCase().trim();
        const occupancies = Array.isArray(hostel.occupancy) ? hostel.occupancy : [];
        const matchesOcc = occupancies.some((occ) => {
          if (typeof occ === "object" && occ !== null) {
            const occName = (occ.name || "").toLowerCase().trim();
            return (
              occName === occQuery ||
              occName.includes(occQuery) ||
              occQuery.includes(occName)
            );
          }
          if (typeof occ === "string") {
            const occStr = occ.toLowerCase().trim();
            return (
              occStr === occQuery ||
              occStr.includes(occQuery) ||
              occQuery.includes(occStr)
            );
          }
          return false;
        });
        if (!matchesOcc) return false;
      }

      return true;
    });
  }, [residences, searchQuery, selectedGender, selectedOccupancy]);

  const cityName = city.name || city.city || "City";

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Filter Bar */}
        <ViewReveal duration={800}>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1.3fr_1.3fr_auto] gap-3.5 sm:gap-4 items-end p-4 sm:p-5 lg:p-6 rounded-[20px] border border-ink/10 bg-[#FAF8F5]">
            {/* Field 1: Search */}
            <div className="w-full">
              <label
                htmlFor="search-city-residences"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                SEARCH IN {cityName.toUpperCase()}
              </label>
              <input
                id="search-city-residences"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search by locality or chapter in ${cityName}...`}
                className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 text-[13px] text-ink placeholder:text-[#88847c]/70 placeholder:text-[11.5px] sm:placeholder:text-[12.5px] outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
              />
            </div>

            {/* Field 2: Gender Wing */}
            <div className="w-full">
              <label
                htmlFor="filter-city-gender"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                GENDER WING
              </label>
              <div className="relative w-full">
                <select
                  id="filter-city-gender"
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

            {/* Field 3: Room Occupancy */}
            <div className="w-full">
              <label
                htmlFor="filter-city-occupancy"
                className="font-mono uppercase text-[10px] sm:text-[11px] tracking-[2px] text-[#88847c] font-medium block mb-2"
              >
                OCCUPANCY OPTION
              </label>
              <div className="relative w-full">
                <select
                  id="filter-city-occupancy"
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
          SHOWING {String(filteredItems.length).padStart(2, "0")}{" "}
          {filteredItems.length === 1 ? "RESIDENCE" : "RESIDENCES"} IN {cityName.toUpperCase()}
        </p>

        {/* Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => (
              <ResidenceCard
                key={item.id || item._id || item.slug}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
            <p className="font-sans text-[16px] text-muted">
              No residences found matching your filters in {cityName}.
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

export default CityResidenceContent;

