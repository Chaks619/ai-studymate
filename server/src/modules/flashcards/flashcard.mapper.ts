export function toFlashcardResponse(
  flashcard: any
) {
  return {
    id: flashcard._id.toString(),

    document: flashcard.document.toString(),

    title: flashcard.title,

    cards: flashcard.cards,

    status: flashcard.status,

    model: flashcard.model,

    generationTimeMs:flashcard.generationTimeMs,

    createdAt: flashcard.createdAt,

    updatedAt: flashcard.updatedAt,
  };
}