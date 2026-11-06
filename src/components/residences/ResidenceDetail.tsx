"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Container } from "@/components/ui/Primitives";
import { Heading } from "../utils/Heading";
import { ScheduleVisitModal } from "../shared/ScheduleVisitModal";
import { ResidenceGalleryModal } from "./ResidenceGalleryModal";
import RichTextRenderer from "../shared/RichTextRenderer";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { SafeHostel } from "@/types/hostel.types";

function CheckCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`${className} shrink-0 stroke-current text-ink`}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" strokeWidth="1.2" />
      <path
        d="M7 10l2 2 4-4"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <path d="M12.031 2C6.495 2 2 6.492 2 12.028c0 1.947.556 3.766 1.521 5.308L2 22l4.809-1.493a10.024 10.024 0 005.222 1.526c5.536 0 10.031-4.492 10.031-10.005C22.062 6.492 17.567 2 12.031 2zm0 18.283c-1.637 0-3.176-.465-4.497-1.272l-.323-.198-2.854.887.896-2.781-.212-.338a8.232 8.232 0 01-1.285-4.553c0-4.567 3.716-8.283 8.275-8.283 4.559 0 8.275 3.716 8.275 8.283 0 4.567-3.716 8.267-8.275 8.267zm4.536-6.196c-.249-.125-1.472-.727-1.7-.81-.228-.083-.395-.125-.562.125-.167.249-.645.81-.79 1-.146.125-.291.146-.541.021-.249-.125-1.054-.389-2.008-1.239-.742-.662-1.243-1.48-1.389-1.729-.146-.249-.016-.384.108-.508.112-.112.249-.291.374-.437.125-.146.167-.249.249-.416.083-.167.042-.312-.021-.437-.062-.125-.562-1.352-.77-1.852-.203-.487-.41-.421-.562-.429l-.479-.008c-.167 0-.437.062-.666.312-.228.249-.874.853-.874 2.081 0 1.228.895 2.414 1.02 2.581.125.167 1.76 2.688 4.264 3.769.596.257 1.061.41 1.424.526.598.19 1.143.163 1.574.099.48-.072 1.472-.603 1.68-1.186.208-.583.208-1.082.146-1.186-.063-.105-.229-.167-.479-.292z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function GalleryIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

interface ResidenceDetailProps {
  slug?: string;
  hostel?: SafeHostel;
}

export function ResidenceDetail({ slug, hostel: propHostel }: ResidenceDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const {
    publicHostels,
    isLoadingPublicHostels,
    fetchPublicHostels,
  } = useHostelAndEnquiryStore();

  // Load public hostels if not already loaded
  useEffect(() => {
    if (!propHostel && publicHostels.length === 0) {
      fetchPublicHostels({ limit: 100 });
    }
  }, [propHostel, publicHostels.length, fetchPublicHostels]);

  // Resolve current hostel from prop or store by slug
  const hostel = useMemo(() => {
    if (propHostel) return propHostel;
    if (!slug) return publicHostels[0] || null;

    const normalizedSlug = slug.toLowerCase().trim();
    return (
      publicHostels.find(
        (h) =>
          h.slug?.toLowerCase().trim() === normalizedSlug ||
          h.id === normalizedSlug ||
          h._id === normalizedSlug
      ) || null
    );
  }, [propHostel, slug, publicHostels]);

  // Loading state
  if (isLoadingPublicHostels && !hostel) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="text-center">
          <p className="font-mono text-xs uppercase tracking-[2px] text-[#88847C] animate-pulse">
            Loading residence details...
          </p>
        </Container>
      </section>
    );
  }

  // Not found fallback
  if (!hostel) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="text-center space-y-4">
          <p className="font-sans text-xl text-ink">Residence not found</p>
          <p className="font-mono text-xs uppercase tracking-[2px] text-[#88847C]">
            The requested residence could not be found or is currently inactive.
          </p>
        </Container>
      </section>
    );
  }

  // 1. Gender / Wing Badge (Strict DB only - no default assumption)
  const genderBadge =
    hostel.tenantType === "girls"
      ? "GIRLS ONLY"
      : hostel.tenantType === "boys"
        ? "BOYS ONLY"
        : hostel.tenantType === "co-ed"
          ? "CO-ED LIVING"
          : "NOT AVAILABLE";

  // 2. Locality & City (Strict DB only - no hardcoded default city)
  const localityName =
    typeof hostel.location?.locality === "object" && hostel.location?.locality !== null
      ? (hostel.location.locality as { name?: string }).name?.trim() || ""
      : typeof hostel.location?.locality === "string"
        ? hostel.location.locality.trim()
        : "";

  const cityName =
    typeof hostel.location?.city === "object" && hostel.location?.city !== null
      ? (hostel.location.city as { city?: string }).city?.trim() || ""
      : typeof hostel.location?.city === "string"
        ? hostel.location.city.trim()
        : "";

  const locationBadge =
    localityName && cityName
      ? `${localityName}, ${cityName}`.toUpperCase()
      : localityName
        ? localityName.toUpperCase()
        : cityName
          ? cityName.toUpperCase()
          : "NOT AVAILABLE";

  const address =
    hostel.location?.address?.trim() ||
    (localityName && cityName
      ? `${localityName}, ${cityName}`
      : localityName || cityName || "Not Available");

  // 3. Images (Strict DB only - hero and gallery)
  const frontImageUrl = hostel.frontImage?.url?.trim() || "";
  const allGalleryUrls = Array.isArray(hostel.galleryImages)
    ? hostel.galleryImages
      .map((img) =>
        typeof img === "object" && img !== null
          ? img.url?.trim()
          : typeof img === "string"
            ? (img as string).trim()
            : ""
      )
      .filter((url): url is string => Boolean(url))
    : [];

  const fullGalleryImages: string[] = [];
  if (frontImageUrl) fullGalleryImages.push(frontImageUrl);
  allGalleryUrls.forEach((url) => {
    if (!fullGalleryImages.includes(url)) {
      fullGalleryImages.push(url);
    }
  });

  const heroImage =
    frontImageUrl ||
    allGalleryUrls[0] ||
    "/images/image03.png";

  const galleryImages =
    allGalleryUrls.length >= 2
      ? allGalleryUrls
      : allGalleryUrls.length === 1
        ? [allGalleryUrls[0], heroImage]
        : [heroImage, heroImage];

  const openGallery = (targetIndex: number = 0) => {
    setGalleryInitialIndex(targetIndex);
    setIsGalleryOpen(true);
  };

  // 4. Room Configurations (from hostel.room only)
  const roomsList = Array.isArray(hostel.room)
    ? hostel.room
      .map((r) =>
        typeof r === "object" && r !== null
          ? (r as { name?: string }).name?.trim() || ""
          : typeof r === "string"
            ? (r as string).trim()
            : ""
      )
      .filter((name): name is string => Boolean(name))
    : [];

  // 5. Occupancy Options (from hostel.occupancy only)
  const occupanciesList = Array.isArray(hostel.occupancy)
    ? hostel.occupancy
      .map((o) =>
        typeof o === "object" && o !== null
          ? (o as { name?: string }).name?.trim() || ""
          : typeof o === "string"
            ? (o as string).trim()
            : ""
      )
      .filter((name): name is string => Boolean(name))
    : [];

  // Separate room and occupancy values
  const roomsSpecValue =
    roomsList.length > 0 ? roomsList.join(", ") : "Not Available";

  // 6. Pricing & Frequency (Strict DB only)
  const rentAmount = Number(hostel.rent?.amount || 0);
  const startsFrom =
    rentAmount > 0 ? `₹${rentAmount.toLocaleString("en-IN")}` : "Not Available";

  const rawFreqName =
    typeof hostel.rent?.frequency === "object" && hostel.rent?.frequency !== null
      ? (hostel.rent.frequency as { name?: string }).name?.trim() || ""
      : typeof hostel.rent?.frequency === "string"
        ? (hostel.rent.frequency as string).trim()
        : "";

  const paymentFrequency = rawFreqName
    ? rawFreqName.charAt(0).toUpperCase() + rawFreqName.slice(1)
    : "Not Available";

  const period = rawFreqName
    ? rawFreqName.toLowerCase().includes("year")
      ? "/ year"
      : rawFreqName.toLowerCase().includes("month")
        ? "/ month"
        : `/ ${rawFreqName.toLowerCase()}`
    : "";

  // 7. Rating (Strict DB only)
  const starNum = Number(hostel.rating?.star);
  const hasValidRating =
    hostel.rating?.star !== undefined &&
    hostel.rating?.star !== null &&
    !isNaN(starNum) &&
    starNum > 0;

  const ratingText = hasValidRating
    ? `★ ${starNum} (${Number(hostel.rating?.userCount) || 0} reviews)`
    : "Not Available";

  // Key Specs: preserved in the original 4-cell layout
  const keySpecs = [
    { label: "WING", value: genderBadge },
    { label: "ROOMS", value: roomsSpecValue },
    { label: "RATING", value: ratingText },
    { label: "PAYMENT", value: paymentFrequency },
  ];

  // 8. Occupancy Items for Pricing Card (Occupancy only, not room)
  const occupancyCardItems: Array<{ type: string; status: string }> =
    occupanciesList.length > 0
      ? occupanciesList.map((occName) => ({
          type: occName,
          status: "Available",
        }))
      : [{ type: "Occupancy", status: "Not Available" }];

  // 9. Included in your stay (Amenities only)
  const amenitiesList = Array.isArray(hostel.amenities)
    ? hostel.amenities
      .map((a) =>
        typeof a === "object" && a !== null
          ? (a as { name?: string }).name?.trim() || ""
          : typeof a === "string"
            ? (a as string).trim()
            : ""
      )
      .filter((name): name is string => Boolean(name))
    : [];

  // 10. Every Aurus Chapter includes (Services only)
  const servicesList = Array.isArray(hostel.services)
    ? hostel.services
      .map((s) =>
        typeof s === "object" && s !== null
          ? (s as { name?: string }).name?.trim() || ""
          : typeof s === "string"
            ? (s as string).trim()
            : ""
      )
      .filter((name): name is string => Boolean(name))
    : [];

  // 11. Near campus (Institutes only)
  const instituteList = Array.isArray(hostel.institute)
    ? hostel.institute
      .map((inst) =>
        typeof inst === "object" && inst !== null
          ? (inst as { name?: string }).name?.trim() || ""
          : typeof inst === "string"
            ? (inst as string).trim()
            : ""
      )
      .filter((name): name is string => Boolean(name))
    : [];

  // 12. Location
  const mapUrl =
    hostel.location?.mapUrl?.trim() ||
    (hostel.location?.latitude && hostel.location?.longitude
      ? `https://maps.google.com/?q=${hostel.location.latitude},${hostel.location.longitude}`
      : hostel.location?.address?.trim()
        ? `https://maps.google.com/?q=${encodeURIComponent(hostel.location.address)}`
        : `https://maps.google.com/?q=${encodeURIComponent(address)}`);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container className="space-y-4 sm:space-y-6 lg:space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Heading
              title1={hostel.title}
              title2={hostel.subtitle || ""}
              className="uppercase max-w-[200px] sm:max-w-full"
            />
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="bg-ink text-white font-mono text-[9px] sm:text-[10px] lg:text-[13px] uppercase px-4 sm:px-6 3xl:px-8 py-1.5 rounded-full font-medium">
              {genderBadge}
            </span>
            <span className="border border-ink/25 bg-white/40 text-ink font-mono text-[9px] sm:text-[10px] lg:text-[13px] uppercase px-4 sm:px-6 3xl:px-8 py-1.5 rounded-full font-medium">
              {locationBadge}
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <div
            onClick={() => openGallery(0)}
            className="lg:col-span-2 lg:row-span-2 relative aspect-[16/10] sm:aspect-[1.5/1] rounded-[10px] sm:rounded-[20px] overflow-hidden bg-neutral-200 group cursor-pointer"
          >
            <Image
              src={heroImage}
              alt={`${hostel.title} main interior view`}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            />
          </div>

          {galleryImages.slice(0, 2).map((img, idx) => {
            const isThirdImage = idx === 1;
            const slideIndex = isThirdImage ? 2 : 1;

            return (
              <div
                key={idx}
                onClick={() => openGallery(slideIndex)}
                className="relative aspect-[16/10] sm:aspect-[1.5/1] rounded-[10px] sm:rounded-[20px] overflow-hidden bg-neutral-200 group cursor-pointer"
              >
                <Image
                  src={img}
                  alt={`${hostel.title} gallery view ${idx + 1}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                />

                {/* Third image: View More Button */}
                {isThirdImage && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGallery(slideIndex);
                    }}
                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 bg-white/75 hover:bg-white text-ink font-mono text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[1.5px] px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-lg border border-ink/20 hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="View more photos"
                  >
                    <GalleryIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ink" />
                    <span>View More</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Details & Sticky Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Residence Features and Content */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10">
            {/* Description */}
            <div className="font-sans text-ink text-base sm:text-lg lg:text-[20px] 3xl:text-[24px] font-light leading-relaxed max-w-3xl">
              <RichTextRenderer
                content={hostel.description}
                fallback="Not Available"
              />
            </div>

            {/* Key Specs Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-ink/15 overflow-hidden bg-[#FAF8F4]/80">
              {keySpecs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`p-4 sm:p-5 flex flex-col justify-center border-r border-ink/15 ${
                    index < 2 ? "border-b lg:border-b-0 border-ink/15" : "border-b-0"
                  }`}
                >
                  <span className="font-mono uppercase text-[10px] sm:text-[11px] lg:text-[14px] tracking-[2px] text-[#88847C] block mb-1 font-medium">
                    {spec.label}
                  </span>
                  <span className="font-sans text-ink text-sm sm:text-[15px] lg:text-[18px] font-medium leading-tight">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Pricing & Booking Card */}
            <div className="sm:hidden lg:sticky lg:top-28 rounded-[20px] border border-ink/10 bg-white p-6 sm:p-7">
              {/* Price Header */}
              <span className="font-mono uppercase text-[10px] sm:text-[14px] text-[#77736B] font-regular block">
                STARTS FROM
              </span>
              <div className="mt-1 flex items-baseline">
                <span className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
                  {startsFrom}
                </span>
                {period && (
                  <span className="ml-1 text-xs text-[#77736B] font-normal">
                    {period}
                  </span>
                )}
              </div>

              {/* Occupancy Options List */}
              <div className="divide-y divide-ink/10 border-y border-ink/10 my-6 py-0.5">
                {occupancyCardItems.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 lg:py-3 font-sans text-xs sm:text-[14px] text-ink font-regular"
                  >
                    <span className="text-[#77736B]">{opt.type}</span>
                    <span className={opt.status === "Not Available" ? "text-[#88847C]" : "text-ink"}>
                      {opt.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-full bg-ink py-3.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-white hover:bg-ink/85 transition text-center block cursor-pointer shadow-xs"
                >
                  SCHEDULE A VISIT
                </button>

                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello! I'm interested in visiting ${hostel.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  WHATSAPP US
                </a>

                <a
                  href="tel:18005720709"
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4 text-ink" />
                  CALL US
                </a>
              </div>

              {/* Disclaimer */}
              <p className="font-sans text-[10px] sm:text-[11px] text-[#88847C] leading-relaxed text-center mt-5 font-light">
                Prices are indicative and vary by room type and floor. Final pricing is confirmed during your visit.
              </p>
            </div>

            {/* Included in your stay (Amenities) */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-4">
                Included in your stay
              </h2>
              {amenitiesList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-ink/15">
                  {amenitiesList.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-ink/15 py-3 sm:py-3.5 flex items-center gap-3 pr-4"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-ink shrink-0" />
                      <span className="font-sans text-[13.5px] sm:text-[14.5px] lg:text-[18px] text-ink font-light">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-[#88847C]">Not Available</p>
              )}
            </div>

            {/* Every Aurus Chapter includes (Services) */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-4">
                Every Aurus Chapter includes
              </h2>
              {servicesList.length > 0 ? (
                <div className="flex flex-wrap gap-3 3xl:gap-4">
                  {servicesList.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 lg:px-6 py-2 rounded-full border border-ink/15 font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px] text-ink transition-colors hover:border-ink/40"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-[#88847C]">Not Available</p>
              )}
            </div>

            {/* Near campus (Institutes) */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-1">
                Near campus
              </h2>
              <p className="font-sans text-xs sm:text-[13px] lg:text-[16px] 3xl:text-[19px] text-[#77736C] font-regular mb-3.5">
                Minutes away from premier institutes & universities
              </p>
              {instituteList.length > 0 ? (
                <div className="flex flex-wrap gap-3 3xl:gap-4">
                  {instituteList.map((institute, index) => (
                    <span
                      key={index}
                      className="px-4 lg:px-6 py-2 rounded-full bg-ink text-white font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px]"
                    >
                      {institute}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-[#88847C]">Not Available</p>
              )}
            </div>

            {/* Location */}
            <div>
              <h2 className="font-sans text-ink text-lg sm:text-xl lg:text-[28px] 3xl:text-[35px] font-regular leading-sung mb-3.5">
                Location
              </h2>
              <div className="rounded-[20px] bg-white p-5 sm:p-6 sm:px-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
                <div>
                  <span className="font-mono uppercase text-[14px] text-[#88847C] font-regular block mb-1">
                    {locationBadge}
                  </span>
                  <p className="font-sans text-[14px] text-ink leading-relaxed max-w-lg font-regular">
                    {address}
                  </p>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 lg:px-6 py-2 rounded-full border border-ink font-mono uppercase font-regular text-[10px] sm:text-[11px] lg:text-[13px] tracking-[1.5px] text-ink hover:bg-ink hover:text-white transition-colors duration-200 whitespace-nowrap cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  OPEN IN GOOGLE MAPS
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Booking Card (Desktop) */}
          <div className="hidden lg:block">
            <div className="lg:sticky lg:top-28 rounded-[20px] border border-ink/10 bg-white p-6 sm:p-7 max-w-[80%] ml-auto">
              {/* Price Header */}
              <span className="font-mono uppercase text-[10px] sm:text-[14px] text-[#77736B] font-regular block">
                STARTS FROM
              </span>
              <div className="mt-1 flex items-baseline">
                <span className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
                  {startsFrom}
                </span>
                {period && (
                  <span className="ml-1 text-xs text-[#77736B] font-normal">
                    {period}
                  </span>
                )}
              </div>

              {/* Occupancy Options List */}
              <div className="divide-y divide-ink/10 border-y border-ink/10 my-6 py-0.5">
                {occupancyCardItems.map((opt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 lg:py-3 font-sans text-xs sm:text-[14px] text-ink font-regular"
                  >
                    <span className="text-[#77736B]">{opt.type}</span>
                    <span className={opt.status === "Not Available" ? "text-[#88847C]" : "text-ink"}>
                      {opt.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-full bg-ink py-3.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-white hover:bg-ink/85 transition text-center block cursor-pointer shadow-xs"
                >
                  SCHEDULE A VISIT
                </button>

                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello! I'm interested in visiting ${hostel.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  WHATSAPP US
                </a>

                <a
                  href="tel:18005720709"
                  className="w-full rounded-full border border-ink/30 py-2.5 px-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[2px] font-medium text-ink hover:border-ink hover:bg-ink/5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4 text-ink" />
                  CALL US
                </a>
              </div>

              {/* Disclaimer */}
              <p className="font-sans text-[10px] sm:text-[11px] text-[#88847C] leading-relaxed text-center mt-5 font-light">
                Prices are indicative and vary by room type and floor. Final pricing is confirmed during your visit.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Schedule a Visit Modal */}
      <ScheduleVisitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        residenceTitle={hostel.title}
        residenceLocation={address}
      />

      {/* Slide-by-slide Photo Gallery Modal */}
      <ResidenceGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={fullGalleryImages}
        initialIndex={galleryInitialIndex}
        title={hostel.title}
      />
    </section>
  );
}

export default ResidenceDetail;
