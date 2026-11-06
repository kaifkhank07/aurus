import { Coffee, Leaf, LucideIcon, MessageSquare, ShieldCheck, Smartphone, UsersRound } from "lucide-react";



export interface TimelineSlot {
  time: string;
  activity: string;
}


export interface yearlyRhythmData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: { src: string; alt: string };
  timeline: TimelineSlot[];
}

export const yearlyRhythmData: yearlyRhythmData = {
  eyebrow: "DAILY RHYTHM",
  titleTop: "THE AURUS",
  titleAccent: "Year.",
  body: "A venue for curiosity, dialogue, and shared experiences",
  image: {
    src: "/images/static/image-07.png",
    alt: "Residents sharing freshly prepared dinner in dining hall",
  },
  timeline: [
    {
      time: "Nov",
      activity: "The Aurus Padel Cup",
    },
    {
      time: "Nov",
      activity: "AI for Academic Edge",
    },
    {
      time: "Nov",
      activity: "The Aurus Masterclass",
    },
    {
      time: "Dec",
      activity: "The Aurus Yacht Evening",
    },
    {
      time: "Jan",
      activity: "The Aurus Wellness Reset",
    },
  ],
}
