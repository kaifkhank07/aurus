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
  body: "Not a listing. A place people actually live - 0.5x wide selfies, flash-photo game nights, mid-day lounge naps, and genuine memories made with friends.",
  note: "Sourced directly from real resident moments across Mumbai, Noida, Ahmedabad & Pune.",
  badge: { label: "Experience Aurus", href: "/life-at-aurus" },
  photos: [
    { src: assets.lifeataurus1, alt: "Residents on a rooftop", offset: 49 },
    { src: assets.lifeataurus2, alt: "DJ set at an Aurus event", offset: 0 },
    { src: assets.lifeataurus3, alt: "Residents at a house party", offset: 49 },
    { src: assets.lifeataurus4, alt: "Match night in the lounge", offset: 0 },
    { src: assets.lifeataurus5, alt: "Rooftop gathering", offset: 21 },
  ],
};
