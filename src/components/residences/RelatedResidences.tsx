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
    if (items && items.length > 0) return items.slice(0, 3);

    const s = (currentSlug || currentHostel?.slug || "").toLowerCase().trim();
    const currentId = currentHostel?.id || currentHostel?._id || "";

    const candidates = publicHostels.filter((h) => {
      const matchSlug = h.slug?.toLowerCase().trim() === s;
      const matchId = (h.id && h.id === currentId) || (h._id && h._id === currentId);
      return !matchSlug && !matchId;
    });

    // If we have a currentHostel city, prioritize hostels in the same city
    const targetCity =
      typeof currentHostel?.location?.city === "object" && currentHostel.location?.city !== null
        ? currentHostel.location.city.city
        : typeof currentHostel?.location?.city === "string"
        ? currentHostel.location.city
        : "";

    if (targetCity) {
      candidates.sort((a, b) => {
        const aCity =
          typeof a.location?.city === "object" && a.location.city !== null
            ? a.location.city.city
            : typeof a.location?.city === "string"
            ? a.location.city
            : "";
        const bCity =
          typeof b.location?.city === "object" && b.location.city !== null
            ? b.location.city.city
            : typeof b.location?.city === "string"
            ? b.location.city
            : "";
        if (aCity === targetCity && bCity !== targetCity) return -1;
        if (bCity === targetCity && aCity !== targetCity) return 1;
        return 0;
      });
    }

    return candidates.slice(0, 3);
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
