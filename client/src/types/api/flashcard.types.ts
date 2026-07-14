export interface Flashcard {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardSet {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: Date;
}
