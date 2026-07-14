import {
  DEFAULT_PREFERENCES,
  type AccentColor,
  type FontSize,
} from "@/types/api/user.types";

const ACCENT_KEY = "studymate.accent";
const FONT_SIZE_KEY = "studymate.font-size";

const ACCENTS: AccentColor[] = [
  "teal",
  "blue",
  "purple",
  "green",
  "orange",
  "red",
];

const FONT_SIZES: FontSize[] = ["small", "default", "large"];

export interface Appearance {
  accentColor: AccentColor;
  fontSize: FontSize;
}

/**
 * Mirrored into localStorage purely so the choice survives a reload without
 * waiting on the session to restore — the server stays the source of truth.
 */
export function readStoredAppearance(): Appearance {
  try {
    const accent = localStorage.getItem(ACCENT_KEY) as AccentColor | null;
    const fontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;

    return {
      accentColor:
        accent && ACCENTS.includes(accent)
          ? accent
          : DEFAULT_PREFERENCES.accentColor,

      fontSize:
        fontSize && FONT_SIZES.includes(fontSize)
          ? fontSize
          : DEFAULT_PREFERENCES.fontSize,
    };
  } catch {
    // Private browsing / storage disabled.
    return {
      accentColor: DEFAULT_PREFERENCES.accentColor,
      fontSize: DEFAULT_PREFERENCES.fontSize,
    };
  }
}

export function applyAppearance({ accentColor, fontSize }: Appearance): void {
  const root = document.documentElement;

  root.dataset.accent = accentColor;
  root.dataset.fontSize = fontSize;

  try {
    localStorage.setItem(ACCENT_KEY, accentColor);
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  } catch {
    // Nothing to do — the attributes above are what actually render.
  }
}
