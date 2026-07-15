import { Types } from "mongoose";

export interface Conversation {
  owner: Types.ObjectId;

  document: Types.ObjectId;

  title: string;

  lastMessage: string;

  messageCount: number;

  isArchived: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateConversationInput {
  owner: Types.ObjectId;

  document: Types.ObjectId;

  title: string;

  lastMessage?: string;

  messageCount?: number;

  isArchived?: boolean;
}

export interface UpdateConversationInput {
  title?: string;

  lastMessage?: string;

  messageCount?: number;

  isArchived?: boolean;
}