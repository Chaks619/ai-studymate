import { WorkspaceModel, type WorkspaceDocument } from './workspace.model.js';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from './workspace.types.js';

export class WorkspaceRepository {
  async create(data: CreateWorkspaceInput): Promise<WorkspaceDocument> {
    return WorkspaceModel.create(data);
  }

  async findById(id: string): Promise<WorkspaceDocument | null> {
    return WorkspaceModel.findById(id);
  }

  async findByOwner(ownerId: string): Promise<WorkspaceDocument[]> {
    return WorkspaceModel.find({
      owner: ownerId,
      isArchived: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findByIdAndOwner(workspaceId: string, ownerId: string) {
    return WorkspaceModel.findOne({
      _id: workspaceId,
      owner: ownerId,
      isArchived: false,
    });
  }

  async updateById(id: string, data: UpdateWorkspaceInput): Promise<WorkspaceDocument | null> {
    return WorkspaceModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async archive(id: string) {
    return WorkspaceModel.findByIdAndUpdate(
      id,
      {
        isArchived: true,
      },
      {
        new: true,
      }
    );
  }
}

export const workspaceRepository = new WorkspaceRepository();
