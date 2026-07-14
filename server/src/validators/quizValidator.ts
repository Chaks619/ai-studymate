import { z } from 'zod';

export const createQuizSchema = z.object({
  pdfId: z.string().uuid('Invalid PDF ID'),
  questionCount: z.number().min(1).max(50).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export const submitQuizSchema = z.object({
  quizId: z.string().uuid('Invalid Quiz ID'),
  answers: z.record(z.string()),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
