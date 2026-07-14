import type { ParamsDictionary } from "express-serve-static-core";

export interface IdParams extends ParamsDictionary {
  id: string;
}

export interface WorkspaceParams extends ParamsDictionary {
  workspaceId: string;
}

export interface DocumentParams extends ParamsDictionary {
  workspaceId: string;
  documentId: string;
}

export interface QuizParams{
  workspaceId: string;
  quizId: string;
}

export interface FlashcardParams {
  workspaceId: string;
  flashcardId: string;
}

export interface ChatParams {
  workspaceId: string;
  chatId: string;
}