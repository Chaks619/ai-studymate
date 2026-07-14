import { z } from "zod";

export const generateQuizSchema = z.object({
  questionCount: z
    .number()
    .int()
    .min(5)
    .max(50),

  difficulty: z
    .enum([
      "easy",
      "medium",
      "hard",
      "mixed",
    ])
    .default("mixed"),
});

export type GenerateQuizDto =
  z.infer<typeof generateQuizSchema>;