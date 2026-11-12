export interface StrategicPartnerStat {
  number: string;
  label: string;
  description: string;
}

export interface StrategicPartnerData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  body: string;
  stats: StrategicPartnerStat[];
}

export const strategicPartnerData: StrategicPartnerData = {
  eyebrow: "01 // A STRATEGIC OPERATING PARTNER",
  titleTop: "NOT JUST A",
  titleAccent: "Tenant.",
  body: "Founded in 2019 by student housing specialists, Aurus designs and operates premium residences near India's top education hubs. We work closely with developers to transform conventional buildings into purpose-built, institutionally scalable student accommodation.",
  stats: [
    {
      number: "2019",
      label: "SINCE",
      description: "Pioneer of student housing in India",
    },
    {
      number: "9",
      label: "CHAPTERS",
      description: "Across 5 Indian education hubs",
    },
    {
      number: "5+",
      label: "CITIES",
      description: "With pipeline expansion",
    },
    {
      number: "END-TO-END",
      label: "SCOPE",
      description: "Design, build, launch, operations",
    },
  ],
};
