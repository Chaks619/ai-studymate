export type Theme = "light" | "dark" | "system";

export type AccentColor =
  | "teal"
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "red";

export type FontSize = "small" | "default" | "large";

export type SummaryLength = "short" | "medium" | "detailed";

export type QuizDifficulty = "easy" | "medium" | "hard" | "mixed";

export type AiTone =
  | "professional"
  | "simple"
  | "academic"
  | "exam-prep";

export type StudyLevel = "beginner" | "intermediate" | "advanced";

export interface AutoGeneratePreferences {
  summary: boolean;
  flashcards: boolean;
  quiz: boolean;
}

export interface UserPreferences {
  theme: Theme;
  accentColor: AccentColor;
  fontSize: FontSize;

  summaryLength: SummaryLength;
  quizQuestionCount: number;
  quizDifficulty: QuizDifficulty;
  flashcardCount: number;
  aiTone: AiTone;

  studyLevel: StudyLevel;
  autoGenerate: AutoGeneratePreferences;

  language: string;
  timezone: string;
}

/**
 * Mirrors DEFAULT_PREFERENCES on the server. Used before the session has
 * been restored, and on the auth screens where there is no user yet.
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  accentColor: "teal",
  fontSize: "default",

  summaryLength: "medium",
  quizQuestionCount: 10,
  quizDifficulty: "mixed",
  flashcardCount: 15,
  aiTone: "simple",

  studyLevel: "intermediate",
  autoGenerate: {
    summary: false,
    flashcards: false,
    quiz: false,
  },

  language: "en",
  timezone: "UTC",
};

/** A section of the settings page saves only the fields it owns. */
export type UpdatePreferencesRequest = Partial<
  Omit<UserPreferences, "autoGenerate" | "language" | "timezone">
> & {
  autoGenerate?: Partial<AutoGeneratePreferences>;
};

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}
