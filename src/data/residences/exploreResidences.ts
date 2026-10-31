export type ExploreResidenceItem = {
  id?: string;
  _id?: string;
  slug?: string;
  name: string;
  occupancy: string;
  roomOccupancy: string;
  city: string;
  featured: boolean;
  locality: string;
  distance: string;
  priceFrom: string;
  href: string;
  image: string;
  colleges?: string[];
};

export const exploreResidences = {
  titleTop: "Our Hostel across",
  titleAccent: "India.",
  body: "Filter by city, gender wing, and room occupancy. Each Chapter includes daily gourmet dining, high-speed fibre WiFi, and 24/7 biometric security.",
};
