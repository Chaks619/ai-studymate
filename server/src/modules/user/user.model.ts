import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { AUTH_PROVIDER, SUBSCRIPTION_TYPE, THEME_PREFERENCE, USER_ROLE } from './user.constants.js';

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
      theme: {
        type: String,
        enum: Object.values(THEME_PREFERENCE),
        default: THEME_PREFERENCE.SYSTEM,
      },

      language: {
        type: String,
        default: 'en',
      },

      timezone: {
        type: String,
        default: 'UTC',
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
