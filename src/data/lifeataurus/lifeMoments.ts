import { useAssets } from "../assets/assets";

export interface MomentItem {
  image: string;
  label: string;
  alt: string;
}

export interface MomentsGalleryData {
  eyebrow: string;
  items: MomentItem[];
}


const assets = useAssets();

export const lifeMomentsData: MomentsGalleryData = {
  eyebrow: "04 // MOMENTS",
  items: [
    {
      image: assets.moment1,
      label: "LOUNGE & CONVERSATIONS",
      alt: "Residents relaxing and conversing in lounge",
    },
    {
      image: assets.moment2,
      label: "GAME NIGHTS",
      alt: "Students enjoying football game on screen in entertainment lounge",
    },
    {
      image: assets.moment3,
      label: "FOOSBALL SHOWDOWN",
      alt: "Residents playing foosball together",
    },
    {
      image: assets.moment4,
      label: "QUIET EVENINGS",
      alt: "Student reading a book peacefully in bedroom",
    },
    {
      image: assets.moment5,
      label: "GRAB & GO CAFÉ",
      alt: "Resident getting quick drink at grab and go counter",
    },
    {
      image: assets.moment6,
      label: "CELEBRATE TOGETHER",
      alt: "Aurus residents celebrating festival together",
    },
    {
      image: assets.moment7,
      label: "STUDY & CHILLING",
      alt: "Students sharing notes and study session on tablet",
    },
    {
      image: assets.moment8,
      label: "HUSTLING TOGETHER",
      alt: "Group of friends collaborating in common lounge space",
    },
  ],
};
