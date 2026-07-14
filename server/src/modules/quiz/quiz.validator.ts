import { z } from "zod";

import {
  QUIZ_QUESTION_COUNT_MAX,
  QUIZ_QUESTION_COUNT_MIN,
} from "../user/user.constants.js";

/**
 * Both fields are optional: when the request omits one, the service falls
 * back to the user's saved quiz preferences.
 */
export const generateQuizSchema = z.object({
  questionCount: z
    .number()
    .int()
    .min(QUIZ_QUESTION_COUNT_MIN)
    .max(QUIZ_QUESTION_COUNT_MAX)
    .optional(),

  difficulty: z
    .enum([
      "easy",
      "medium",
      "hard",
      "mixed",
    ])
    .optional(),
});

export type GenerateQuizDto =
  z.infer<typeof generateQuizSchema>;
