import { create } from "zustand";

export type PaletteId = "ember" | "gold" | "emerald" | "sapphire" | "amethyst" | "rose";

export interface ColorPalette {
  id: PaletteId;
  name: string;
  description: string;
  primaryHex: string;
  secondaryHex: string;
  glowHex: string;
  gradientClass: string;
  hoverGradientClass: string;
  textClass: string;
  borderClass: string;
  bgLightClass: string;
  ringClass: string;
}

export const ADMIN_PALETTES: Record<PaletteId, ColorPalette> = {
  ember: {
    id: "ember",
    name: "Ember Orange",
    description: "Signature warm luxury aesthetic",
    primaryHex: "#f97316",
    secondaryHex: "#f59e0b",
    glowHex: "rgba(249, 115, 22, 0.35)",
    gradientClass: "from-orange-500 to-amber-500",
    hoverGradientClass: "hover:from-orange-600 hover:to-amber-600",
    textClass: "text-orange-500",
    borderClass: "border-orange-500",
    bgLightClass: "bg-orange-50",
    ringClass: "focus:ring-orange-500/20",
  },
  gold: {
    id: "gold",
    name: "Aurus Gold",
    description: "Opulent regal metallic tone",
    primaryHex: "#d97706",
    secondaryHex: "#eab308",
    glowHex: "rgba(217, 119, 6, 0.35)",
    gradientClass: "from-amber-600 to-yellow-500",
    hoverGradientClass: "hover:from-amber-700 hover:to-yellow-600",
    textClass: "text-amber-600",
    borderClass: "border-amber-600",
    bgLightClass: "bg-amber-50",
    ringClass: "focus:ring-amber-500/20",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Jade",
    description: "Lush botanical elegance",
    primaryHex: "#10b981",
    secondaryHex: "#14b8a6",
    glowHex: "rgba(16, 185, 129, 0.35)",
    gradientClass: "from-emerald-500 to-teal-500",
    hoverGradientClass: "hover:from-emerald-600 hover:to-teal-600",
    textClass: "text-emerald-600",
    borderClass: "border-emerald-500",
    bgLightClass: "bg-emerald-50",
    ringClass: "focus:ring-emerald-500/20",
  },
  sapphire: {
    id: "sapphire",
    name: "Sapphire Blue",
    description: "Deep executive authority",
    primaryHex: "#2563eb",
    secondaryHex: "#06b6d4",
    glowHex: "rgba(37, 99, 235, 0.35)",
    gradientClass: "from-blue-600 to-cyan-500",
    hoverGradientClass: "hover:from-blue-700 hover:to-cyan-600",
    textClass: "text-blue-600",
    borderClass: "border-blue-600",
    bgLightClass: "bg-blue-50",
    ringClass: "focus:ring-blue-500/20",
  },
  amethyst: {
    id: "amethyst",
    name: "Royal Amethyst",
    description: "Distinguished sovereign violet",
    primaryHex: "#8b5cf6",
    secondaryHex: "#d946ef",
    glowHex: "rgba(139, 92, 246, 0.35)",
    gradientClass: "from-violet-600 to-fuchsia-500",
    hoverGradientClass: "hover:from-violet-700 hover:to-fuchsia-600",
    textClass: "text-violet-600",
    borderClass: "border-violet-600",
    bgLightClass: "bg-violet-50",
    ringClass: "focus:ring-violet-500/20",
  },
  rose: {
    id: "rose",
    name: "Crimson Rose",
    description: "Modern striking luxury red",
    primaryHex: "#f43f5e",
    secondaryHex: "#fb7185",
    glowHex: "rgba(244, 63, 94, 0.35)",
    gradientClass: "from-rose-500 to-pink-500",
    hoverGradientClass: "hover:from-rose-600 hover:to-pink-600",
    textClass: "text-rose-600",
    borderClass: "border-rose-500",
    bgLightClass: "bg-rose-50",
    ringClass: "focus:ring-rose-500/20",
  },
};

export const PALETTE_COOKIE_KEY = "aurus_admin_palette";

/* ── Cookie Helpers ──────────────────────────────────────────────────────── */
export function getPaletteCookie(): PaletteId | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${PALETTE_COOKIE_KEY}=([^;]*)`));
  const val = match ? (decodeURIComponent(match[1]) as PaletteId) : null;
  return val && ADMIN_PALETTES[val] ? val : null;
}

export function setPaletteCookie(paletteId: PaletteId, days = 365): void {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${PALETTE_COOKIE_KEY}=${encodeURIComponent(
    paletteId
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function applyThemeVariables(palette: ColorPalette): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--admin-primary", palette.primaryHex);
  root.style.setProperty("--admin-secondary", palette.secondaryHex);
  root.style.setProperty("--admin-glow", palette.glowHex);
}

function resolveInitialPalette(): PaletteId {
  if (typeof window === "undefined") return "ember";

  // 1. Check Cookie first
  const cookieVal = getPaletteCookie();
  if (cookieVal) return cookieVal;

  // 2. Fallback: check legacy localStorage and migrate
  try {
    const legacy = localStorage.getItem("aurus_admin_palette") as PaletteId;
    if (legacy && ADMIN_PALETTES[legacy]) {
      setPaletteCookie(legacy);
      return legacy;
    }
  } catch {
    // Ignore storage errors
  }

  return "ember";
}

export interface ThemeState {
  paletteId: PaletteId;
  palette: ColorPalette;
  palettes: ColorPalette[];
  setPaletteId: (id: PaletteId) => void;
  initTheme: () => void;
}

const initialId = resolveInitialPalette();
const initialPalette = ADMIN_PALETTES[initialId] || ADMIN_PALETTES.ember;

if (typeof window !== "undefined") {
  applyThemeVariables(initialPalette);
}

export const useThemeStore = create<ThemeState>((set) => ({
  paletteId: initialId,
  palette: initialPalette,
  palettes: Object.values(ADMIN_PALETTES),

  setPaletteId: (id: PaletteId) => {
    const nextPalette = ADMIN_PALETTES[id];
    if (!nextPalette) return;

    setPaletteCookie(id);
    applyThemeVariables(nextPalette);

    set({
      paletteId: id,
      palette: nextPalette,
    });
  },

  initTheme: () => {
    const id = resolveInitialPalette();
    const current = ADMIN_PALETTES[id] || ADMIN_PALETTES.ember;
    applyThemeVariables(current);
    set({
      paletteId: id,
      palette: current,
    });
  },
}));
