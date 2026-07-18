import { Types } from "mongoose";

import { workspaceRepository } from "./workspace.repository.js";
import { toWorkspaceResponse } from "./workspace.mapper.js";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "./workspace.types.js";
import type { SafeUser } from "../user/user.mapper.js";
import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";

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

  /**
   * Every lookup below is scoped to the caller. A workspace belonging to
   * someone else reports as missing rather than forbidden, so an id cannot be
   * probed for existence.
   */
  async getWorkspace(user: SafeUser, id: string) {
    const workspace = await workspaceRepository.findByIdAndOwner(
      id,
      user.id
    );

    if (!workspace) {
      throw ApiError.notFound(
        "Workspace not found",
        ERROR_CODES.WORKSPACE_NOT_FOUND
      );
    }

    return toWorkspaceResponse(workspace);
  }

  async updateWorkspace(
    user: SafeUser,
    id: string,
    data: UpdateWorkspaceInput
  ) {
    const workspace =
      await workspaceRepository.updateByIdAndOwner(
        id,
        user.id,
        data
      );

    if (!workspace) {
      throw ApiError.notFound(
        "Workspace not found",
        ERROR_CODES.WORKSPACE_NOT_FOUND
      );
    }

    return toWorkspaceResponse(workspace);
  }

  async archiveWorkspace(user: SafeUser, id: string) {
    const workspace =
      await workspaceRepository.archiveByIdAndOwner(
        id,
        user.id
      );

    if (!workspace) {
      throw ApiError.notFound(
        "Workspace not found",
        ERROR_CODES.WORKSPACE_NOT_FOUND
      );
    }

    return toWorkspaceResponse(workspace);
  }
}

export const workspaceService = new WorkspaceService();