"use client";

import { useMemo, useEffect } from "react";
import { Container, Eyebrow } from "../ui/Primitives";
import ResidenceCard from "./ResidenceCard";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { SafeHostel } from "@/types/hostel.types";

interface RelatedResidencesProps {
  currentSlug?: string;
  currentHostel?: SafeHostel;
  items?: SafeHostel[];
}

function getCityIdentifier(h?: SafeHostel | null): { id: string; name: string } {
  if (!h?.location?.city) return { id: "", name: "" };
  if (typeof h.location.city === "object" && h.location.city !== null) {
    const cityObj = h.location.city as { id?: string; _id?: string; city?: string };
    return {
      id: String(cityObj.id || cityObj._id || ""),
      name: String(cityObj.city || "").toLowerCase().trim(),
    };
  }
  return { id: "", name: String(h.location.city || "").toLowerCase().trim() };
}

function getLocalityIdentifiers(h?: SafeHostel | null): string[] {
  if (!h?.location?.locality) return [];
  const list = Array.isArray(h.location.locality)
    ? h.location.locality
    : [h.location.locality];

  return list
    .map((l) => {
      if (typeof l === "object" && l !== null) {
        const obj = l as { id?: string; _id?: string; slug?: string; name?: string };
        return String(obj.id || obj._id || obj.slug || obj.name || "").toLowerCase().trim();
      }
      return String(l || "").toLowerCase().trim();
    })
    .filter(Boolean);
}

export function RelatedResidences({
  currentSlug,
  currentHostel,
  items,
}: RelatedResidencesProps) {
  const { publicHostels, fetchPublicHostels } = useHostelAndEnquiryStore();

  useEffect(() => {
    if (!items && publicHostels.length === 0) {
      fetchPublicHostels({ limit: 100 });
    }
  }, [items, publicHostels.length, fetchPublicHostels]);

  const relatedItems = useMemo(() => {
    // If pre-filtered items are explicitly provided
    if (items && items.length > 0) return items.slice(0, 3);

    const s = (currentSlug || currentHostel?.slug || "").toLowerCase().trim();
    const currentId = currentHostel?.id || currentHostel?._id || "";

    // 1. Identify the current hostel (from prop or by matching slug/id in store)
    const activeHostel =
      currentHostel ||
      publicHostels.find((h) => {
        const matchSlug = s && h.slug?.toLowerCase().trim() === s;
        const matchId = (h.id && h.id === currentId) || (h._id && h._id === currentId);
        return matchSlug || matchId;
      });

    // 2. Filter out current hostel from candidates
    const candidates = publicHostels.filter((h) => {
      const matchSlug = s && h.slug?.toLowerCase().trim() === s;
      const matchId =
        (activeHostel?.id && (h.id === activeHostel.id || h._id === activeHostel.id)) ||
        (activeHostel?._id && (h._id === activeHostel._id || h.id === activeHostel._id));
      return !matchSlug && !matchId;
    });

    const currentCity = getCityIdentifier(activeHostel);
    const currentLocalities = getLocalityIdentifiers(activeHostel);

    // 3. Separate candidates into priority buckets:
    // Bucket 1: Same City & Same Locality
    // Bucket 2: Same City, Other Localities
    // Bucket 3: Other Cities (fallback)
    const sameCitySameLocality: SafeHostel[] = [];
    const sameCityOtherLocality: SafeHostel[] = [];
    const otherCityHostels: SafeHostel[] = [];

    candidates.forEach((hostel) => {
      const hCity = getCityIdentifier(hostel);
      const isSameCity =
        (currentCity.id && hCity.id && currentCity.id === hCity.id) ||
        (currentCity.name && hCity.name && currentCity.name === hCity.name);

      if (isSameCity) {
        const hLocalities = getLocalityIdentifiers(hostel);
        const sharesLocality = hLocalities.some((loc) => currentLocalities.includes(loc));
        if (sharesLocality) {
          sameCitySameLocality.push(hostel);
        } else {
          sameCityOtherLocality.push(hostel);
        }
      } else {
        otherCityHostels.push(hostel);
      }
    });

    // Prioritize: Same city (same locality first, then other localities), then other cities
    const prioritized = [
      ...sameCitySameLocality,
      ...sameCityOtherLocality,
      ...otherCityHostels,
    ];

    return prioritized.slice(0, 3);
  }, [items, publicHostels, currentSlug, currentHostel]);

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-6 lg:space-y-10">
        {/* Eyebrow Header */}
        <Eyebrow>{"More // You might also like"}</Eyebrow>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {relatedItems.map((item) => (
            <ResidenceCard
              key={item.id || item._id || item.slug}
              item={item}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default RelatedResidences;
