import { Types } from 'mongoose';
import type { FlashcardStatus } from './flashcard.constants.js';

export interface FlashcardItem {
  question: string;
  answer: string;
}

export interface Flashcard {
  document: Types.ObjectId;
  title: string;
  cards: FlashcardItem[];
  status: FlashcardStatus;
  model: string;
  generationTimeMs: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardAIResponse {
  title: string;
  cards: FlashcardItem[];
}

export type CreateFlashcardInput = Omit<Flashcard, 'createdAt' | 'updatedAt'>;

export type UpdateFlashcardInput = Partial<Omit<Flashcard, 'document' | 'createdAt' | 'updatedAt'>>;
