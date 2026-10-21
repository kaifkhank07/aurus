"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { exploreResidences, type ExploreResidenceItem } from "@/data/exploreResidences";
import { ArrowRight, Container, Figure } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ViewReveal } from "../animation";

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

export function ExploreResidences() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedGender, setSelectedGender] = useState(
    "All Wings (Girls / Boys / Co-ed)"
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState("All Occupancies");

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All Cities");
    setSelectedGender("All Wings (Girls / Boys / Co-ed)");
    setSelectedOccupancy("All Occupancies");
  };

  const filteredItems = useMemo(() => {
    return exploreResidences.items.filter((item) => {
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

      // City filter
      if (selectedCity !== "All Cities") {
        if (
          item.city.toLowerCase() !== selectedCity.toLowerCase() &&
          !item.locality.toLowerCase().includes(selectedCity.toLowerCase())
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
  }, [searchQuery, selectedCity, selectedGender, selectedOccupancy]);

  return (
    <section className="pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-[min(4.5vw,86px)] lg:pb-[min(8vw,150px)]">
      <Container>
        {/* Heading & Subtitle */}
        <ViewReveal duration={800}>
          <div>
            <Heading
              title1={exploreResidences.titleTop}
              title2={exploreResidences.titleAccent}
              className="uppercase"
            />
            <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[56ch] font-sans font-normal text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.4] tracking-[-0.03em] text-muted">
              {exploreResidences.body}
            </p>
          </div>
        </ViewReveal>

        {/* Filter Bar */}
        <ViewReveal duration={800} startDelay={100}>
          <div className="mt-8 sm:mt-10 lg:mt-12 rounded-[20px] sm:rounded-[24px] border border-ink/10 bg-[#faf8f4] p-4 sm:p-5 lg:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.3fr_1fr_auto] gap-3.5 sm:gap-4 items-end">
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
                  className="w-full h-[46px] rounded-xl border border-ink/15 bg-white/75 px-4 text-[13px] text-ink placeholder:text-[#88847c]/70 placeholder:text-[11.5px] sm:placeholder:text-[12.5px] outline-none transition-all duration-200 focus:border-ink/50 focus:bg-white"
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
                    className="w-full h-[46px] rounded-xl border border-ink/15 bg-white/75 px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-white"
                  >
                    {exploreResidences.cities.map((city) => (
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
                    className="w-full h-[46px] rounded-xl border border-ink/15 bg-white/75 px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-white"
                  >
                    {exploreResidences.genderWings.map((wing) => (
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
                    className="w-full h-[46px] rounded-xl border border-ink/15 bg-white/75 px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-white"
                  >
                    {exploreResidences.occupancies.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
                </div>
              </div>

              {/* Action: Reset Filters */}
              <div className="w-full lg:w-auto">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex h-[46px] w-full lg:w-auto items-center justify-center rounded-full border border-ink/30 px-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[2px] text-ink transition-colors duration-200 hover:bg-ink hover:text-white cursor-pointer whitespace-nowrap"
                >
                  RESET FILTERS
                </button>
              </div>
            </div>
          </div>
        </ViewReveal>

        {/* Counter Summary */}
        <p className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] text-[#88847c] mt-8 mb-6">
          SHOWING {String(filteredItems.length).padStart(2, "0")} RESIDENCES
        </p>

        {/* Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => (
              <ResidenceCard key={item.name} item={item} />
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

function ResidenceCard({ item }: { item: ExploreResidenceItem }) {
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
        {item.featured && (
          <span className="font-mono uppercase text-[clamp(11px,0.7292vw,14px)] leading-[1.7857] tracking-[2px] absolute right-4 top-4 rounded-full bg-[#d8c89b] px-3 py-1.5 text-[9px] tracking-[0.18em] text-ink shadow-sm">
            Featured
          </span>
        )}
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
