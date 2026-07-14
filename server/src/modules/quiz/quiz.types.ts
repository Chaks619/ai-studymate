import { Types } from "mongoose";
import type { QuizStatus } from "./quiz.constants.js";

export interface QuizQuestion {
  question: string;

  options: string[];

  correctAnswer: number;

  explanation: string;

  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  document: Types.ObjectId;

  title: string;

  questions: QuizQuestion[];

  status: QuizStatus;

  model: string;

  generationTimeMs: number;

  createdAt: Date;

  updatedAt: Date;
}

export type CreateQuizInput = Omit<
  Quiz,
  "createdAt" | "updatedAt"
>;

export type UpdateQuizInput = Partial<
  Omit<
    Quiz,
    "document" | "createdAt" | "updatedAt"
  >
>;

export interface QuizAIResponse {
  title: string;

  questions: QuizQuestion[];
}