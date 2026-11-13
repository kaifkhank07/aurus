import { useAssets } from "../assets/assets";

export interface IAurusEvent {
  id: string;
  number: string;
  month: string;
  badge: "OPEN TO ALL RESIDENTS" | "TIERED ACCESS" | string;
  title: string;
  description: string;
  note?: string;
  image: string;
}

export type IAurusYearEvent = IAurusEvent;

export interface IAurusTimelineMonth {
  key: string;
  label: string;
  count: number;
}

export type IAurusYearTimelineItem = IAurusTimelineMonth;

export interface AurusEventsData {
  timeline: IAurusTimelineMonth[];
  events: IAurusEvent[];
}

const assets = useAssets();

export const aurusEventsData: AurusEventsData = {
  timeline: [
    { key: "JUL", label: "JUL", count: 1 },
    { key: "AUG", label: "AUG", count: 1 },
    { key: "SEP", label: "SEP", count: 2 },
    { key: "OCT", label: "OCT", count: 2 },
    { key: "NOV", label: "NOV", count: 1 },
    { key: "DEC", label: "DEC", count: 1 },
    { key: "JAN", label: "JAN", count: 1 },
    { key: "FEB", label: "FEB", count: 1 },
    { key: "MAR", label: "MAR", count: 1 },
    { key: "ALL YEAR", label: "ALL YEAR", count: 1 },
    { key: "ONGOING", label: "ONGOING", count: 1 },
  ],
  events: [
    {
      id: "the-aurus-opening-night",
      number: "01",
      month: "JUL",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS OPENING NIGHT",
      description:
        "The year begins not with an introduction, but with a statement. On the first night of July, every Aurus resident steps into a black-tie evening designed to set a shared standard — of presence, of ambition, of belonging. One dress code. One room. One collective energy. This is not a welcome; it is a benchmark. A defining moment that establishes how the next eleven months will be lived — intentionally, elevated, and together.",
      image: assets.aurusevet1,
    },
    {
      id: "the-aurus-social-brew",
      number: "02",
      month: "AUG",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS SOCIAL BREW",
      description:
        "August is where the year begins to connect. As the sun dips, the rooftop comes alive — coffee in hand, a live techno set in the background, and a room full of strangers turning into something more. What looks like effortless energy is carefully designed — to spark conversations, accelerate connections, and collapse the time it usually takes to find your people. The bonds formed here don't stay on the rooftop; they become the foundation of everything that follows.",
      image: assets.aurusevet2,
    },
    {
      id: "the-aurus-cricket-league",
      number: "03",
      month: "SEP",
      badge: "TIERED ACCESS",
      title: "THE AURUS CRICKET LEAGUE",
      description:
        "This one's for the love of the game. What starts as a few beams across residences quickly turns into something everyone's talking about. Proper matches, real grounds, jerseys you actually want to wear — and just enough competition to keep things interesting. Boys and girls play across city brackets, repping their space and their people. It's fun, it's intense, and it pulls everyone in. The winning team heads to Goa for a 3-4 day trip — but by then, it's not just about winning. It's about the moments you carry from it.",
      note: "Winning team + 20 random residents (live online draw) | Goa Voyage",
      image: assets.aurusevet3,
    },
    {
      id: "the-aurus-ai-masterclass",
      number: "04",
      month: "SEP",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS AI MASTERCLASS",
      description:
        "A focused session on understanding and using AI better — built exclusively for Aurus residents. Practical, relevant, and designed to give you an edge in how you work, learn, and create.",
      image: assets.aurusevet4,
    },
    {
      id: "the-aurus-padel-cup",
      number: "05",
      month: "OCT",
      badge: "TIERED ACCESS",
      title: "THE AURUS PADEL CUP",
      description:
        "Fast games, quick rallies, and just the right amount of competition. The Aurus Padel Cup brings residents together for a city-wide tournament that's easy to get into and hard to stop watching. Teams play across brackets, repping their residences and building that healthy rivalry along the way. It's less about being a pro, more about showing up, playing hard, and having a great time doing it. Winners don't just take the title — they earn their spot on the Goa Voyage later in the year, alongside the cricket champions and the rest of the Aurus crew.",
      note: "Winning team + 20 random residents (live online draw) | Goa Voyage",
      image: assets.aurusevet5,
    },
    {
      id: "ai-for-academic-edge",
      number: "06",
      month: "OCT",
      badge: "OPEN TO ALL RESIDENTS",
      title: "AI FOR ACADEMIC EDGE",
      description:
        "A pre-exam masterclass on studying smarter — from better note systems and research workflows to using AI in a way that actually helps you think, not replace it. Built around a simple question: how do you stay sharp and original when AI can do almost everything for you? Open to every Aurus resident across years and courses — because getting this right early changes how you perform all year.",
      image: assets.aurusevet6,
    },
    {
      id: "the-aurus-masterclass-series",
      number: "07",
      month: "NOV",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS MASTERCLASS",
      description:
        "An intimate, unfiltered masterclass series bringing visionary entrepreneurs, creators, and leaders directly to Aurus lounges. Actionable insights, candid Q&A, and high-impact discussions designed to broaden your perspective and elevate your professional trajectory.",
      image: assets.aurusevet7,
    },
    {
      id: "the-aurus-yacht-evening",
      number: "08",
      month: "DEC",
      badge: "TIERED ACCESS",
      title: "THE AURUS YACHT EVENING",
      description:
        "As the semester winds down, the Aurus community takes to the waters. Golden hour music, curated culinary spreads, and an unforgettable evening cruising the coastline under the stars — celebrating friendships forged through the autumn months.",
      note: "All-inclusive resident voyage invite | Coastal Sunset Cruise",
      image: assets.aurusevet8,
    },
    {
      id: "the-aurus-wellness-reset",
      number: "09",
      month: "JAN",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS WELLNESS RESET",
      description:
        "Start the new semester with physical vitality and mental clarity. Guided breathwork, recovery sessions, sports physiotherapy check-ins, and holistic nutrition masterclasses designed to restore momentum and establish high-performance habits.",
      image: assets.aurusevet9,
    },
    {
      id: "the-aurus-creative-showcase",
      number: "10",
      month: "FEB",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS CREATIVE SHOWCASE",
      description:
        "A high-energy weekend sprint celebrating art, music production, design, and product creation. Cross-residence showcases, live DJ sets, and resident-led installations across the common spaces, highlighting the artistic caliber of the Aurus community.",
      image: assets.aurusevet10,
    },
    {
      id: "the-goa-voyage-qualifier",
      number: "11",
      month: "MAR",
      badge: "TIERED ACCESS",
      title: "THE GOA VOYAGE QUALIFIERS",
      description:
        "The qualifying chapter culminating in the annual flagship expedition. Tournament champions, academic achievers, and selected community residents prepare for four days of coastal celebration, beach tournaments, and private sunset gatherings in Goa.",
      note: "Qualified tournament winners + lottery draw winners | 4-Day Coastal Voyage",
      image: assets.aurusevet11,
    },
    {
      id: "the-aurus-fellowship",
      number: "12",
      month: "ALL YEAR",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS FELLOWSHIP",
      description:
        "A continuous year-long initiative pairing motivated residents with industry mentors, executive roundtables, resume critiques, and project innovation grants. Engineered to bridge college life with world-class professional enterprise.",
      image: assets.aurusevet12,
    },
    {
      id: "the-aurus-run-club",
      number: "13",
      month: "ONGOING",
      badge: "OPEN TO ALL RESIDENTS",
      title: "THE AURUS RUN CLUB",
      description:
        'This isn\'t a one-day thing — it\'s part of your routine. Easy, consistent runs through the week, with a small group that just shows up and gets it done. No sign-ups, no pressure, no "fitness culture" noise. Just a simple habit you can plug into whenever you want. Some days it\'s about pushing yourself, some days it\'s just about showing up — both count.',
      note: "Open to every Aurus resident, every week",
      image: assets.aurusevet13,
    }
  ],
};
