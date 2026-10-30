"use client"
import { useAssets } from "../assets/assets";

export interface IPosts {
  handle: string,
  caption: string,
  likes: number,
  comments: number,
  timeAgo: string,
  isVideo: boolean,
  image: string,
  alt: string,
}

export interface cultureData {
  eyebrow: string;
  handleLink: { label: string, href: string };
  titleTop: string;
  titleAccent: string;
  posts: IPosts[];
}

const assets = useAssets();

export const culture: cultureData = {
  eyebrow: "07 // Real Resident Moments",
  handleLink: { label: "#auruslife", href: "/life-at-aurus" },
  titleTop: "Culture &",
  titleAccent: "Community.",
  posts: [
    {
      handle: "aurus_luxuryresidences",
      caption:
        "Step behind the curtains as Arjun, a professional illusionist and showman, takes you into a world......",
      likes: 569,
      comments: 150,
      timeAgo: "1 hour ago",
      isVideo: false,
      image: assets.culture1,
      alt: "The Art of Mischief event poster",
    },
    {
      handle: "aurus_luxuryresidences",
      caption: "THE GAME IS ON.\nThe jersey. The team. The pride.",
      likes: 560,
      comments: 150,
      timeAgo: "4 days ago",
      isVideo: true,
      image: assets.culture2,
      alt: "The Wait Is Over teaser still",
    },
    {
      handle: "aurus_luxuryresidences",
      caption:
        "Hi, I'm Bharat, and I run the biggest luxury residencies for college students in India.",
      likes: 500,
      comments: 150,
      timeAgo: "4 days ago",
      isVideo: false,
      image: assets.culture3,
      alt: "Founder speaking to camera",
    },
    {
      handle: "aurus_luxuryresidences",
      caption: "Ganesh Chaturthi at Aurus",
      likes: 500,
      comments: 150,
      timeAgo: "7 days ago",
      isVideo: false,
      image: assets.culture4,
      alt: "Festival celebration at an Aurus residence",
    },
  ],
};
