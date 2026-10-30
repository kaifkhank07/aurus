"use client"
import { useAssets } from "../assets/assets";

export interface IBrand {
  eyebrow: string,
  titleTop: string,
  titleAccent: string,
  body: string,
  cities: string,
  cta: { label: string, href: string },
  image: string,
  alt: string,
}

export interface footerBar {
  phone: { label: string, href: string },
  legal: string,
  email: { label: string, href: string },
}

export interface landingData {
  chooseLabel: string;
  brands: IBrand[];
  footerBar: footerBar;
}

const assets = useAssets();

export const landing: landingData = {
  chooseLabel: "Choose your residence",
  brands: [
    {
      eyebrow: "01 · For students",
      titleTop: "Luxury Student",
      titleAccent: "Residences",
      body: "Premium residences next to India’s leading campuses — meals, security and community included.",
      cities: "Mumbai · Noida · Ahmedabad · Pune · Jalandhar",
      cta: { label: "Enter", href: "/student-residences" },
      image: assets.chooseResidence1,     // image: "/images/image-01.jpg"
      alt: "Aurus student residence living room",
    },
    {
      eyebrow: "02 · For working professionals",
      titleTop: "Luxury Managed",
      titleAccent: "Residences",
      body: "Fully furnished, fully serviced homes near business districts — stays from 30 days.",
      cities: "Mumbai · Pune · Noida · GIFT City",
      cta: { label: "Enter", href: "/managed-residences" },
      image: assets.chooseResidence2,
      alt: "Aurus managed residence workspace and lounge",
    },
  ],
  footerBar: {
    phone: { label: "1800-572-0709", href: "tel:18005720709" },
    legal: "A unit of Colstay Limited",
    email: { label: "info@auruslife.com", href: "mailto:info@auruslife.com" },
  },
};

export const chooseResidenceData = landing;
