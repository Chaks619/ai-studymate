import { ApiResponse } from "../api";

export interface Workspace {
  id: string;
  owner: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  lastOpenedAt: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceResponse = ApiResponse<Workspace>;

export type WorkspaceListResponse = ApiResponse<Workspace[]>;

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}