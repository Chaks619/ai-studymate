export class CreateQuizDto {
  pdfId: string;
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class SubmitQuizDto {
  quizId: string;
  answers: Record<string, string>;
}
