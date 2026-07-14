import { Types } from "mongoose";
import type {
  WorkspaceColor,
  WorkspaceIcon,
} from "./workspace.constants.js";

export interface CreateWorkspaceInput {
  owner: Types.ObjectId;
  name: string;
  description?: string;
  color?: WorkspaceColor;
  icon?: WorkspaceIcon;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  color?: WorkspaceColor;
  icon?: WorkspaceIcon;
  lastOpenedAt?: Date;
  isArchived?: boolean;
}