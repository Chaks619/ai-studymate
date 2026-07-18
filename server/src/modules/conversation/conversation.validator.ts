import { z } from "zod";

import { CONVERSATION_MESSAGE_MAX_LENGTH } from "./conversation.constants.js";

const messageField = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(
    CONVERSATION_MESSAGE_MAX_LENGTH,
    `Message cannot exceed ${CONVERSATION_MESSAGE_MAX_LENGTH} characters`
  );

export const createConversationSchema = z.object({
  message: messageField,
});

export const sendMessageSchema = z.object({
  message: messageField,
});

export type CreateConversationSchema = z.infer<
  typeof createConversationSchema
>;

export type SendMessageSchema = z.infer<
  typeof sendMessageSchema
>;
