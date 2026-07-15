import {
  Schema,
  model,
  Types,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

import { CONVERSATION_TITLE } from "./conversation.constants.js";

const conversationSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    document: {
      type: Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: CONVERSATION_TITLE.DEFAULT,
      trim: true,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    messageCount: {
      type: Number,
      default: 0,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

conversationSchema.index({
  owner: 1,
  document: 1,
  updatedAt: -1,
});

export type Conversation =
  InferSchemaType<
    typeof conversationSchema
  >;

export type ConversationDocument =
  HydratedDocument<Conversation>;

export const ConversationModel =
  model<Conversation>(
    "Conversation",
    conversationSchema
  );