import type { SafeMessage } from "@/modules/message/message.mapper.js";

export function buildConversationPrompt(
  documentText: string,
  messages: SafeMessage[],
  userMessage: string
) {
  const history = messages
    .map(
      (message) =>
        `${message.role.toUpperCase()}: ${message.content}`
    )
    .join("\n\n");

  return `
You are AI StudyMate.

You are answering questions ONLY using the uploaded document.

If the answer cannot be found in the document, clearly say so.

========================
DOCUMENT
========================

${documentText}

========================
CONVERSATION HISTORY
========================

${history}

========================
CURRENT QUESTION
========================

${userMessage}

Provide a clear, accurate and concise answer.
`;
}
