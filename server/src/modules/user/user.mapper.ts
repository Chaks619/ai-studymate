import type { UserDocument } from "./user.model.js";
import { DEFAULT_PREFERENCES } from "./user.constants.js";
import type {
  AccentColor,
  AiTone,
  AuthProvider,
  FontSize,
  QuizDifficulty,
  StudyLevel,
  SubscriptionType,
  SummaryLength,
  ThemePreference,
  UserRole,
} from "./user.constants.js";

export interface UserPreferences {
  theme: ThemePreference;
  accentColor: AccentColor;
  fontSize: FontSize;

  summaryLength: SummaryLength;
  quizQuestionCount: number;
  quizDifficulty: QuizDifficulty;
  flashcardCount: number;
  aiTone: AiTone;

  studyLevel: StudyLevel;
  autoGenerate: {
    summary: boolean;
    flashcards: boolean;
    quiz: boolean;
  };

  language: string;
  timezone: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  avatar: {
    url: string;
    publicId: string;
  };
  provider: AuthProvider;
  role: UserRole;
  isVerified: boolean;
  lastLogin: Date | null;
  subscription: SubscriptionType;
  preferences: UserPreferences;
  usage: {
    pdfUploads: number;
    quizzesGenerated: number;
    flashcardsGenerated: number;
    chatMessages: number;
    roadmapsGenerated: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A document written before a preference existed has no value for it, and
 * `theme` used to be stored uppercase — so each field falls back to its
 * default rather than trusting whatever is on the document.
 */
const toPreferences = (user: UserDocument): UserPreferences => {
  const stored = user.preferences;

  const theme = stored?.theme
    ? (String(stored.theme).toLowerCase() as ThemePreference)
    : DEFAULT_PREFERENCES.theme;

  return {
    theme,

    accentColor: (stored?.accentColor ??
      DEFAULT_PREFERENCES.accentColor) as AccentColor,

    fontSize: (stored?.fontSize ?? DEFAULT_PREFERENCES.fontSize) as FontSize,

    summaryLength: (stored?.summaryLength ??
      DEFAULT_PREFERENCES.summaryLength) as SummaryLength,

    quizQuestionCount:
      stored?.quizQuestionCount ?? DEFAULT_PREFERENCES.quizQuestionCount,

    quizDifficulty: (stored?.quizDifficulty ??
      DEFAULT_PREFERENCES.quizDifficulty) as QuizDifficulty,

    flashcardCount:
      stored?.flashcardCount ?? DEFAULT_PREFERENCES.flashcardCount,

    aiTone: (stored?.aiTone ?? DEFAULT_PREFERENCES.aiTone) as AiTone,

    studyLevel: (stored?.studyLevel ??
      DEFAULT_PREFERENCES.studyLevel) as StudyLevel,

    autoGenerate: {
      summary:
        stored?.autoGenerate?.summary ??
        DEFAULT_PREFERENCES.autoGenerate.summary,

      flashcards:
        stored?.autoGenerate?.flashcards ??
        DEFAULT_PREFERENCES.autoGenerate.flashcards,

      quiz: stored?.autoGenerate?.quiz ?? DEFAULT_PREFERENCES.autoGenerate.quiz,
    },

    language: stored?.language ?? DEFAULT_PREFERENCES.language,
    timezone: stored?.timezone ?? DEFAULT_PREFERENCES.timezone,
  };
};

/**
 * Maps a Mongoose user document to a safe object that excludes sensitive
 * fields (password, refresh token, reset/verification tokens) before it is
 * returned in an API response.
 */
export const toSafeUser = (user: UserDocument): SafeUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: {
      url: user.avatar?.url ?? "",
      publicId: user.avatar?.publicId ?? "",
    },
    provider: user.provider as AuthProvider,
    role: user.role as UserRole,
    isVerified: user.isVerified,
    lastLogin: user.lastLogin ?? null,
    subscription: user.subscription as SubscriptionType,
    preferences: toPreferences(user),
    usage: {
      pdfUploads: user.usage?.pdfUploads ?? 0,
      quizzesGenerated: user.usage?.quizzesGenerated ?? 0,
      flashcardsGenerated: user.usage?.flashcardsGenerated ?? 0,
      chatMessages: user.usage?.chatMessages ?? 0,
      roadmapsGenerated: user.usage?.roadmapsGenerated ?? 0,
    },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
