import {
  QuizModel,
  type QuizDocument,
} from "./quiz.model.js";

import type {
  CreateQuizInput,
  UpdateQuizInput,
} from "./quiz.types.js";

export class QuizRepository {
  async create(
    data: CreateQuizInput
  ): Promise<QuizDocument> {
    return QuizModel.create(data);
  }

  async findByDocument(
    documentId: string
  ): Promise<QuizDocument | null> {
    return QuizModel.findOne({
      document: documentId,
    });
  }

  async updateByDocument(
    documentId: string,
    data: UpdateQuizInput
  ): Promise<QuizDocument | null> {
    return QuizModel.findOneAndUpdate(
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
  ) {
    await QuizModel.deleteOne({
      document: documentId,
    });
  }
}

export const quizRepository =
  new QuizRepository();