import type { WorkspaceDocument } from "./workspace.model.js";

export interface WorkspaceResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  lastOpenedAt: Date | null | undefined;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toWorkspaceResponse = (
  workspace: WorkspaceDocument
): WorkspaceResponse => {
  return {
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    icon: workspace.icon,
    lastOpenedAt: workspace.lastOpenedAt,
    isArchived: workspace.isArchived,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
};