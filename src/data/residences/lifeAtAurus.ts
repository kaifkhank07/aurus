import { useAssets } from "../assets/assets";

export interface LifeCategoryItem {
  label: string;
  image: string;
  alt: string;
}

export interface LifeColumn {
  stagger?: boolean;
  top: LifeCategoryItem;
  bottom: LifeCategoryItem;
}

export interface LifeAtAurusData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  cta: { label: string; href: string };
  columns: LifeColumn[];
  items: LifeCategoryItem[];
}

const assets = useAssets();

export const lifeAtAurus: LifeAtAurusData = {
  eyebrow: "LIFE & AURUS",
  titleTop: "NOT JUST WHERE YOU",
  titleAccent: "Stay.",
  body: "A Chapter is only half the story. Study pods that stay silent at 2am, four meals you didn't have to think about, a terrace for yoga and a courtyard for doing nothing at all - the same six things, in every residence.",
  cta: {
    label: "EXPLORE LIFE @ AURUS",
    href: "/life-at-aurus",
  },
  columns: [
    {
      stagger: false,
      top: {
        label: "STUDY",
        image: assets.auruslife1,
        alt: "Resident focused on studying in quiet alcove",
      },
      bottom: {
        label: "CONNECT",
        image: assets.auruslife4,
        alt: "Residents bonding and conversing in lounge",
      },
    },
    {
      stagger: true,
      top: {
        label: "EAT",
        image: assets.auruslife2,
        alt: "Residents sharing fresh communal meals",
      },
      bottom: {
        label: "UNWIND",
        image: assets.auruslife5,
        alt: "Residents relaxing in modern living area",
      },
    },
    {
      stagger: false,
      top: {
        label: "MOVE",
        image: assets.auruslife3,
        alt: "Resident exercising on treadmill in fitness gym",
      },
      bottom: {
        label: "ENJOY",
        image: assets.auruslife6,
        alt: "Residents playing foosball in recreation space",
      },
    },
  ],
  items: [
    {
      label: "STUDY",
      image: assets.auruslife1,
      alt: "Resident focused on studying in quiet alcove",
    },
    {
      label: "EAT",
      image: assets.auruslife2,
      alt: "Residents sharing fresh communal meals",
    },
    {
      label: "MOVE",
      image: assets.auruslife3,
      alt: "Resident exercising on treadmill in fitness gym",
    },
    {
      label: "CONNECT",
      image: assets.auruslife4,
      alt: "Residents bonding and conversing in lounge",
    },
    {
      label: "UNWIND",
      image: assets.auruslife5,
      alt: "Residents relaxing in modern living area",
    },
    {
      label: "ENJOY",
      image: assets.auruslife6,
      alt: "Residents playing foosball in recreation space",
    },
  ]
};
