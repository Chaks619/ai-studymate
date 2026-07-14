import { ApiResponse } from "../api";

export interface Document {
  id: string;

  workspace: string;

  owner: string;

  title: string;

  description: string;

  extractedText: string;

  file: {
    originalName: string;
    url: string;
    size: number;
    extension: string;
  };

  processing: {
    status: string;
    pageCount: number;
    language: string;
  };

  ai: {
    summaryGenerated: boolean;
    flashcardsGenerated: boolean;
    quizGenerated: boolean;
    roadmapGenerated: boolean;
    chatEnabled: boolean;
  };

  createdAt: string;

  updatedAt: string;
}

export type DocumentResponse = ApiResponse<Document>;

export type DocumentListResponse = ApiResponse<Document[]>;