export function toQuizResponse(
  quiz: any
) {
  return {
    id: quiz._id.toString(),

    document: quiz.document.toString(),

    title: quiz.title,

    questions: quiz.questions,

    status: quiz.status,

    model: quiz.model,

    generationTimeMs:
      quiz.generationTimeMs,

    createdAt: quiz.createdAt,

    updatedAt: quiz.updatedAt,
  };
}