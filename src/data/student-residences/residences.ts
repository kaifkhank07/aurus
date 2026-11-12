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
}

export const residences: ResidenceData = {
  eyebrow: "04 // Residences",
  titleTop: "Find your",
  titleAccent: "Aurus",
  body: "Explore Aurus residences across cities designed around student life.",
 
};
