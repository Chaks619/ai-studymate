import { Types } from "mongoose";
import type { WorkspaceIcon } from "./workspace.constants.js";

export interface CreateWorkspaceInput {
  owner: Types.ObjectId;
  name: string;
  description?: string;
  icon?: WorkspaceIcon;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  icon?: WorkspaceIcon;
  lastOpenedAt?: Date;
  isArchived?: boolean;
}