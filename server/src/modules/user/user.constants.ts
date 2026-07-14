export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const AUTH_PROVIDER = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
} as const;

export type AuthProvider =
  (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

export const SUBSCRIPTION_TYPE = {
  FREE: "FREE",
  PREMIUM: "PREMIUM",
} as const;

export type SubscriptionType =
  (typeof SUBSCRIPTION_TYPE)[keyof typeof SUBSCRIPTION_TYPE];

/* ------------------------------------------------------------------ *
 * Preference values are stored in the exact form their consumer needs:
 * next-themes reads `theme`, the CSS reads `accentColor`/`fontSize` as
 * data attributes, and the quiz endpoint reads `quizDifficulty`. Keeping
 * them lowercase means nothing has to case-map on the way out.
 *
 * `theme` was previously stored uppercase — the schema lowercases on
 * write and the mapper lowercases on read, so old documents still work.
 * ------------------------------------------------------------------ */

export const THEME_PREFERENCE = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type ThemePreference =
  (typeof THEME_PREFERENCE)[keyof typeof THEME_PREFERENCE];

export const ACCENT_COLOR = {
  TEAL: "teal",
  BLUE: "blue",
  PURPLE: "purple",
  GREEN: "green",
  ORANGE: "orange",
  RED: "red",
} as const;

export type AccentColor =
  (typeof ACCENT_COLOR)[keyof typeof ACCENT_COLOR];

export const FONT_SIZE = {
  SMALL: "small",
  DEFAULT: "default",
  LARGE: "large",
} as const;

export type FontSize = (typeof FONT_SIZE)[keyof typeof FONT_SIZE];

export const SUMMARY_LENGTH = {
  SHORT: "short",
  MEDIUM: "medium",
  DETAILED: "detailed",
} as const;

export type SummaryLength =
  (typeof SUMMARY_LENGTH)[keyof typeof SUMMARY_LENGTH];

export const QUIZ_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  MIXED: "mixed",
} as const;

export type QuizDifficulty =
  (typeof QUIZ_DIFFICULTY)[keyof typeof QUIZ_DIFFICULTY];

export const AI_TONE = {
  PROFESSIONAL: "professional",
  SIMPLE: "simple",
  ACADEMIC: "academic",
  EXAM_PREP: "exam-prep",
} as const;

export type AiTone = (typeof AI_TONE)[keyof typeof AI_TONE];

export const STUDY_LEVEL = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type StudyLevel =
  (typeof STUDY_LEVEL)[keyof typeof STUDY_LEVEL];

export const LANGUAGE_PREFERENCE = {
  ENGLISH: "en",
} as const;

export type LanguagePreference =
  (typeof LANGUAGE_PREFERENCE)[keyof typeof LANGUAGE_PREFERENCE];

export const QUIZ_QUESTION_COUNT_MIN = 5;
export const QUIZ_QUESTION_COUNT_MAX = 50;

export const FLASHCARD_COUNT_MIN = 5;
export const FLASHCARD_COUNT_MAX = 50;

/**
 * The source of truth for a new user's preferences, and the fallback the
 * mapper uses when a stored document predates a field being added.
 */
export const DEFAULT_PREFERENCES = {
  theme: THEME_PREFERENCE.SYSTEM,
  accentColor: ACCENT_COLOR.TEAL,
  fontSize: FONT_SIZE.DEFAULT,

  summaryLength: SUMMARY_LENGTH.MEDIUM,
  quizQuestionCount: 10,
  quizDifficulty: QUIZ_DIFFICULTY.MIXED,
  flashcardCount: 15,
  aiTone: AI_TONE.SIMPLE,

  studyLevel: STUDY_LEVEL.INTERMEDIATE,
  autoGenerate: {
    summary: false,
    flashcards: false,
    quiz: false,
  },

  language: LANGUAGE_PREFERENCE.ENGLISH,
  timezone: "UTC",
} as const;
