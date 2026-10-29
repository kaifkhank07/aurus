export interface StoryStat {
  value: string;
  label: string;
}

export interface StoryReview {
  id: string;
  rating: number;
  quote: string;
  author: string;
  role: string;
  initials: string;
}

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
  reviewsSection: {
    titleTop: string;
    titleAccent: string;
    body: string;
    stats: StoryStat[];
    reviews: StoryReview[];
  };
  journalSection: {
    titleTop: string;
    titleAccent: string;
    body: string;
    articles: JournalArticle[];
  };
  communityBanner: CommunityBannerData;
}

export const storiesData: StoriesPageData = {
  reviewsSection: {
    titleTop: "REAL STORIES, GENUINE",
    titleAccent: "Experiences",
    body: "What residents and parents say about living at Aurus — in their words.",
    stats: [
      {
        value: "4.9/5",
        label: "AVERAGE RATING",
      },
      {
        value: "5,000+",
        label: "RESIDENTS SO FAR",
      },
      {
        value: "5",
        label: "CITIES ACROSS INDIA",
      },
      {
        value: "9",
        label: "LIVE CHAPTERS",
      },
    ],
    reviews: [
      {
        id: "review-1",
        rating: 5,
        quote:
          "Living at Aurus feels less like staying somewhere and more like having a place of your own.",
        author: "Riya S.",
        role: "NMIMS · Chapter V",
        initials: "RS",
      },
      {
        id: "review-2",
        rating: 5,
        quote:
          "I moved from Guwahati knowing no one. First week there was a terrace movie night and I haven't eaten dinner alone since.",
        author: "Meghna B.",
        role: "UPC College · Chapter II",
        initials: "MB",
      },
      {
        id: "review-3",
        rating: 5,
        quote:
          "As an international student, the front desk helped with everything — SIM card, bank account, even my FRRO paperwork queue.",
        author: "Tendai M.",
        role: "LPU · Chapter IX",
        initials: "TM",
      },
      {
        id: "review-4",
        rating: 5,
        quote:
          "My parents visited once and stopped calling every night. The security desk and the food did that.",
        author: "Ananya K.",
        role: "Mithibai College · Chapter I",
        initials: "AK",
      },
      {
        id: "review-5",
        rating: 5,
        quote:
          "Rooms are cleaned daily, laundry is sorted, meals are on time. I only have to think about classes and football.",
        author: "Kabir R.",
        role: "Amity University · Chapter VI",
        initials: "KR",
      },
      {
        id: "review-6",
        rating: 5,
        quote:
          "We compared six PGs before choosing. Aurus was the only one where the price on the website was the price we paid.",
        author: "Sunita Mehra",
        role: "Parent · Chapter I",
        initials: "SM",
      },
      {
        id: "review-7",
        rating: 5,
        quote:
          "The study pods saved my semester. Quiet at 2am, but the lounge downstairs is where I found my people.",
        author: "Arjun M.",
        role: "DJ Sanghvi · Chapter IV",
        initials: "AM",
      },
      {
        id: "review-8",
        rating: 5,
        quote:
          "Being next to Hilltop means I roll out of bed and I'm at class. The valley view at sunrise is a bonus.",
        author: "Ishaan P.",
        role: "Symbiosis · Chapter VIII",
        initials: "IP",
      },
      {
        id: "review-9",
        rating: 5,
        quote:
          "The app is underrated. Raise a request at night, it's fixed before lunch.",
        author: "Rohan D.",
        role: "NMIMS · Chapter III",
        initials: "RD",
      },
    ],
  },
  journalSection: {
    titleTop: "THE AURUS",
    titleAccent: "Journal.",
    body: "Insights on relocation, student life in Mumbai, Noida & Pune, study productivity hacks, and hostel guides.",
    articles: [
      {
        id: "journal-1",
        image: "/images/journal-1.png",
        alt: "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai",
        category: "CITY GUIDES",
        date: "SEP 14, 2026",
        readTime: "4 MIN READ",
        title:
          "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai (Vile Parle 2026)",
        excerpt:
          "Finding student accommodation in Mumbai can be chaotic. Here is what to look for: distance, safety protocols, dining options, and quiet study spaces.",
        ctaText: "READ GUIDE",
        href: "/stories/guide-luxury-pgs-nmims-mithibai",
      },
      {
        id: "journal-2",
        image: "/images/journal-2.png",
        alt: "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        category: "STUDENT LIFE",
        date: "AUG 28, 2026",
        readTime: "5 MIN READ",
        title:
          "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        excerpt:
          "Sector 126 and Knowledge Park in Noida are booming. Explore why modern students demand hospitality-driven living spaces.",
        ctaText: "READ GUIDE",
        href: "/stories/gen-z-noida-hostels-lifestyle-residences",
      },
      {
        id: "journal-3",
        image: "/images/journal-3.png",
        alt: "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        category: "ESSENTIAL TIPS",
        date: "AUG 10, 2026",
        readTime: "3 MIN READ",
        title:
          "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        excerpt:
          "Since Aurus includes premium bedding, towels, and daily housekeeping, your packing list gets cut in half!",
        ctaText: "READ GUIDE",
        href: "/stories/minimalist-packing-list-first-month",
      },
    ],
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
