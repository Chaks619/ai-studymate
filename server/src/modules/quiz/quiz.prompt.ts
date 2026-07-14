import type { UserPreferences } from "../user/user.mapper.js";
import { buildStudyDirectives } from "../ai/prompts/preferences.prompt.js";

export function buildQuizPrompt(
  text: string,
  questionCount: number,
  difficulty: string,
  preferences: UserPreferences
) {
  return `
You are an expert teacher.

Generate exactly ${questionCount} multiple-choice questions.

Difficulty: ${difficulty}.

${buildStudyDirectives(preferences)}

Return ONLY valid JSON.

{
  "title":"Quiz",
  "questions":[
    {
      "question":"...",
      "options":[
        "...",
        "...",
        "...",
        "..."
      ],
      "correctAnswer":0,
      "explanation":"...",
      "difficulty":"easy"
    }
  ]
}

Rules:

- Generate exactly ${questionCount} questions.
- Every question must have exactly 4 options.
- correctAnswer must be between 0 and 3.
- Return only JSON.

Document:

${text}
`;
}
