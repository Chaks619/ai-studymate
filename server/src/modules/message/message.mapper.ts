import type { MessageDocument } from "./message.model.js";

export interface SafeMessage {
  id: string;
  conversation: string;
  role: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toSafeMessage(
  message: MessageDocument
): SafeMessage {
  return {
    id: message.id,
    conversation: message.conversation.toString(),
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}