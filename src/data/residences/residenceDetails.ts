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
