import {
  SummaryModel,
  type SummaryDocument,
} from "./summary.model.js";

import type {
  CreateSummaryInput,
  UpdateSummaryInput,
} from "./summary.types.js";

export class SummaryRepository {
  async create(
    data: CreateSummaryInput
  ): Promise<SummaryDocument> {
    return await SummaryModel.create(data);
  }

  async findByDocument(
    documentId: string
  ): Promise<SummaryDocument | null> {
    return await SummaryModel.findOne({
      document: documentId,
    });
  }

  async updateByDocument(
    documentId: string,
    data: UpdateSummaryInput
  ): Promise<SummaryDocument | null> {
    return await SummaryModel.findOneAndUpdate(
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
    await SummaryModel.deleteOne({
      document: documentId,
    });
  }
}

export const summaryRepository =
  new SummaryRepository();