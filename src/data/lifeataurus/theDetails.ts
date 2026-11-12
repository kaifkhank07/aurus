import { useAssets } from "../assets/assets";

export interface FacilityData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: { src: string; alt: string };
  amenities: string[];
}

const assets = useAssets();

export const theDetailsData: FacilityData = {
  eyebrow: "03 // FACILITIES",
  titleTop: "THE DETAILS, ",
  titleAccent: "Handled.",
  body: "Available across chapters, with signature amenities at our flagship residences.",
  image: {
    src: assets.aurusfacility1,
    alt: "Resident working out in modern Aurus gym with Hustle wall artwork",
  },
  amenities: [
    "INFINITY POOL",
    "GYM",
    "24/7 BIOMETRIC ACCESS",
    "DAILY MEAL SERVICE",
    "CONCIERGE",
    "PERSONAL BUTLER SERVICE",
    "AIRPORT PICK-UP & DROP",
    "STEAM ROOM",
    "SALON EXPERIENCE",
    "VR ENTERTAINMENT LOUNGE",
    "CONFERENCE ROOM",
    "YOGA ROOM",
  ],
};
