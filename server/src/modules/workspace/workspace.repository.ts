import { WorkspaceModel, type WorkspaceDocument } from './workspace.model.js';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from './workspace.types.js';

export class WorkspaceRepository {
  async create(data: CreateWorkspaceInput): Promise<WorkspaceDocument> {
    return WorkspaceModel.create(data);
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

  /**
   * Reads and writes are owner-scoped in the query itself rather than checked
   * beforehand: a single filter cannot be forgotten at a call site, and there
   * is no window between the check and the write.
   */
  async updateByIdAndOwner(
    id: string,
    ownerId: string,
    data: UpdateWorkspaceInput
  ): Promise<WorkspaceDocument | null> {
    return WorkspaceModel.findOneAndUpdate(
      {
        _id: id,
        owner: ownerId,
        isArchived: false,
      },
      data,
      {
        new: true,
      }
    );
  }

  async archiveByIdAndOwner(id: string, ownerId: string) {
    return WorkspaceModel.findOneAndUpdate(
      {
        _id: id,
        owner: ownerId,
        isArchived: false,
      },
      {
        isArchived: true,
      },
      {
        new: true,
      }
    );
  }

  async deleteManyByOwner(ownerId: string): Promise<void> {
    await WorkspaceModel.deleteMany({
      owner: ownerId,
    });
  }
}

export const workspaceRepository = new WorkspaceRepository();
