export interface IAurusHeroStat {
  value: string;
  label: string;
}

export interface AurusHeroData {
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  stats: IAurusHeroStat[];
}

export const aurusHeroData: AurusHeroData = {
  titleTop: "THE AURUS",
  titleAccent: "Year.",
  subtitle:
    "Twelve curated experiences. Two trips earned, not given. One year designed to mean something.",
  stats: [
    { value: "11", label: "FLAGSHIP EVENTS" },
    { value: "2", label: "YEAR-LONG PROGRAMMES" },
    { value: "2", label: "VOYAGES ON OFFER" },
  ],
};

