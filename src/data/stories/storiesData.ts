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

export interface StoriesPageData {
  journalSection: {
    titleTop: string;
    titleAccent: string;
    body: string;
    articles?: JournalArticle[];
  };
  communityBanner: CommunityBannerData;
}

export const storiesData: StoriesPageData = {
  journalSection: {
    titleTop: "THE AURUS",
    titleAccent: "Journal.",
    body: "Insights on relocation, student life in Mumbai, Noida & Pune, study productivity hacks, and hostel guides.",
    articles: [],
  },
  communityBanner: {
    titleTop: "WANT TO BECOME PART OF THE AURUS",
    titleAccent: "Community?",
    cta: {
      label: "SCHEDULE VIP VISIT",
      href: "/contact",
    },
  },
};
