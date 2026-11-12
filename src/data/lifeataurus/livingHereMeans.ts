import { Coffee, Leaf, LucideIcon, MessageSquare, ShieldCheck, Smartphone, UsersRound } from "lucide-react";

export interface LivingFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface LivingMeansData {
  eyebrow: string;
  items: LivingFeature[];
}

export const livingMeansData: LivingMeansData = {
  eyebrow: "01 // WHAT LIVING HERE MEANS",
  items: [
    {
      title: "Safety, three layers deep",
      description:
        "Biometric entry, female security guards round the clock, broken-down digital logs for visitors, and CCTV cover so complete peace comes standard. SOS callout in the app.",
      icon: ShieldCheck,
    },
    {
      title: "Food worth coming home to",
      description:
        "In-house chefs cook four meals a day from fresh ingredients, with regional days, vegetarian and jain options and monthly menus you can feed feedback on.",
      icon: Coffee,
    },
    {
      title: "A community, not a corridor",
      description:
        "Foosball tables, networking evenings, festive dos, acoustic nights and sports leagues – planned by a team that loves a good party.",
      icon: UsersRound,
    },
    {
      title: "Mind and body",
      description:
        "Quiet yoga zone, space-saving fitness gym and open terrace for quick workouts between lectures.",
      icon: Leaf,
    },
    {
      title: "Built for focus",
      description:
        "Acoustic study pods, print kiosk, push-pin pinboards with ergonomic seating and cheering study energy for late-night exams.",
      icon: MessageSquare,
    },
    {
      title: "Everything in the app",
      description:
        "Pay rent, book services, raise maintenance requests, sign up for events and read today's menu and manager – all from your phone.",
      icon: Smartphone,
    },
  ],
};
