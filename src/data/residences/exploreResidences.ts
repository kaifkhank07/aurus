export type ExploreResidenceItem = {
  name: string;
  occupancy: "Girls Only" | "Boys Only" | "Co-ed Living";
  roomOccupancy: "Single Occupancy" | "Double Sharing" | "Triple Sharing";
  city: string;
  featured: boolean;
  locality: string;
  distance: string;
  priceFrom: string;
  href: string;
  image: string;
  colleges: string[];
};

export const exploreResidences = {
  titleTop: "Our Hostel across",
  titleAccent: "India.",
  body: "Filter by city, gender wing, and room occupancy. Each Chapter includes daily gourmet dining, high-speed fibre WiFi, and 24/7 biometric security.",
  cities: ["All Cities", "Mumbai", "Pune", "Noida", "Ahmedabad", "Jalandhar"],
  genderWings: [
    "All Wings (Girls / Boys / Co-ed)",
    "Girls Only",
    "Boys Only",
    "Co-ed Living",
  ],
  occupancies: [
    "All Occupancies",
    "Single Occupancy",
    "Double Sharing",
    "Triple Sharing",
  ],
  items: [
    {
      name: "Chapter I",
      occupancy: "Girls Only",
      roomOccupancy: "Double Sharing",
      city: "Mumbai",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "3 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹60,000",
      href: "/residences/chapter-i",
      image: "/images/image03.png",
      colleges: ["NMIMS", "Mithibai", "DJ Sanghvi"],
    },
    {
      name: "Chapter II",
      occupancy: "Girls Only",
      roomOccupancy: "Single Occupancy",
      city: "Mumbai",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "3 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹70,000",
      href: "/residences/chapter-ii",
      image: "/images/image04.png",
      colleges: ["NMIMS", "Mithibai", "DJ Sanghvi"],
    },
    {
      name: "Chapter III",
      occupancy: "Boys Only",
      roomOccupancy: "Triple Sharing",
      city: "Mumbai",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "3 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹50,000",
      href: "/residences/chapter-iii",
      image: "/images/image05.png",
      colleges: ["NMIMS", "Mithibai", "DJ Sanghvi"],
    },
    {
      name: "Chapter IV",
      occupancy: "Girls Only",
      roomOccupancy: "Double Sharing",
      city: "Mumbai",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "3 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹57,000",
      href: "/residences/chapter-iv",
      image: "/images/image06.png",
      colleges: ["NMIMS", "Mithibai", "DJ Sanghvi"],
    },
    {
      name: "Chapter V",
      occupancy: "Co-ed Living",
      roomOccupancy: "Single Occupancy",
      city: "Mumbai",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "3 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image07.jpg",
      colleges: ["NMIMS", "Mithibai", "DJ Sanghvi"],
    },
  ] satisfies ExploreResidenceItem[],
};
