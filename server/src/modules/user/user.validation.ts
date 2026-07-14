import { z } from "zod";

import { passwordPolicy } from "../auth/validators/register.validator.js";

import {
  ACCENT_COLOR,
  AI_TONE,
  FLASHCARD_COUNT_MAX,
  FLASHCARD_COUNT_MIN,
  FONT_SIZE,
  QUIZ_DIFFICULTY,
  QUIZ_QUESTION_COUNT_MAX,
  QUIZ_QUESTION_COUNT_MIN,
  STUDY_LEVEL,
  SUMMARY_LENGTH,
  THEME_PREFERENCE,
} from "./user.constants.js";

const enumOf = <T extends Record<string, string>>(source: T) =>
  z.enum(Object.values(source) as [string, ...string[]]);

/**
 * Every field is optional: the settings UI saves one section at a time, and
 * the service merges the patch onto the user's existing preferences.
 */
export const updatePreferencesSchema = z
  .object({
    theme: enumOf(THEME_PREFERENCE).optional(),
    accentColor: enumOf(ACCENT_COLOR).optional(),
    fontSize: enumOf(FONT_SIZE).optional(),

    summaryLength: enumOf(SUMMARY_LENGTH).optional(),

    quizQuestionCount: z
      .number()
      .int()
      .min(QUIZ_QUESTION_COUNT_MIN)
      .max(QUIZ_QUESTION_COUNT_MAX)
      .optional(),

    quizDifficulty: enumOf(QUIZ_DIFFICULTY).optional(),

    flashcardCount: z
      .number()
      .int()
      .min(FLASHCARD_COUNT_MIN)
      .max(FLASHCARD_COUNT_MAX)
      .optional(),

    aiTone: enumOf(AI_TONE).optional(),

    studyLevel: enumOf(STUDY_LEVEL).optional(),

    autoGenerate: z
      .object({
        summary: z.boolean().optional(),
        flashcards: z.boolean().optional(),
        quiz: z.boolean().optional(),
      })
      .optional(),
  })
  .strict();

export type UpdatePreferencesDto = z.infer<typeof updatePreferencesSchema>;

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
  })
  .strict();

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: passwordPolicy,
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z
  .object({
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export type DeleteAccountDto = z.infer<typeof deleteAccountSchema>;
