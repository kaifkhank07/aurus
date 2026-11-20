import { useAssets } from "../assets/assets";

export interface CommunityFeature {
  text: string;
}

export interface CommunityIntentionData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  image: {
    src: string;
    alt: string;
  };
  features: CommunityFeature[];
}

const assets = useAssets();

export const communityIntentionData: CommunityIntentionData = {
  eyebrow: "03 // COMMUNITY",
  titleTop: "COMMUNITY IS",
  titleAccent: "THE Intention.",
  subtitle: "We create an environment where students don’t just stay - they thrive.",
  image: {
    src: assets.operatedCommunity,
    alt: "Aurus in-house artisanal cafe and reception counter with warm timber aesthetics and modern lighting",
  },
  features: [
    { text: "Weekly social, cultural and community events" },
    { text: "Wellness activities and skills-based workshops" },
    { text: "Resident support systems for emotional well-being" },
    { text: "An operations team trained to understand student life" },
  ],
};
