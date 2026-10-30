
export interface introStats {
  value: string;
  label: string;
}

export interface introData {
  statement: string;
  cta: { label: string; href: string; };
  eyebrow: string;
  stats: introStats[];
}

export const intro: introData = {
  statement:
    "Where living becomes an experience. AURUS brings together considered design, elevated hospitality and a vibrant community to create a student living experience that feels effortless, inspiring and distinctly your own.",
  cta: { label: "Come live at Aurus", href: "/contact" },
  eyebrow: "02 // A Growing Community",
  stats: [
    { value: "5+", label: "Cities" },
    { value: "2,500+", label: "Beds" },
    { value: "09", label: "Chapters" },
    { value: "24/7", label: "Resident Support" },
  ],
};
