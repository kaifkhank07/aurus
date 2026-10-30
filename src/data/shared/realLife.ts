"use client"
import { useAssets } from "../assets/assets";

export interface IPhotos {
  src: string;
  alt: string;
  offset: number;
}

export interface realLifeData {
  titleTop: string;
  titleAccent: string;
  body: string;
  note: string;
  badge: {
    label: string;
    href: string;
  },
  photos: IPhotos[];
}

const assets = useAssets();

export const realLife: realLifeData = {
  titleTop: "Real life at",
  titleAccent: "Aurus",
  body: "Not a listing. A place people actually live - late-night study sessions and weekend game nights, rooftop dinners after a long day at work, and neighbours who become friends.",
  note: "Moments from Aurus residents - students and professionals - across Mumbai, Noida, Ahmedabad, Pune & Jalandhar.",
  badge: { label: "Experience Aurus", href: "/life-at-aurus" },
  photos: [
    { src: assets.lifeataurus1, alt: "Residents on a rooftop", offset: 49 },
    { src: assets.lifeataurus2, alt: "DJ set at an Aurus event", offset: 0 },
    { src: assets.lifeataurus3, alt: "Residents at a house party", offset: 49 },
    { src: assets.lifeataurus4, alt: "Match night in the lounge", offset: 0 },
    { src: assets.lifeataurus5, alt: "Rooftop gathering", offset: 21 },
  ],
};
