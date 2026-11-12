import { useAssets } from "../assets/assets";

export interface chapterCTA {
  label: string;
  href: string;
}

export interface IRecentWork {
  name: string;
  image: string;
}

export interface cahpterData {
  eyebrow: string;
  watermark: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  cta: chapterCTA;
  recentWork: IRecentWork[];
}

const assets = useAssets();

export const chapter: cahpterData = {
  eyebrow: "03 // A Different Kind of Living",
  watermark: "CHAPTER",
  titleTop: "Designed for your next",
  titleAccent: "Chapter.",
  body: "Designed for your next chapter — nine luxury residences and 2,500+ curated beds across India's premier academic capitals, combining total independence, boutique hospitality, and a vibrant student community.",
  cta: { label: "Residences Page", href: "/hostels" },
  recentWork: [
    {
      name: "work 1",
      image: assets.chapterRecentWork1
    },
    {
      name: "work 2",
      image: assets.chapterRecentWork2
    },
  ]
};
