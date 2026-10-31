export type IResidence = {
  name: string;
  occupancy: "Girls Only" | "Boys Only" | "Co-ed Living";
  featured: boolean;
  locality: string;
  distance: string;
  priceFrom: string;
  href: string;
  image: string | null;
};


export interface ResidenceData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  items: IResidence[];
}

export const residences: ResidenceData = {
  eyebrow: "04 // Residences",
  titleTop: "Find your",
  titleAccent: "Aurus",
  body: "Explore Aurus residences across cities designed around student life.",
  items: [
    {
      name: "Chapter I",
      occupancy: "Girls Only",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹60,000",
      href: "/residences/chapter-i",
      image: "/images/image03.png",
    },
    {
      name: "Chapter II",
      occupancy: "Girls Only",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹70,000",
      href: "/residences/chapter-ii",
      image: "/images/image04.png",
    },
    {
      name: "Chapter III",
      occupancy: "Boys Only",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹50,000",
      href: "/residences/chapter-iii",
      image: "/images/image05.png",
    },
    {
      name: "Chapter IV",
      occupancy: "Boys Only",
      featured: true,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹57,000",
      href: "/residences/chapter-iv",
      image: "/images/image06.png",
    },
    {
      name: "Chapter V",
      occupancy: "Co-ed Living",
      featured: false,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image07.jpg",
    },
    {
      name: "Chapter VI",
      occupancy: "Co-ed Living",
      featured: false,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image03.png",
    },
    {
      name: "Chapter VII",
      occupancy: "Co-ed Living",
      featured: false,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image04.png",
    },
    {
      name: "Chapter VIII",
      occupancy: "Co-ed Living",
      featured: false,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image05.png",
    },
    {
      name: "Chapter IX",
      occupancy: "Co-ed Living",
      featured: false,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image06.png",
    },
    {
      name: "Chapter X",
      occupancy: "Co-ed Living",
      featured: false,
      locality: "Vile Parle · Mumbai",
      distance: "5 mins from NMIMS, Mithibai & DJ Sanghvi",
      priceFrom: "₹85,000",
      href: "/residences/chapter-v",
      image: "/images/image07.jpg",
    },
  ],
};
