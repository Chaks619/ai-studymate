export function buildConversationTitlePrompt(
  message: string
) {
  return `
Generate a short title (maximum 5 words) for this conversation.

Message:

"${message}"

Return ONLY the title.

No quotation marks.
`;
}
