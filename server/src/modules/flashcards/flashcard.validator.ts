import { z } from "zod";

import {
  FLASHCARD_COUNT_MAX,
  FLASHCARD_COUNT_MIN,
} from "../user/user.constants.js";

export const generateFlashcardsSchema = z.object({
  /**
   * Optional: when the request omits it, the service falls back to the
   * user's `flashcardCount` preference.
   */
  cardCount: z
    .number()
    .int()
    .min(FLASHCARD_COUNT_MIN)
    .max(FLASHCARD_COUNT_MAX)
    .optional(),
});

export type GenerateFlashcardsDto = z.infer<
  typeof generateFlashcardsSchema
>;
