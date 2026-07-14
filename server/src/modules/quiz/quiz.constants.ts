export const QUIZ_STATUS = {
  GENERATING: "GENERATING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type QuizStatus =
  (typeof QUIZ_STATUS)[keyof typeof QUIZ_STATUS];