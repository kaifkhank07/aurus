export interface LifeCategoryItem {
  label: string;
  image: string;
  alt: string;
}

export interface LifeColumn {
  stagger?: boolean;
  top: LifeCategoryItem;
  bottom: LifeCategoryItem;
}

export const lifeAtAurus = {
  eyebrow: "LIFE & AURUS",
  titleTop: "NOT JUST WHERE YOU",
  titleAccent: "Stay.",
  body: "A Chapter is only half the story. Study pods that stay silent at 2am, four meals you didn't have to think about, a terrace for yoga and a courtyard for doing nothing at all - the same six things, in every residence.",
  cta: {
    label: "EXPLORE LIFE @ AURUS",
    href: "/life-at-aurus",
  },
  columns: [
    {
      stagger: false,
      top: {
        label: "STUDY",
        image: "/images/life-study.jpg",
        alt: "Resident focused on studying in quiet alcove",
      },
      bottom: {
        label: "CONNECT",
        image: "/images/life-connect.png",
        alt: "Residents bonding and conversing in lounge",
      },
    },
    {
      stagger: true,
      top: {
        label: "EAT",
        image: "/images/life-eat.png",
        alt: "Residents sharing fresh communal meals",
      },
      bottom: {
        label: "UNWIND",
        image: "/images/life-unwind.png",
        alt: "Residents relaxing in modern living area",
      },
    },
    {
      stagger: false,
      top: {
        label: "MOVE",
        image: "/images/life-move.png",
        alt: "Resident exercising on treadmill in fitness gym",
      },
      bottom: {
        label: "ENJOY",
        image: "/images/life-enjoy.png",
        alt: "Residents playing foosball in recreation space",
      },
    },
  ] as LifeColumn[],
  items: [
    {
      label: "STUDY",
      image: "/images/life-study.jpg",
      alt: "Resident focused on studying in quiet alcove",
    },
    {
      label: "EAT",
      image: "/images/life-eat.png",
      alt: "Residents sharing fresh communal meals",
    },
    {
      label: "MOVE",
      image: "/images/life-move.png",
      alt: "Resident exercising on treadmill in fitness gym",
    },
    {
      label: "CONNECT",
      image: "/images/life-connect.png",
      alt: "Residents bonding and conversing in lounge",
    },
    {
      label: "UNWIND",
      image: "/images/life-unwind.png",
      alt: "Residents relaxing in modern living area",
    },
    {
      label: "ENJOY",
      image: "/images/life-enjoy.png",
      alt: "Residents playing foosball in recreation space",
    },
  ] satisfies LifeCategoryItem[],
};
