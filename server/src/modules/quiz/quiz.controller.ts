import type { NextFunction, Request, Response } from 'express';

import type { DocumentParams } from '@/shared/types/express.types.js';

import { ApiError, ERROR_CODES } from '@/shared/errors/index.js';
import { assertObjectId } from '@/shared/utils/object-id.js';

import { quizService } from './quiz.service.js';
import { generateQuizSchema } from './quiz.validator.js';

export class QuizController {
  private getDocumentId(req: Request<DocumentParams>) {
    const { documentId } = req.params;

    if (!documentId) {
      throw ApiError.badRequest(
        'Document ID is required',
        ERROR_CODES.MISSING_PARAMETER
      );
    }

    return assertObjectId(documentId, 'document ID');
  }

  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw ApiError.unauthorized('Unauthorized');
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
      return next(error);
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
      return next(error);
    }
  }
}

export const quizController = new QuizController();
