import {
  FlashcardModel,
  type FlashcardDocument,
} from "./flashcard.model.js";

import type {
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from "./flashcard.types.js";

export class FlashcardRepository {
  async create(
    data: CreateFlashcardInput
  ): Promise<FlashcardDocument> {
    return FlashcardModel.create(data);
  }

  async findByDocument(
    documentId: string
  ): Promise<FlashcardDocument | null> {
    return FlashcardModel.findOne({
      document: documentId,
    });
  }

  async updateByDocument(
    documentId: string,
    data: UpdateFlashcardInput
  ): Promise<FlashcardDocument | null> {
    return FlashcardModel.findOneAndUpdate(
      {
        document: documentId,
      },
      data,
      {
        returnDocument: "after",
      }
    );
  }

  async deleteByDocument(
    documentId: string
  ): Promise<void> {
    await FlashcardModel.deleteOne({
      document: documentId,
    });
  }
}

export const flashcardRepository =
  new FlashcardRepository();