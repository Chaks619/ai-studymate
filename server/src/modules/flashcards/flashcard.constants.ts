export const FLASHCARD_STATUS = {
  GENERATING: "GENERATING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type FlashcardStatus =
  (typeof FLASHCARD_STATUS)[keyof typeof FLASHCARD_STATUS];