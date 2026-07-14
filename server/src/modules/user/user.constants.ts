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

export const THEME_PREFERENCE = {
  LIGHT: "LIGHT",
  DARK: "DARK",
  SYSTEM: "SYSTEM",
} as const;

export type ThemePreference =
  (typeof THEME_PREFERENCE)[keyof typeof THEME_PREFERENCE];

export const LANGUAGE_PREFERENCE = {
  ENGLISH: "en",
} as const;

export type LanguagePreference =
  (typeof LANGUAGE_PREFERENCE)[keyof typeof LANGUAGE_PREFERENCE];