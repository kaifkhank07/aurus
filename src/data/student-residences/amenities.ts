import { useAssets } from "../assets/assets";

export interface IAmenity {
  title: string;
  body: string;
  image: string;
}


export interface amenitiesData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  items: IAmenity[];
}


const assets = useAssets();

export const amenities: amenitiesData = {
  eyebrow: "06 // Life @ Aurus",
  titleTop: "Not just where you",
  titleAccent: "Stay.",
  items: [
    {
      title: "AIRPORT TRANSFERS",
      body: "Enjoy seamless airport transfers with comfortable rides and dedicated assistance. Travel effortlessly with a service designed around your convenience.",
      image: assets.aurusprevileges1,
    },
    {
      title: "IN-HOUSE CAFÉ – ORIGINS BY AURUS",
      body: "Discover thoughtfully curated food and beverages in a welcoming ambience. A perfect space to unwind, connect and savour every moment.",
      image: assets.aurusprevileges2,
    },
    {
      title: "BUTLER SERVICE",
      body: "Experience personalised assistance with a dedicated team at your service. From everyday requests to special arrangements, enjoy effortless living.",
      image: assets.aurusprevileges3,
    },
    {
      title: "SMART ROOMS",
      body: "Experience intelligent living with thoughtfully designed smart-room features. Enjoy seamless technology, enhanced comfort and complete convenience.",
      image: assets.aurusprevileges4,
    },
    {
      title: "PICKLEBALL COURT",
      body: "Stay active and embrace the spirit of friendly competition. Enjoy a vibrant sporting experience designed for fitness and fun.",
      image: assets.aurusprevileges5,
    },
    {
      title: "IN-HOUSE SALON",
      body: "Indulge in professional grooming and self-care without stepping out. Enjoy a premium salon experience, right within your residence.",
      image: assets.aurusprevileges6,
    },
  ],
};
