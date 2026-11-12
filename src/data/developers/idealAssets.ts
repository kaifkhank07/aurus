import { useAssets } from "../assets/assets";

export interface IdealAssetCriterion {
  icon: string;
  text: string;
}

export interface IdealAssetsData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: {
    src: string;
    alt: string;
  };
  criteria: IdealAssetCriterion[];
}

const assets = useAssets();

export const idealAssetsData: IdealAssetsData = {
  eyebrow: "04 // IDEAL ASSETS",
  titleTop: "WHAT WE LOOK",
  titleAccent: "For.",
  body: "Delightful spaces in our in-house cafes — specialty coffee, fresh bakes and late-night study fuel, ordered by QR right from your table.",
  image: {
    src: assets.developerIdialAssets,
    alt: "Aurus in-house artisanal cafe and reception counter with warm timber aesthetics and modern lighting",
  },
  criteria: [
    {
      icon: "location",
      text: "Turnkey PGs and off-plan plots (close to top tertiary spots)",
    },
    {
      icon: "building",
      text: "Bare shell residential buildings (min 50-bed, plotted and-in-line)",
    },
    {
      icon: "security",
      text: "Clear titles, commercial/mixed-use or residential zoning permissions",
    },
    {
      icon: "food",
      text: "Convenient access to campuses, transit nodes and student activity corridors",
    },
    {
      icon: "community",
      text: "Developers and landowners seeking reliable, institutional long-term operating partners",
    },
  ],
};
