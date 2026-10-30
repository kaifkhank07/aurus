"use client"
import { useAssets } from "../assets/assets";

export interface heroActions {
  label: string;
  href: string;
}

export interface heroData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  cities: string;
  actions: heroActions[];
  image: string;
}

const assets = useAssets();

export const hero: heroData = {
  eyebrow: "01 // Aurus · Luxury Student Residences",
  titleTop: "Live Beyond",
  titleAccent: "Ordinary.",
  body: "Thoughtfully designed residences for independent living, meaningful connections, and everything your next chapter deserves.",
  cities: "Mumbai · Noida · Ahmedabad · Pune · Jalandhar",
  actions: [
    { label: "Explore Residences", href: "/residences" },
    { label: "Discover Aurus", href: "#intro" },
  ],
  image: assets.studentHeroBg,
};
