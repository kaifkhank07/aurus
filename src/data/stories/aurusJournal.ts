export interface JournalArticle {
  id: string;
  image: string;
  alt: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  ctaText: string;
  href: string;
}

export interface CommunityBannerData {
  titleTop: string;
  titleAccent: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface AurusJournalData {
  titleTop: string;
  titleAccent: string;
  body: string;
}

export const journalSectionData: AurusJournalData = {
  titleTop: "THE AURUS",
  titleAccent: "Journal.",
  body: "Insights on relocation, student life in Mumbai, Noida & Pune, study productivity hacks, and hostel guides.",
};

export const communityBannerData: CommunityBannerData = {
  titleTop: "WANT TO BECOME PART OF THE AURUS",
  titleAccent: "Community?",
  cta: {
    label: "SCHEDULE VIP VISIT",
    href: "/contact",
  },
};
