import type { ConversationDocument } from "./conversation.model.js";

export interface SafeConversation {
  id: string;
  owner: string;
  document: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  titleGenerated: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toSafeConversation(
  conversation: ConversationDocument
): SafeConversation {
  return {
    id: conversation.id,
    owner: conversation.owner.toString(),
    document: conversation.document.toString(),
    title: conversation.title,
    lastMessage: conversation.lastMessage,
    messageCount: conversation.messageCount,
    titleGenerated: conversation.titleGenerated,
    isArchived: conversation.isArchived,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}