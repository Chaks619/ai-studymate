import type { UserPreferences } from "../user/user.mapper.js";
import { buildStudyDirectives } from "../ai/prompts/preferences.prompt.js";

export function buildFlashcardPrompt(
  text: string,
  cardCount: number,
  preferences: UserPreferences
) {
  return `
You are an expert teacher.

Generate exactly ${cardCount} high-quality flashcards from the document.

${buildStudyDirectives(preferences)}

Return ONLY valid JSON.

Format:

{
  "title": "Document Title",
  "cards": [
    {
      "question": "...",
      "answer": "...",
      "difficulty": "easy"
    }
  ]
}

Rules:

- Generate exactly ${cardCount} cards.
- Difficulty must be one of: easy, medium, hard.
- Use a mix of difficulties.
- Do not return markdown.

Document:

${text}
`;
}
