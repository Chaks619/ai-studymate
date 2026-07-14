export function buildFlashcardPrompt(
  text: string
) {
  return `
You are an expert teacher.

Generate 15 high-quality flashcards from the document.

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

Difficulty must be a mix of:
- easy
- medium
- hard

Do not return markdown.

Document:

${text}
`;
}