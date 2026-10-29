export interface NotFoundData {
  eyebrow: string;
  code: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  actions: {
    label: string;
    href: string;
    variant: "solid" | "outline";
  }[];
  assistance: {
    heading: string;
    subtext: string;
    ctaLabel: string;
    ctaHref: string;
  };
}

export const notFoundData: NotFoundData = {
  eyebrow: "00 // PAGE NOT FOUND",
  code: "404",
  titleTop: "THIS PAGE DOES NOT",
  titleAccent: "Exist.",
  description:
    "The page you’re looking for may have been moved, renamed, or no longer exists. Let’s help you find your way back to Aurus.",
  actions: [
    {
      label: "BACK TO HOME",
      href: "/",
      variant: "solid",
    },
    {
      label: "EXPLORE RESIDENCES",
      href: "/residences",
      variant: "outline",
    },
    {
      label: "CONTACT US",
      href: "/contact",
      variant: "outline",
    },
  ],
  assistance: {
    heading: "NEED A HELPING HAND?",
    subtext:
      "Our team is here to help you explore our residences, discover our spaces, and find the information you need.",
    ctaLabel: "VISIT HELP & FAQS",
    ctaHref: "/faq",
  },
};
