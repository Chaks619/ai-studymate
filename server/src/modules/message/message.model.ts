import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  Types,
} from "mongoose";

import { MESSAGE_ROLE } from "./message.constants.js";

const messageSchema = new Schema(
  {
    conversation: {
      type: Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: Object.values(MESSAGE_ROLE),
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

export type Message = InferSchemaType<
  typeof messageSchema
>;

export type MessageDocument =
  HydratedDocument<Message>;

export const MessageModel =
  model<Message>(
    "Message",
    messageSchema
  );