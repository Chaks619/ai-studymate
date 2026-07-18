import { Types } from "mongoose";

import {
  ConversationModel,
  type ConversationDocument,
} from "./conversation.model.js";

import type {
  CreateConversationInput,
  UpdateConversationInput,
} from "./conversation.types.js";

export class ConversationRepository {

  async create(
    data: CreateConversationInput
  ): Promise<ConversationDocument> {
    return ConversationModel.create(data);
  }

  async findById(
    id: Types.ObjectId
  ) {
    return ConversationModel.findById(id);
  }

  async findByDocument(
    document: Types.ObjectId,
    owner: Types.ObjectId
  ) {
    return ConversationModel.find({
      document,
      owner,
      isArchived: false,
    })
      .sort({
        updatedAt: -1,
      });
  }

  async update(
    id: Types.ObjectId,
    data: UpdateConversationInput
  ) {
    return ConversationModel.findByIdAndUpdate(
      id,
      data,
      {
        returnDocument: "after",
      }
    );
  }

  async archive(
    id: Types.ObjectId
  ) {
    return ConversationModel.findByIdAndUpdate(
      id,
      {
        isArchived: true,
      },
      {
        returnDocument: "after",
      }
    );
  }

  async delete(
    id: Types.ObjectId
  ) {
    await ConversationModel.deleteOne({
      _id: id,
    });
  }

}
export const conversationRepository =
  new ConversationRepository();