import {
  GraduationCap,
  Info,
  Monitor,
  Moon,
  Palette,
  Sparkles,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type {
  AccentColor,
  AiTone,
  FontSize,
  QuizDifficulty,
  StudyLevel,
  SummaryLength,
  Theme,
} from "@/types/api/user.types";

export interface Option<T> {
  value: T;
  label: string;
  hint?: string;
  icon?: LucideIcon;
}

export interface SettingsSectionMeta {
  slug: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The single source of truth for the settings sections: the sidebar submenu
 * renders from it, the router validates `:section` against it, and the page
 * picks which panel to show by slug.
 */
export const SETTINGS_SECTIONS: SettingsSectionMeta[] = [
  { slug: "appearance", label: "Appearance", icon: Palette },
  { slug: "ai", label: "AI preferences", icon: Sparkles },
  { slug: "study", label: "Study preferences", icon: GraduationCap },
  { slug: "account", label: "Account", icon: UserRound },
  { slug: "about", label: "About", icon: Info },
];

export const DEFAULT_SETTINGS_SECTION = SETTINGS_SECTIONS[0].slug;

export const THEME_OPTIONS: Option<Theme>[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/**
 * `swatch` mirrors the light-mode --primary each accent sets in index.css,
 * so the dot you pick is the colour you get.
 */
export const ACCENT_OPTIONS: (Option<AccentColor> & { swatch: string })[] = [
  { value: "teal", label: "Teal", swatch: "oklch(0.52 0.1 190)" },
  { value: "blue", label: "Blue", swatch: "oklch(0.54 0.14 255)" },
  { value: "purple", label: "Purple", swatch: "oklch(0.52 0.17 295)" },
  { value: "green", label: "Green", swatch: "oklch(0.53 0.13 150)" },
  { value: "orange", label: "Orange", swatch: "oklch(0.62 0.15 55)" },
  { value: "red", label: "Red", swatch: "oklch(0.55 0.19 25)" },
];

export const FONT_SIZE_OPTIONS: Option<FontSize>[] = [
  { value: "small", label: "Small" },
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
];

export const SUMMARY_LENGTH_OPTIONS: Option<SummaryLength>[] = [
  { value: "short", label: "Short", hint: "The essentials only" },
  { value: "medium", label: "Medium", hint: "Every major section" },
  { value: "detailed", label: "Detailed", hint: "Nothing left out" },
];

export const QUIZ_DIFFICULTY_OPTIONS: Option<QuizDifficulty>[] = [
  { value: "easy", label: "Easy", hint: "Recall the basics" },
  { value: "medium", label: "Medium", hint: "Apply the concepts" },
  { value: "hard", label: "Hard", hint: "Reason it through" },
  { value: "mixed", label: "Mixed", hint: "A bit of everything" },
];

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25];

export const FLASHCARD_COUNT_OPTIONS = [10, 15, 20, 25];

export const AI_TONE_OPTIONS: Option<AiTone>[] = [
  {
    value: "professional",
    label: "Professional",
    hint: "Clear and precise",
  },
  {
    value: "simple",
    label: "Simple",
    hint: "Plain language, no jargon",
  },
  {
    value: "academic",
    label: "Academic",
    hint: "Full technical terminology",
  },
  {
    value: "exam-prep",
    label: "Exam preparation",
    hint: "Focused on what gets assessed",
  },
];

export const STUDY_LEVEL_OPTIONS: Option<StudyLevel>[] = [
  {
    value: "beginner",
    label: "Beginner",
    hint: "Explain from first principles",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    hint: "Assume the fundamentals",
  },
  {
    value: "advanced",
    label: "Advanced",
    hint: "Skip the introductions",
  },
];

export const APP_VERSION = "0.1.0";

export const GITHUB_URL = "https://github.com/Chaks619/ai-studymate";
