import { useAssets } from "../assets/assets";

export interface DeveloperHeroData {
  titleTop: string;
  titleAccent: string;
  body: string;
  actions: {
    label: string;
    href: string;
    variant: "solid" | "outline";
  }[];
  image: {
    src: string;
    alt: string;
  };
}

const assets = useAssets();

export const developerHeroData: DeveloperHeroData = {
  titleTop: "BUILD PRE-LEASED STUDENT HOUSING WITH",
  titleAccent: "Aurus.",
  body: "We partner with developers, landowners and institutional investors to turn residential and mixed-use real estate into premium, high-occupancy student housing — from concept to operations.",
  actions: [
    {
      label: "FOR DEVELOPERS",
      href: "#submit-property",
      variant: "solid",
    },
    {
      label: "FINANCIAL MODEL",
      href: "#partnership-models",
      variant: "outline",
    },
    {
      label: "PROTOTYPE",
      href: "#what-we-look-for",
      variant: "outline",
    },
  ],
  image: {
    src: assets.developerHero,
    alt: "Aurus luxury student residence lounge interior with designer seating and architectural mezzanine",
  },
};
