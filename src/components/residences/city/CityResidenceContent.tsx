"use client";

import { useMemo, useState } from "react";
import { type ExploreResidenceItem } from "@/data/residences";
import { Container } from "@/components/ui/Primitives";
import { ViewReveal } from "@/components/animation";
import { ResidenceCard } from "@/components/residences/ExploreResidences";
import { UpcomingChapters } from "@/components/residences/UpcomingChapters";
import { LifeAtAurus } from "@/components/residences/LifeAtAurus";
import { CitySummary } from "@/lib/residences/city";
import { CityHero } from "./CityHero";
import { CityIntroduction } from "./CityIntroduction";

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
  city: CitySummary;
  initialItems: ExploreResidenceItem[];
}

export function CityResidenceContent({
  city,
  initialItems,
}: CityResidenceContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState(
    "All Wings (Girls / Boys / Co-ed)"
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState("All Occupancies");

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGender("All Wings (Girls / Boys / Co-ed)");
    setSelectedOccupancy("All Occupancies");
  };

  const genderWingOptions = useMemo(() => {
    const wings = new Set<string>(["Girls Only", "Boys Only", "Co-ed Living"]);
    initialItems.forEach((item) => {
      if (item.occupancy) wings.add(item.occupancy);
    });
    return ["All Wings (Girls / Boys / Co-ed)", ...Array.from(wings)];
  }, [initialItems]);

  const occupancyOptions = useMemo(() => {
    const list = new Set<string>();
    initialItems.forEach((item) => {
      if (item.roomOccupancy) list.add(item.roomOccupancy);
    });
    if (list.size === 0) {
      list.add("Single Occupancy");
      list.add("Double Sharing");
      list.add("Triple Sharing");
    }
    return ["All Occupancies", ...Array.from(list)];
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Search text filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesLocality = item.locality.toLowerCase().includes(query);
        const matchesDistance = item.distance.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
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

      // Gender Wing filter
      if (selectedGender !== "All Wings (Girls / Boys / Co-ed)") {
        if (item.occupancy !== selectedGender) {
          return false;
        }
      }

      // Occupancy Option filter
      if (selectedOccupancy !== "All Occupancies") {
        if (item.roomOccupancy !== selectedOccupancy) {
          return false;
        }
      }

      return true;
    });
  }, [initialItems, searchQuery, selectedGender, selectedOccupancy]);

  return (
    <main>
      {/* Dynamic City Hero */}
      <CityHero city={city} />

      {/* Dynamic City Introduction */}
      {/* <CityIntroduction city={city} /> */}

      {/* Dynamic Filter Bar & Residences Grid */}
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
                  SEARCH IN {city.name.toUpperCase()}
                </label>
                <input
                  id="search-city-residences"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search by locality or chapter in ${city.name}...`}
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
            SHOWING {String(filteredItems.length).padStart(2, "0")} {filteredItems.length === 1 ? "RESIDENCE" : "RESIDENCES"} IN {city.name.toUpperCase()}
          </p>

          {/* Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredItems.map((item) => (
                <ResidenceCard key={item.id || item._id || item.slug || item.name} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
              <p className="font-sans text-[16px] text-muted">
                No residences found matching your filters in {city.name}.
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

      {/* Aurus Sections */}
      <UpcomingChapters />
      <LifeAtAurus />
    </main>
  );
}

export default CityResidenceContent;

