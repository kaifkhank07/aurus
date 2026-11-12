import { Coffee, Leaf, LucideIcon, MessageSquare, ShieldCheck, Smartphone, UsersRound } from "lucide-react";
import { useAssets } from "../assets/assets";



export interface TimelineSlot {
  time: string;
  activity: string;
  image: string;
}


export interface yearlyRhythmData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  timeline: TimelineSlot[];
}

const assets = useAssets();

export const yearlyRhythmData: yearlyRhythmData = {
  eyebrow: "DAILY RHYTHM",
  titleTop: "THE AURUS",
  titleAccent: "Year.",
  body: "A venue for curiosity, dialogue, and shared experiences",
  timeline: [
    {
      time: "Nov",
      activity: "The Aurus Padel Cup",
      image: assets.aurusyear1,

    },
    {
      time: "Nov",
      activity: "AI for Academic Edge",
      image: assets.aurusyear2,
    },
    {
      time: "Nov",
      activity: "The Aurus Masterclass",
      image: assets.aurusyear3,

    },
    {
      time: "Dec",
      activity: "The Aurus Yacht Evening",
      image: assets.aurusyear4,

    },
    {
      time: "Jan",
      activity: "The Aurus Wellness Reset",
      image: assets.aurusyear5,
    },
  ],
}
