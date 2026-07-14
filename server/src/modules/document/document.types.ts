import { Types } from "mongoose";
import type { DocumentLanguage, DocumentStatus } from "./document.constants.js";

export interface CreateDocumentInput {
  owner: Types.ObjectId;
  workspace: Types.ObjectId;
  title: string;
  description?: string;
  extractedText?: string;
  tags?: string[];
  lastOpenedAt?: Date | null;
  isArchived?: boolean;
  file: {
    originalName: string;
    mimeType: string;
    extension: string;
    size: number;
    url: string;
    publicId: string;
  };

  processing?: {
    status?: DocumentStatus;
    pageCount?: number;
    language?: DocumentLanguage;
  };
}

export interface UpdateDocumentInput {
  title?: string;
  description?: string;
  extractedText?: string;

  processing?: {
    status?: DocumentStatus;
    pageCount?: number;
    language?: DocumentLanguage;
  };

  ai?: {
    summaryGenerated?: boolean;
    flashcardsGenerated?: boolean;
    quizGenerated?: boolean;
    roadmapGenerated?: boolean;
    chatEnabled?: boolean;
  };

  tags?: string[];

  lastOpenedAt?: Date;

  isArchived?: boolean;
}