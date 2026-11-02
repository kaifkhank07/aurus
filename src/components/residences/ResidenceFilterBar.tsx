"use client";

import { ViewReveal } from "../animation";
import { PublicCity } from "@/types/city.types";
import { SafeOccupancy } from "@/types/occupancy.types";

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
      <path
        d="M4 6l4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const GENDER_WING_OPTIONS = [
  "All Wings (Girls / Boys / Co-ed)",
  "Girls Only",
  "Boys Only",
  "Co-ed Living",
] as const;

export interface ResidenceFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (value: string) => void;
  cities: PublicCity[];
  selectedGender: string;
  onGenderChange: (value: string) => void;
  selectedOccupancy: string;
  onOccupancyChange: (value: string) => void;
  occupancies: SafeOccupancy[];
  onResetFilters: () => void;
}

export function ResidenceFilterBar({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  selectedGender,
  onGenderChange,
  selectedOccupancy,
  onOccupancyChange,
  occupancies,
  onResetFilters,
}: ResidenceFilterBarProps) {
  return (
    <ViewReveal duration={800}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.3fr_1fr_auto] gap-3.5 sm:gap-4 items-end p-4 sm:p-5 lg:p-6 rounded-[20px] border border-ink/10 bg-[#FAF8F5]">
        {/* Search */}
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by locality, college or chapter..."
            className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 text-[13px] text-ink placeholder:text-[#88847c]/70 placeholder:text-[11.5px] sm:placeholder:text-[12.5px] outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
          />
        </div>

        {/* City */}
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
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
            >
              <option value="All Cities">All Cities</option>
              {cities.map((city) => {
                const cityName = city.city || city.name || "";
                const cityValue = city.slug || cityName;
                return (
                  <option key={city.id || city._id || city.slug} value={cityValue}>
                    {cityName}
                  </option>
                );
              })}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
          </div>
        </div>

        {/* Gender Wing */}
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
              onChange={(e) => onGenderChange(e.target.value)}
              className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
            >
              {GENDER_WING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
          </div>
        </div>

        {/* Occupancy */}
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
              onChange={(e) => onOccupancyChange(e.target.value)}
              className="w-full h-[46px] rounded-xl border border-ink/10 bg-[#F5F3EE] px-4 pr-9 text-[13px] text-ink appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-ink/50 focus:bg-[#F5F3EE]"
            >
              <option value="All Occupancies">All Occupancies</option>
              {occupancies.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/60 h-3.5 w-3.5" />
          </div>
        </div>

        {/* Reset Filters */}
        <div className="mt-1 md:mt-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex h-[46px] w-full lg:w-auto items-center justify-center rounded-full border border-ink/30 px-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[2px] text-ink transition-colors duration-200 hover:bg-ink hover:text-white cursor-pointer whitespace-nowrap"
          >
            RESET FILTERS
          </button>
        </div>
      </div>
    </ViewReveal>
  );
}

export default ResidenceFilterBar;

