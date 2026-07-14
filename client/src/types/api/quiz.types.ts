export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  pdfId: string;
  createdAt: Date;
}

export interface QuizSubmission {
  quizId: string;
  answers: Record<string, string>;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}
