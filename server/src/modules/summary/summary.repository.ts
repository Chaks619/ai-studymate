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

  async findByWorkspace(
    workspaceId: string
  ): Promise<SummaryDocument | null> {
    return await SummaryModel.findOne({
      workspace: workspaceId,
    });
  }

  async updateByWorkspace(
    workspaceId: string,
    data: UpdateSummaryInput
  ): Promise<SummaryDocument | null> {
    return await SummaryModel.findOneAndUpdate(
      {
        workspace: workspaceId,
      },
      data,
      {
        new: true,
      }
    );
  }

  async deleteByWorkspace(
    workspaceId: string
  ): Promise<void> {
    await SummaryModel.deleteOne({
      workspace: workspaceId,
    });
  }
}

export const summaryRepository =
  new SummaryRepository();