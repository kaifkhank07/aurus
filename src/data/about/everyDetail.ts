import { useAssets } from "../assets/assets";

export interface AmenityItem {
  number: string;
  title: string;
}

export interface AboutEveryDetailData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: string;
  alt: string;
  items: AmenityItem[];
}

const assets = useAssets();

export const aboutEveryDetailData: AboutEveryDetailData = {
  eyebrow: "EXCLUSIVE AMENITIES",
  titleTop: "EVERY DETAIL,",
  titleAccent: "Considered.",
  body: "At Aurus, experience a lifestyle crafted with luxury and convenience in mind – state-of-the-art fitness centres, elegantly designed common areas, high-speed Wi-Fi and 24/7 security. Relax in the lounges, unwind on the rooftop, and let the concierge take care of the rest.",
  image: assets.aboutDetails,
  alt: "Aurus recreation and games lounge with pool table and foosball",
  items: [
    { number: "01", title: "INFINITY POOL" },
    { number: "02", title: "WORLD-CLASS GYM" },
    { number: "03", title: "RFID IN ALL ROOMS" },
    { number: "04", title: "5-STAR DINING EXPERIENCE" },
    { number: "05", title: "CONCIERGE" },
    { number: "06", title: "PERSONAL BUTLER" },
    { number: "07", title: "AIRPORT PICK-UP & DROP" },
    { number: "08", title: "STEAM ROOM" },
    { number: "09", title: "SALON EXPERIENCE" },
    { number: "10", title: "DEDICATED MANAGER" },
    { number: "11", title: "PREMIUM CONFERENCE ROOM" },
    { number: "12", title: "YOGA ROOM" },
  ],
};
