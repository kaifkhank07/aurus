import { useAssets } from "../assets/assets";

export interface CafeAndAppData {
  cafe: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    image: { src: string; alt: string };
  };
  app: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    body: string;
    bullets: string[];
    image: { src: string; alt: string };
  };
}

const assets = useAssets();

export const cafeAndAppData: CafeAndAppData = {
  cafe: {
    eyebrow: "05 // IN-HOUSE CAFÉ",
    titleTop: "A CAFÉ ",
    titleAccent: "Downstairs.",
    body: "Only at Aurus: a full in-house cafe — open daily until late. Hot espresso, small bites, late-night study fuel, and smooth Wi-Fi right from your table.",
    image: {
      src: assets.auruscafe1,
      alt: "Aurus in-house cafe counter and coffee bar",
    },
  },
  app: {
    eyebrow: "06 // RESIDENT APP",
    titleTop: "AURUS AT YOUR ",
    titleAccent: "Fingertips.",
    body: "Need help, have feedback, or want to suggest an event? The resident app is your direct support. Real people who are listening — and acting.",
    bullets: [
      "Pay rent and room expenses seamlessly",
      "Book laundry, housekeeping, and repairs",
      "See menus, events, and announcements",
      "Message your community team",
    ],
    image: {
      src: assets.auruscafe2,
      alt: "Residents using Aurus app on laptop in lounge",
    },
  },
};
