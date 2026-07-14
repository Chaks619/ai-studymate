import { Types } from "mongoose";

import { workspaceRepository } from "./workspace.repository.js";
import { toWorkspaceResponse } from "./workspace.mapper.js";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "./workspace.types.js";
import type { SafeUser } from "../user/user.mapper.js";

export class WorkspaceService {
  async createWorkspace(
    user: SafeUser,
    data: Omit<CreateWorkspaceInput, "owner">
  ) {
    const workspace = await workspaceRepository.create({
      ...data,
      owner: new Types.ObjectId(user.id),
    });

    return toWorkspaceResponse(workspace);
  }

  async getMyWorkspaces(user: SafeUser) {
    const workspaces = await workspaceRepository.findByOwner(user.id);

    return workspaces.map(toWorkspaceResponse);
  }

  async getWorkspace(id: string) {
    const workspace = await workspaceRepository.findById(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return toWorkspaceResponse(workspace);
  }

  async updateWorkspace(
    id: string,
    data: UpdateWorkspaceInput
  ) {
    const workspace = await workspaceRepository.updateById(id, data);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return toWorkspaceResponse(workspace);
  }

  async archiveWorkspace(id: string) {
    const workspace = await workspaceRepository.archive(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return toWorkspaceResponse(workspace);
  }
}

export const workspaceService = new WorkspaceService();