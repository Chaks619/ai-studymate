import {
  AI_TONE,
  STUDY_LEVEL,
  SUMMARY_LENGTH,
} from "@/modules/user/user.constants.js";

import type { UserPreferences } from "@/modules/user/user.mapper.js";

const TONE_DIRECTIVE: Record<string, string> = {
  [AI_TONE.PROFESSIONAL]:
    "Write in a clear, professional voice. Be precise and avoid filler.",

  [AI_TONE.SIMPLE]:
    "Write in plain, everyday language. Prefer short sentences and avoid jargon; when a technical term is unavoidable, define it the first time it appears.",

  [AI_TONE.ACADEMIC]:
    "Write in an academic register. Use correct technical terminology and preserve the precision of the source material.",

  [AI_TONE.EXAM_PREP]:
    "Write like an exam coach. Emphasise what is most likely to be assessed, flag common mistakes, and make key facts easy to memorise.",
};

const STUDY_LEVEL_DIRECTIVE: Record<string, string> = {
  [STUDY_LEVEL.BEGINNER]:
    "Assume the reader is new to this subject. Explain concepts from first principles and do not assume prior background.",

  [STUDY_LEVEL.INTERMEDIATE]:
    "Assume the reader knows the fundamentals of this subject but not its finer details.",

  [STUDY_LEVEL.ADVANCED]:
    "Assume the reader is well versed in this subject. Use technical terminology freely and skip introductory explanation.",
};

export const SUMMARY_LENGTH_DIRECTIVE: Record<string, string> = {
  [SUMMARY_LENGTH.SHORT]:
    "Keep the summary brief — the essential points only, roughly 150-250 words.",

  [SUMMARY_LENGTH.MEDIUM]:
    "Aim for a balanced summary of roughly 400-600 words that covers every major section.",

  [SUMMARY_LENGTH.DETAILED]:
    "Write a thorough summary. Cover every section in depth, keep supporting detail, and do not worry about length.",
};

/**
 * The tone and reading-level block shared by every generation prompt, so a
 * user's preferences read the same way whether they're getting a summary, a
 * quiz, or a deck of flashcards.
 */
export const buildStudyDirectives = (
  preferences: UserPreferences
): string => {
  const tone =
    TONE_DIRECTIVE[preferences.aiTone] ?? TONE_DIRECTIVE[AI_TONE.SIMPLE];

  const level =
    STUDY_LEVEL_DIRECTIVE[preferences.studyLevel] ??
    STUDY_LEVEL_DIRECTIVE[STUDY_LEVEL.INTERMEDIATE];

  return `
Audience and style:

- ${level}
- ${tone}
`.trim();
};
