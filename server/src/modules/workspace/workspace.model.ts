import {
  Schema,
  model,
  Types,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

import { WORKSPACE_ICON } from "./workspace.constants.js";

const workspaceSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    icon: {
      type: String,
      default: WORKSPACE_ICON.BOOK,
      enum: Object.values(WORKSPACE_ICON),
    },

    lastOpenedAt: {
      type: Date,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

workspaceSchema.index({
  owner: 1,
  createdAt: -1,
});

export interface Workspace extends InferSchemaType<typeof workspaceSchema> {}

export type WorkspaceDocument = HydratedDocument<Workspace>;

export const WorkspaceModel = model<Workspace>(
  "Workspace",
  workspaceSchema
);