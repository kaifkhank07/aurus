import { useAssets } from "../assets/assets";

export interface ExperienceFeature {
  number: string;
  title: string;
  detail: string;
}

export interface AboutCherishExperienceData {
  titleTop: string;
  titleAccent: string;
  body: string;
  features: ExperienceFeature[];
  actions: {
    label: string;
    href: string;
    variant?: "outline" | "solid";
  }[];
  photos: {
    topRight: { src: string; alt: string };
    middle: { src: string; alt: string };
    bottomLeft: { src: string; alt: string };
    bottomRight: { src: string; alt: string };
  };
}


const assets = useAssets();

export const aboutCherishExperienceData: AboutCherishExperienceData = {
  titleTop: "NOT JUST A PLACE TO STAY",
  titleAccent: "— an experience to cherish.",
  body: "We know studying and living away from home can be challenging. So we prioritise your safety, simplify the daily tasks, serve home-cooked meals, and offer academic support – in spaces where worry-free living meets exceptional hospitality.",
  features: [
    {
      number: "01",
      title: "Safety first",
      detail: "Biometric entry, warden 24/7",
    },
    {
      number: "02",
      title: "Daily tasks handled",
      detail: "Housekeeping & laundry",
    },
    {
      number: "03",
      title: "Home-style meals",
      detail: "nutritious menu",
    },
    {
      number: "04",
      title: "Academic support",
      detail: "& study-friendly spots",
    },
  ],
  actions: [
    {
      label: "EXPLORE LIFE @ AURUS",
      href: "/life-at-aurus",
      variant: "outline",
    },
    {
      label: "COME OVER & FEEL THE DIFFERENCE",
      href: "/contact",
      variant: "solid",
    },
  ],
  photos: {
    topRight: {
      src: assets.aboutCherish1,
      alt: "Aurus residents smiling outdoors by the rooftop pool",
    },
    middle: {
      src: assets.aboutCherish2,
      alt: "Resident DJ performing at an evening social celebration",
    },
    bottomLeft: {
      src: assets.aboutCherish3,
      alt: "Open-air movie screening under evening ambient lighting",
    },
    bottomRight: {
      src: assets.aboutCherish4,
      alt: "Community friends bonding and enjoying a weekend social",
    },
  },
};
