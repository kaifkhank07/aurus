import { useAssets } from "../assets/assets";

export interface IImages {
  src: string;
  alt: string;
}

export interface LifeHeroData {
  titleTop: string;
  titleAccent: string;
  body: string;
  images: IImages[];
}

const assets = useAssets();

export const lifeHeroData: LifeHeroData = {
  titleTop: "LIFE @",
  titleAccent: "Aurus",
  body: "Not just a place to sleep - a hospitality-led home designed for safety, focus and the friendships that make college what it is.",
  images: [
    {
      src: assets.lifeHeroImage1,
      alt: "Aurus community celebrating and connecting at house party",
    },
    {
      src: assets.lifeHeroImage2,
      alt: "Resident DJ performing at evening music session",
    },
    {
      src: assets.lifeHeroImage3,
      alt: "Students bonding together outdoors on the terrace",
    },
  ],
};
