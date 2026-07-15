import { Types } from "mongoose";
import type { MessageRole } from "./message.constants.js";

export interface Message {
  conversation: Types.ObjectId;

  role: MessageRole;

  content: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateMessageInput {
  conversation: Types.ObjectId;

  role: MessageRole;

  content: string;
}