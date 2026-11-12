export interface UpcomingChapterItem {
  chapter: string;
  location: string;
  detail: string;
}

export interface UpcomingChaptersData {
  eyebrow: string;
  badge: string;
  titleTop: string;
  titleAccent: string;
  items: UpcomingChapterItem[];
}

export const upcomingChapters: UpcomingChaptersData = {
  eyebrow: "EXPANSION ROADMAP 2026-2027",
  badge: "COMING SOON",
  titleTop: "UPCOMING AURUS",
  titleAccent: "Chapters.",
  items: [
    {
      chapter: "CHAPTER VI",
      location: "GREATER NOIDA",
      detail: "Near Bennett & Sharda Universities • Launching Q1 2027",
    },
    {
      chapter: "CHAPTER VII",
      location: "NAVI MUMBAI",
      detail: "Near DY Patil & Seawoods Hub • Launching Q2 2027",
    },
  ]
};
