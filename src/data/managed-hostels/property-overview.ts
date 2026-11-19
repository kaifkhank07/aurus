"use client";
import { useAssets } from "../assets/assets";

export interface PropertyFeature {
  label: string;
  value: string;
}

export interface PropertyOverviewData {
  eyebrowLeft: string;
  eyebrowRight: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  image: string;
  features: PropertyFeature[];
}

const assets = useAssets();

export const propertyOverview: PropertyOverviewData = {
  eyebrowLeft: "01 // THE RESIDENCE",
  eyebrowRight: "AURUS GIFT CITY",
  titleTop: "A HOME THAT",
  titleAccent: "Runs itself.",
  description:
    "Aurus GIFT City brings the way we run our student residences to working professionals: an on-site team, considered design, good food on tap and a community of neighbours who keep the same hours you do.",
  image: assets.managedHostelsPropertyOverview,
  features: [
    {
      label: "LOCATION",
      value: "GIFT City, Gandhinagar, Gujarat",
    },
    {
      label: "HOMES",
      value: "Fully furnished studios and one-bedroom homes",
    },
    {
      label: "INCLUDED",
      value: "Furnishing, housekeeping, high-speed fibre, gym, security",
    },
    {
      label: "OPTIONAL",
      value: "Meal plans and a reserved desk in the business lounge",
    },
    {
      label: "STAY",
      value: "From 30 days, extend month to month",
    },
    {
      label: "BEST FOR",
      value: "Relocating professionals, project teams, new joiners",
    },
  ],
};
