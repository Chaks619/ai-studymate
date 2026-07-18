import { Types } from "mongoose";

import {
  MessageModel,
  type MessageDocument,
} from "./message.model.js";

import type {
  CreateMessageInput,
} from "./message.types.js";

export class MessageRepository {

  async create(
    data: CreateMessageInput
  ): Promise<MessageDocument> {
    return MessageModel.create(data);
  }

  async findByConversation(
    conversation: Types.ObjectId
  ): Promise<MessageDocument[]> {
    return MessageModel.find({
      conversation,
    })
      .sort({
        createdAt: 1,
      });
  }

  async findRecentMessages(
    conversation: Types.ObjectId,
    limit = 10
  ) {
    return MessageModel.find({
      conversation,
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .lean();
  }

  async deleteById(id: Types.ObjectId) {
    await MessageModel.deleteOne({ _id: id });
  }

  async deleteByConversation(
    conversation: Types.ObjectId
  ) {
    await MessageModel.deleteMany({
      conversation,
    });
  }

}

export const messageRepository =
  new MessageRepository();