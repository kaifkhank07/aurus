"use client";

import { useEffect, useMemo, useState } from "react";
import { exploreResidences } from "@/data/residences";
import { Container } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { useMasterStore } from "@/store/useMasterStore";
import { ResidenceFilterBar } from "./ResidenceFilterBar";
import { ResidenceCard } from "./ResidenceCard";

export function ExploreResidences() {
  const {
    publicHostels,
    isLoadingPublicHostels,
    fetchPublicHostels,
  } = useHostelAndEnquiryStore();

  const {
    publicCities,
    fetchPublicCities,
    publicOccupancies,
    fetchPublicOccupancies,
  } = useMasterStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedGender, setSelectedGender] = useState(
    "All Wings (Girls / Boys / Co-ed)"
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState("All Occupancies");

  // Fetch dynamic public masters and hostels on mount
  useEffect(() => {
    fetchPublicHostels({ limit: 100 });
    fetchPublicCities();
    fetchPublicOccupancies();
  }, [fetchPublicHostels, fetchPublicCities, fetchPublicOccupancies]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All Cities");
    setSelectedGender("All Wings (Girls / Boys / Co-ed)");
    setSelectedOccupancy("All Occupancies");
  };

  const filteredHostels = useMemo(() => {
    return publicHostels.filter((hostel) => {
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

        const cityName =
          typeof hostel.location?.city === "object" && hostel.location?.city !== null
            ? (hostel.location.city.city || "").toLowerCase()
            : typeof hostel.location?.city === "string"
              ? hostel.location.city.toLowerCase()
              : "";

        const keywords = Array.isArray(hostel.metadata?.keywords)
          ? hostel.metadata.keywords.map((k) => (k || "").toLowerCase())
          : [];

        const combinedSearchableText = [
          title,
          subtitle,
          address,
          localityName,
          cityName,
          ...keywords,
        ].join(" ");

        if (!combinedSearchableText.includes(query)) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCity !== "All Cities") {
        const cityQuery = selectedCity.toLowerCase().trim();
        const rawCity = hostel.location?.city;
        let matchesCity = false;

        if (typeof rawCity === "object" && rawCity !== null) {
          const cityName = (rawCity.city || "").toLowerCase().trim();
          const citySlug = (rawCity.slug || "").toLowerCase().trim();
          const cityId = String(rawCity.id || (rawCity as any)._id || "").toLowerCase().trim();
          matchesCity =
            cityName === cityQuery ||
            citySlug === cityQuery ||
            cityId === cityQuery;
        } else if (typeof rawCity === "string") {
          matchesCity = rawCity.toLowerCase().trim() === cityQuery;
        }

        if (!matchesCity) {
          const address = (hostel.location?.address || "").toLowerCase();
          if (address.includes(cityQuery)) {
            matchesCity = true;
          }
        }

        if (!matchesCity) {
          return false;
        }
      }

      // 3. Gender Wing Filter
      if (selectedGender !== "All Wings (Girls / Boys / Co-ed)") {
        const tenant = (hostel.tenantType || "").toLowerCase().trim();
        if (selectedGender === "Girls Only" && tenant !== "girls") {
          return false;
        }
        if (selectedGender === "Boys Only" && tenant !== "boys") {
          return false;
        }
        if (selectedGender === "Co-ed Living" && tenant !== "co-ed") {
          return false;
        }
      }

      // 4. Occupancy Option Filter
      if (selectedOccupancy !== "All Occupancies") {
        const occQuery = selectedOccupancy.toLowerCase().trim();
        const occupancies = Array.isArray(hostel.occupancy) ? hostel.occupancy : [];

        const matchesOccupancy = occupancies.some((occ) => {
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

        if (!matchesOccupancy) {
          return false;
        }
      }

      return true;
    });
  }, [publicHostels, searchQuery, selectedCity, selectedGender, selectedOccupancy]);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-8 lg:space-y-12">
        {/* Heading & Subtitle */}
        <div>
          <Heading
            title1={exploreResidences.titleTop}
            title2={exploreResidences.titleAccent}
            // className="uppercase max-w-[28ch] sm:max-w-none"
            className="uppercase max-w-[200px] sm:max-w-full"
          />

          <p className="mt-4 sm:mt-5 lg:mt-6 max-w-[56ch] lg:max-w-[43ch] font-sans font-normal text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.4] tracking-[-0.03em] text-muted">
            {exploreResidences.body}
          </p>
        </div>

        {/* Filter Bar */}
        <ResidenceFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          cities={publicCities}
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
          selectedOccupancy={selectedOccupancy}
          onOccupancyChange={setSelectedOccupancy}
          occupancies={publicOccupancies}
          onResetFilters={resetFilters}
        />

        {/* Counter Summary */}
        <p className="font-mono uppercase text-[11px] sm:text-[12px] tracking-[2px] text-[#88847c] mt-6 mb-4 lg:mt-0 lg:mb-6">
          SHOWING {String(filteredHostels.length).padStart(2, "0")}{" "}
          {filteredHostels.length === 1 ? "RESIDENCE" : "RESIDENCES"}
        </p>

        {/* Cards Grid */}
        {filteredHostels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredHostels.map((hostel) => (
              <ResidenceCard
                key={hostel.id || hostel._id || hostel.slug}
                item={hostel}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[20px] border border-ink/10 bg-[#faf8f4] py-16 px-6 text-center">
            <p className="font-sans text-[16px] text-muted">
              {isLoadingPublicHostels && publicHostels.length === 0
                ? "Loading residences..."
                : "No residences found matching your filters."}
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

export { ResidenceCard } from "./ResidenceCard";
export { ResidenceFilterBar } from "./ResidenceFilterBar";

export default ExploreResidences;
