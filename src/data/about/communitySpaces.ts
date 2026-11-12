import { useAssets } from "../assets/assets";

export interface CommunitySpaceItem {
  image: string;
  alt: string;
}

export interface AboutCommunitySpacesData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  cta: {
    label: string;
    href: string;
  };
  items: CommunitySpaceItem[];
}

const assets = useAssets();

export const aboutCommunitySpacesData: AboutCommunitySpacesData = {
  eyebrow: "COMMUNITY SPACES",
  titleTop: "THE HEART OF THE",
  titleAccent: "Residence.",
  body: "Vibrant communal spaces that foster connection, collaboration and the memories you keep. From quiet library corners to dining halls and rooftop decks – this is where neighbours become friends.",
  cta: {
    label: "LIFE @ AURUS",
    href: "/life-at-aurus",
  },
  items: [
    {
      image: assets.aboutCommuntySpace1,
      alt: "Double-height residence lounge with architectural mezzanine and custom pendant lighting",
    },
    {
      image: assets.aboutCommuntySpace2,
      alt: "Quiet reading and conversation lounge with rich timber accents and bespoke seating",
    },
    {
      image: assets.aboutCommuntySpace3,
      alt: "Contemporary media lounge with fluted wall paneling and natural illumination",
    },
    {
      image: assets.aboutCommuntySpace4,
      alt: "Collaborative study hall with expansive library shelves and shared workstations",
    },
  ],
};
