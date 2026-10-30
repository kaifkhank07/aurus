"use client"
import { useAssets } from "../assets/assets";

export interface StoryAboutData {
  titleTop: string;
  titleAccent: string;
  paragraphs: string[];
  image: string;
  alt: string;
}

const assets = useAssets();

export const storyAboutData: StoryAboutData = {
  titleTop: "THE AURUS",
  titleAccent: "Story.",
  paragraphs: [
    "Aurus began with a simple question: why is it so hard to find a home that is safe, clean, well run and genuinely good to live in when you move to a new city?",
    "Our founders asked it as students, after years of PGs with uninspiring meals, dark rooms, little security and indifferent management. The answer was to build what they had wished for — beautiful architecture, an on-site team that takes care of the everyday, chef-cooked meals, high-speed fibre and a community worth coming home to.",
    "The same idea now goes beyond campus. Aurus runs two lines: Student Residences beside India’s leading colleges, and Managed Residences for working professionals near the business districts. Different stages of life, one standard of living.",
  ],
  image: assets.storyAbout,
  alt: "The Aurus Story lounge - Luxury student residences with warm timber and designer lighting",
};
