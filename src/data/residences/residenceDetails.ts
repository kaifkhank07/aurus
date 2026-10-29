export interface RoomOption {
  type: string;
  status: string;
  isIncluded?: boolean;
}

export interface KeySpec {
  label: string;
  value: string;
}

export interface CampusInfo {
  distance: string;
  colleges: string[];
}

export interface LocationInfo {
  label: string;
  address: string;
  mapUrl: string;
}

export interface PricingInfo {
  startsFrom: string;
  period: string;
  roomOptions: RoomOption[];
  scheduleVisitText: string;
  whatsappText: string;
  whatsappNumber: string;
  callText: string;
  callNumber: string;
  disclaimer: string;
}

export interface ResidenceDetail {
  slug: string;
  title: string;
  subtitle: string;
  genderBadge: string;
  locationBadge: string;
  mainImage: string;
  galleryImages: string[];
  description: string;
  keySpecs: KeySpec[];
  includedInStay: string[];
  chapterIncludes: string[];
  nearCampus: CampusInfo;
  location: LocationInfo;
  pricing: PricingInfo;
}

export const staticResidenceDetail: ResidenceDetail = {
  slug: "chapter-i",
  title: "CHAPTER I",
  subtitle: "(Residences for Girls)",
  genderBadge: "GIRLS ONLY",
  locationBadge: "VILE PARLE, MUMBAI",
  mainImage: "/images/image03.png",
  galleryImages: [
    "/images/image03.png",
    "/images/image03.png",
  ],
  description:
    "A girls-only residence on SV Road, built for focus: quiet study alcoves on every floor, private balconies, and a dining room that serves four fresh meals a day.",
  keySpecs: [
    { label: "WING", value: "Girls only" },
    { label: "ROOMS", value: "Single, Triple, Double" },
    { label: "RATING", value: "★ 4.9 (48 reviews)" },
    { label: "BILLING", value: "Monthly" },
  ],
  includedInStay: [
    "24/7 biometric access",
    "Women security staff",
    "Daily housekeeping",
    "1 Gbps Wi-Fi",
    "Bedding & linen included",
    "Study lounge",
    "Weekly chef specials",
    "Laundry service",
  ],
  chapterIncludes: [
    "FOUR MEALS A DAY",
    "DAILY HOUSEKEEPING",
    "LAUNDRY",
    "HIGH-SPEED WI-FI",
    "RESIDENT APP",
    "FURNISHED ROOM + LINEN",
    "EVENTS CALENDAR",
    "NO HIDDEN CHARGES",
  ],
  nearCampus: {
    distance: "3 min from NMIMS, Mithibai & DJ Sanghvi.",
    colleges: ["NMIMS", "MITHIBAI COLLEGE", "DJ SANGHVI", "NM COLLEGE"],
  },
  location: {
    label: "ADDRESS",
    address:
      "Plot No 4, NS Road No 5, Vallabh Nagar, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056",
    mapUrl:
      "https://maps.google.com/?q=Plot+No+4+NS+Road+No+5+JVPD+Scheme+Vile+Parle+West+Mumbai+400056",
  },
  pricing: {
    startsFrom: "₹60,000",
    period: "/month",
    roomOptions: [
      { type: "Triple Sharing", status: "Available" },
      { type: "Double Sharing", status: "Available" },
      { type: "Single occupancy", status: "Available" },
      { type: "Meals, Wi-Fi, Housekeeping", status: "Included", isIncluded: true },
    ],
    scheduleVisitText: "SCHEDULE A VISIT",
    whatsappText: "WHATSAPP US",
    whatsappNumber: "919876543210",
    callText: "CALL 1800-872-0768",
    callNumber: "18008720768",
    disclaimer:
      "Prices are indicative and vary by room type and floor. Final pricing is confirmed during your visit.",
  },
};
