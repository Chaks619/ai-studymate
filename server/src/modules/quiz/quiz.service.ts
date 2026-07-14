import { Types } from 'mongoose';

import { documentRepository } from '../document/document.repository.js';
import { DOCUMENT_STATUS } from '../document/document.constants.js';
import type { SafeUser } from '../user/user.mapper.js';
import { aiService } from '../ai/ai.service.js';
import { quizRepository } from './quiz.repository.js';
import { QUIZ_STATUS } from './quiz.constants.js';
import { parseAiJson } from '@/shared/utils/parse-ai-json.js';
import { env } from '@/config/env.js';
import type { QuizAIResponse } from './quiz.types.js';
import { buildQuizPrompt } from './quiz.prompt.js';
import type { GenerateQuizDto } from './quiz.validator.js';

export class QuizService {
  async generateDocumentQuiz(user: SafeUser, documentId: string, dto: GenerateQuizDto) {
    const document = await documentRepository.findById(
      new Types.ObjectId(documentId),
      new Types.ObjectId(user.id)
    );

    if (!document) {
      throw new Error('Document not found');
    }

    if (document.processing?.status !== DOCUMENT_STATUS.READY) {
      throw new Error('Document is still processing');
    }

    if (!document.extractedText?.trim()) {
      throw new Error('Document contains no extracted text');
    }

    const prompt = buildQuizPrompt(document.extractedText, dto.questionCount, dto.difficulty);

    const startedAt = Date.now();

    const aiResponse = await aiService.generate({
      prompt,
    });

    const generationTimeMs = Date.now() - startedAt;

    const parsed = parseAiJson<QuizAIResponse>(aiResponse.text);

    const existing = await quizRepository.findByDocument(documentId);

    let quiz;

    if (!existing) {
      quiz = await quizRepository.create({
        document: new Types.ObjectId(documentId),

        title: parsed.title,

        questions: parsed.questions,

        status: QUIZ_STATUS.READY,

        model: env.GEMINI_MODEL,

        generationTimeMs,
      });
    } else {
      quiz = await quizRepository.updateByDocument(documentId, {
        title: parsed.title,

        questions: parsed.questions,

        status: QUIZ_STATUS.READY,

        model: env.GEMINI_MODEL,

        generationTimeMs,
      });
    }

    await documentRepository.updateById(documentId, {
      ai: {
        ...document.ai,
        quizGenerated: true,
      },
    });

    return quiz;
  }

  async getDocumentQuiz(user: SafeUser, documentId: string) {
    const document = await documentRepository.findById(
      new Types.ObjectId(documentId),
      new Types.ObjectId(user.id)
    );

    if (!document) {
      throw new Error('Document not found');
    }

    const quiz = await quizRepository.findByDocument(documentId);

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return quiz;
  }
}

export const quizService = new QuizService();
