export interface ContactChannel {
  label: string;
  value: string;
  subtext: string;
  href?: string;
}

export interface TalkToUsData {
  titleTop: string;
  titleAccent: string;
  body: string;
  channels: ContactChannel[];
}

export const talkToUsData: TalkToUsData = {
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
};
