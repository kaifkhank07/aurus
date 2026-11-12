import { useAssets } from "../assets/assets";

export interface TimelineSlot {
  time: string;
  activity: string;
}

export interface DayAtAurusData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  image: { src: string; alt: string };
  timeline: TimelineSlot[];
}

const assets = useAssets();

export const dayAtAurusData: DayAtAurusData = {
  eyebrow: "02 // DAILY RHYTHM",
  titleTop: "A DAY AT",
  titleAccent: "Aurus.",
  body: "Designed around student timetables — with room for focus, food, movement and doing nothing at all.",
  image: {
    src: assets.aurusday1,
    alt: "Residents sharing freshly prepared dinner in dining hall",
  },
  timeline: [
    {
      time: "07 : 00",
      activity: "Terrace yoga and a fresh juice before the day starts",
    },
    {
      time: "08 : 30",
      activity: "Breakfast in the dining hall — hot, plated and on time",
    },
    {
      time: "10 : 00",
      activity: "Classes: your room is cleaned while you're out",
    },
    {
      time: "13 : 30",
      activity: "Lunch, or a packed tiffin if your timetable runs long",
    },
    {
      time: "18 : 00",
      activity: "Evening snacks and the study pods fill up",
    },
    {
      time: "19 : 30",
      activity: "Gym, foosball, or the games lounge",
    },
    {
      time: "20 : 30",
      activity: "Dinner with whoever's around — usually everyone",
    },
    {
      time: "22 : 00",
      activity: "Movies on the terrace, or quiet hours on the study floor",
    },
  ],
};
