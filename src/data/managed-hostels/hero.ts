"use client";
import { useAssets } from "../assets/assets";

export interface HeroAction {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

export interface KeyDetail {
  label: string;
  value: string;
}

export interface ManagedHeroData {
  eyebrow: string;
  titleLine1: string;
  titleLine2Prefix: string;
  titleAccent: string;
  body: string;
  actions: HeroAction[];
  keyDetailsTitle: string;
  keyDetails: KeyDetail[];
  image: string;
}

const assets = useAssets();

export const managedHero: ManagedHeroData = {
  eyebrow: "AURUS MANAGED RESIDENCES",
  titleLine1: "LIVE WHERE",
  titleLine2Prefix: "GIFT CITY",
  titleAccent: "works.",
  body: "A fully furnished, fully serviced residence for working professionals in GIFT City, Gandhinagar - run by the Aurus team, on stays from 30 days.",
  actions: [
    { label: "BOOK A VIEWING", href: "#living", variant: "primary" },
    { label: "WHATSAPP US", href: "#overview", variant: "secondary" },
  ],
  keyDetailsTitle: "NOW LEASING",
  keyDetails: [
    { label: "Residence", value: "Aurus GIFT City" },
    { label: "Location", value: "GIFT City, Gandhinagar" },
    { label: "Homes", value: "Studios & 1 BHK" },
    { label: "Stays", value: "From 30 days" },
  ],
  image: assets.managedHostelsHeroBg,
};
