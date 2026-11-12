export interface LocationDirectoryItem {
  name: string;
  detail: string;
  actionText: string;
  actionHref: string;
}

export interface CallYouBackData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  directoryEyebrow: string;
  locations: LocationDirectoryItem[];
}

export const callYouBackData: CallYouBackData = {
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
      actionHref: "/hostels",
    },
    {
      name: "Noida",
      detail: "Chapter VI",
      actionText: "VIEW",
      actionHref: "/hostels",
    },
    {
      name: "Ahmedabad",
      detail: "Chapter VII",
      actionText: "VIEW",
      actionHref: "/hostels",
    },
    {
      name: "Pune",
      detail: "Chapter VIII",
      actionText: "VIEW",
      actionHref: "/hostels",
    },
    {
      name: "Jalandhar",
      detail: "Chapter IX",
      actionText: "VIEW",
      actionHref: "/hostels",
    },
  ],
};
