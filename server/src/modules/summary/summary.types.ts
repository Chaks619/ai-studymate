import { Types } from "mongoose";
import type { SummaryStatus } from "./summary.constants.js";

export interface Summary {
  document: Types.ObjectId;

  content: string;

  status: SummaryStatus;

  model: string;

  generationTimeMs: number;

  createdAt: Date;

  updatedAt: Date;
}

export interface CreateSummaryInput {
  document: Types.ObjectId;

  content: string;

  status: SummaryStatus;

  model: string;

  generationTimeMs: number;
}

export interface UpdateSummaryInput {
  content?: string;

  status?: SummaryStatus;

  model?: string;

  generationTimeMs?: number;
}