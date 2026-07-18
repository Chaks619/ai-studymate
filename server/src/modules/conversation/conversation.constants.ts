export const CONVERSATION_TITLE = {
  DEFAULT: "New Chat",
  MAX_LENGTH: 60,
} as const;

/**
 * How many past messages are replayed to Gemini. Caps prompt growth as a
 * conversation gets long — older turns fall out of the window.
 */
export const CONVERSATION_HISTORY_LIMIT = 10;

/**
 * lastMessage only ever renders as a preview line in the conversation list,
 * so the full assistant answer is not worth storing twice.
 */
export const CONVERSATION_PREVIEW_LENGTH = 200;

/**
 * Guards the prompt budget at the edge: the document text already consumes
 * most of the context window, so a caller cannot also paste a novel.
 */
export const CONVERSATION_MESSAGE_MAX_LENGTH = 4000;
