import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import {
  ACCENT_COLOR,
  AI_TONE,
  AUTH_PROVIDER,
  DEFAULT_PREFERENCES,
  FLASHCARD_COUNT_MAX,
  FLASHCARD_COUNT_MIN,
  FONT_SIZE,
  QUIZ_DIFFICULTY,
  QUIZ_QUESTION_COUNT_MAX,
  QUIZ_QUESTION_COUNT_MIN,
  STUDY_LEVEL,
  SUBSCRIPTION_TYPE,
  SUMMARY_LENGTH,
  THEME_PREFERENCE,
  USER_ROLE,
} from './user.constants.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    avatar: {
      url: {
        type: String,
        default: '',
      },

      publicId: {
        type: String,
        default: '',
      },
    },

    provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDER),
      default: AUTH_PROVIDER.LOCAL,
    },

    providerId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    hashedRefreshToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    emailVerificationToken: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    subscription: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TYPE),
      default: SUBSCRIPTION_TYPE.FREE,
    },

    preferences: {
      // Appearance
      theme: {
        type: String,
        enum: Object.values(THEME_PREFERENCE),
        default: DEFAULT_PREFERENCES.theme,
        // Older documents stored "SYSTEM"/"DARK"; lowercase on write so
        // they migrate the first time the user saves anything.
        lowercase: true,
      },

      accentColor: {
        type: String,
        enum: Object.values(ACCENT_COLOR),
        default: DEFAULT_PREFERENCES.accentColor,
      },

      fontSize: {
        type: String,
        enum: Object.values(FONT_SIZE),
        default: DEFAULT_PREFERENCES.fontSize,
      },

      // AI preferences — these feed the generation prompts.
      summaryLength: {
        type: String,
        enum: Object.values(SUMMARY_LENGTH),
        default: DEFAULT_PREFERENCES.summaryLength,
      },

      quizQuestionCount: {
        type: Number,
        min: QUIZ_QUESTION_COUNT_MIN,
        max: QUIZ_QUESTION_COUNT_MAX,
        default: DEFAULT_PREFERENCES.quizQuestionCount,
      },

      quizDifficulty: {
        type: String,
        enum: Object.values(QUIZ_DIFFICULTY),
        default: DEFAULT_PREFERENCES.quizDifficulty,
      },

      flashcardCount: {
        type: Number,
        min: FLASHCARD_COUNT_MIN,
        max: FLASHCARD_COUNT_MAX,
        default: DEFAULT_PREFERENCES.flashcardCount,
      },

      aiTone: {
        type: String,
        enum: Object.values(AI_TONE),
        default: DEFAULT_PREFERENCES.aiTone,
      },

      // Study preferences
      studyLevel: {
        type: String,
        enum: Object.values(STUDY_LEVEL),
        default: DEFAULT_PREFERENCES.studyLevel,
      },

      autoGenerate: {
        summary: {
          type: Boolean,
          default: DEFAULT_PREFERENCES.autoGenerate.summary,
        },

        flashcards: {
          type: Boolean,
          default: DEFAULT_PREFERENCES.autoGenerate.flashcards,
        },

        quiz: {
          type: Boolean,
          default: DEFAULT_PREFERENCES.autoGenerate.quiz,
        },
      },

      language: {
        type: String,
        default: DEFAULT_PREFERENCES.language,
      },

      timezone: {
        type: String,
        default: DEFAULT_PREFERENCES.timezone,
      },
    },

    usage: {
      pdfUploads: {
        type: Number,
        default: 0,
      },

      quizzesGenerated: {
        type: Number,
        default: 0,
      },

      flashcardsGenerated: {
        type: Number,
        default: 0,
      },

      chatMessages: {
        type: Number,
        default: 0,
      },

      roadmapsGenerated: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// userSchema.index({ email: 1 }, { unique: true });

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model<User>('User', userSchema);
