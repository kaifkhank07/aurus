export interface UpcomingChapterItem {
  chapter: string;
  location: string;
  detail: string;
}

export const upcomingChapters = {
  eyebrow: "EXPANSION ROADMAP 2026-2027",
  badge: "COMING SOON",
  titleTop: "UPCOMING AURUS",
  titleAccent: "Chapters.",
  items: [
    {
      chapter: "CHAPTER VI",
      location: "GREATER NOIDA",
      detail: "Near Shiv Nadar & Bennett University · Launching Q3 2026",
    },
    {
      chapter: "CHAPTER VII",
      location: "NAVI MUMBAI",
      detail: "Near NMIMS Navi Mumbai & DY Patil · Launching Q4 2026",
    },
  ] satisfies UpcomingChapterItem[],
};
