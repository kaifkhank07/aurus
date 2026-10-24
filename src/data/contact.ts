export interface ContactChannel {
  label: string;
  value: string;
  subtext: string;
  href?: string;
}

export interface LocationDirectoryItem {
  name: string;
  detail: string;
  actionText: string;
  actionHref: string;
}

export interface ContactPageData {
  hero: {
    titleTop: string;
    titleAccent: string;
    body: string;
    channels: ContactChannel[];
  };
  callback: {
    eyebrow: string;
    titleTop: string;
    titleAccent: string;
    directoryEyebrow: string;
    locations: LocationDirectoryItem[];
  };
}

export const contactData: ContactPageData = {
  hero: {
    titleTop: "TALK TO",
    titleAccent: "Us.",
    body: "Questions about rooms, tours or pricing? Our team is here 10am–7pm every day, and resident wardens are on site around the clock.",
    channels: [
      {
        label: "TOLL-FREE",
        value: "1800-572-0709",
        subtext: "10:00am - 7:00pm, Monday to Sunday",
        href: "tel:18005720709",
      },
      {
        label: "WHATSAPP",
        value: "+91 72089 50935",
        subtext: "Usually replies within minutes.",
        href: "https://wa.me/917208950935",
      },
      {
        label: "EMAIL",
        value: "info@auruslife.com",
        subtext: "For bookings, partnerships and press.",
        href: "mailto:info@auruslife.com",
      },
    ],
  },
  callback: {
    eyebrow: "REQUEST A CALLBACK",
    titleTop: "WE'LL CALL YOU",
    titleAccent: "Back.",
    directoryEyebrow: "WHERE TO FIND US",
    locations: [
      {
        name: "Head office",
        detail:
          "405, 4th Floor, The Summit Business Bay, Near WEH Metro Station, Andheri-Kurla Road, Andheri (East), Mumbai 400093",
        actionText: "MAP",
        actionHref: "https://maps.google.com/?q=The+Summit+Business+Bay+Andheri",
      },
      {
        name: "Mumbai",
        detail: "Chapter I, Chapter II, Chapter III, Chapter IV, Chapter V",
        actionText: "MAP",
        actionHref: "/residences",
      },
      {
        name: "Noida",
        detail: "Chapter VI",
        actionText: "VIEW",
        actionHref: "/residences",
      },
      {
        name: "Ahmedabad",
        detail: "Chapter VII",
        actionText: "VIEW",
        actionHref: "/residences",
      },
      {
        name: "Pune",
        detail: "Chapter VIII",
        actionText: "VIEW",
        actionHref: "/residences",
      },
      {
        name: "Jalandhar",
        detail: "Chapter IX",
        actionText: "VIEW",
        actionHref: "/residences",
      },
    ],
  },
};
