import {
  Schema,
  model,
  Types,
  type HydratedDocument,
} from "mongoose";

import { SUMMARY_STATUS } from "./summary.constants.js";
import type { Summary } from "./summary.types.js";

const summarySchema = new Schema(
  {
    workspace: {
      type: Types.ObjectId,
      ref: "Workspace",
      required: true,
      unique: true,
      index: true,
    },

    content: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(SUMMARY_STATUS),
      default: SUMMARY_STATUS.GENERATING,
    },

    model: {
      type: String,
      required: true,
    },

    generationTimeMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type SummaryDocument = HydratedDocument<Summary>;

export const SummaryModel = model<Summary>(
  "Summary",
  summarySchema
);