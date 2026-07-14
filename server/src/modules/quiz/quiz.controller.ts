import type { NextFunction, Request, Response } from 'express';

import type { DocumentParams } from '@/shared/types/express.types.js';

import { quizService } from './quiz.service.js';
import { generateQuizSchema } from './quiz.validator.js';

export class QuizController {
  private getDocumentId(req: Request<DocumentParams>) {
    const { documentId } = req.params;

    if (!documentId) {
      throw new Error('Document ID is required');
    }

    return documentId;
  }

  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw new Error('Unauthorized');
    }

    return req.user;
  }

  async generate(req: Request<DocumentParams>, res: Response, next: NextFunction) {
    try {
      const documentId = this.getDocumentId(req);
      const user = this.getAuthenticatedUser(req);
      const dto = generateQuizSchema.parse(req.body);
      const quiz = await quizService.generateDocumentQuiz(user, documentId, dto);

      return res.status(200).json({
        success: true,
        message: 'Quiz generated successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request<DocumentParams>, res: Response, next: NextFunction) {
    try {
      const documentId = this.getDocumentId(req);

      const user = this.getAuthenticatedUser(req);

      const quiz = await quizService.getDocumentQuiz(user, documentId);

      return res.status(200).json({
        success: true,
        message: 'Quiz fetched successfully',
        data: quiz,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const quizController = new QuizController();
