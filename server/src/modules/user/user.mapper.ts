import type { UserDocument } from "./user.model.js";
import type {
  AuthProvider,
  SubscriptionType,
  ThemePreference,
  UserRole,
} from "./user.constants.js";

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
  preferences: {
    theme: ThemePreference;
    language: string;
    timezone: string;
  };
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
    preferences: {
      theme: user.preferences?.theme as ThemePreference,
      language: user.preferences?.language ?? "en",
      timezone: user.preferences?.timezone ?? "UTC",
    },
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
