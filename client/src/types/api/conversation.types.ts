export interface Message {
  id: string;
  conversation: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A conversation as it appears in the list — metadata only, no messages.
 * This is what GET /documents/:id/conversations returns for each row.
 */
export interface ConversationSummary {
  id: string;
  owner: string;
  document: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  titleGenerated: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * A single open conversation together with its messages — the detail view.
 * The server sends the summary and the messages as two sibling fields; the
 * api layer flattens them into this one object so callers can read
 * `conversation.title` and `conversation.messages` off the same value.
 */
export interface Conversation extends ConversationSummary {
  messages: Message[];
}

/**
 * The reply to a follow-up message: the assistant's new message plus the
 * conversation's refreshed metadata (title and count may have changed).
 */
export interface SentMessage {
  conversation: ConversationSummary;
  message: Message;
}

export interface CreateConversationDto {
  message: string;
}

export interface SendMessageDto {
  message: string;
}
