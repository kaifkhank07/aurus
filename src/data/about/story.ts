import { useAssets } from "../assets/assets";

export interface AboutStoryData {
  titleTop: string;
  titleAccent: string;
  paragraphs: string[];
  image: string;
  alt: string;
}

const assets = useAssets();

export const aboutStoryData: AboutStoryData = {
  titleTop: "THE AURUS",
  titleAccent: "Story.",
  paragraphs: [
    "Built by alumni who remembered the struggle of finding safe, clean, and nutritious student housing in India.",
    "When we moved to metro cities for college, we experienced the grim reality of standard PGs — uninspiring meals, dark rooms, lack of security, and indifferent management.",
    "Aurus was launched to build what we wished we had: beautiful architecture, 5-star hospitality, high-speed fibre internet, chef-cooked meals, and a vibrant community of fellow dreamers.",
  ],
  image: assets.aboutHero,
  alt: "The Aurus Story lounge - Luxury student residences with warm timber and designer lighting",
};
