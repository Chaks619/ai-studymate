import { Types } from "mongoose";

import { documentRepository } from "../document/document.repository.js";
import { DOCUMENT_STATUS } from "../document/document.constants.js";

import type { SafeUser } from "../user/user.mapper.js";

import { aiService } from "../ai/ai.service.js";

import { flashcardRepository } from "./flashcard.repository.js";
import { FLASHCARD_STATUS } from "./flashcard.constants.js";

import { parseAiJson } from "@/shared/utils/parse-ai-json.js";
import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";

import { env } from "@/config/env.js";

import type { FlashcardAIResponse } from "./flashcard.types.js";
import { buildFlashcardPrompt } from "./flashcard.prompt.js";
import type { GenerateFlashcardsDto } from "./flashcard.validator.js";

export class FlashcardService {
  async generateDocumentFlashcards(
    user: SafeUser,
    documentId: string,
    dto: GenerateFlashcardsDto
  ) {
    // ============================================
    // Verify document ownership
    // ============================================

    const document = await documentRepository.findById(
      new Types.ObjectId(documentId),
      new Types.ObjectId(user.id)
    );

    if (!document) {
      throw ApiError.notFound(
        "Document not found",
        ERROR_CODES.DOCUMENT_NOT_FOUND
      );
    }

    if (
      document.processing?.status !==
      DOCUMENT_STATUS.READY
    ) {
      throw ApiError.conflict(
        "Document is still processing",
        ERROR_CODES.DOCUMENT_NOT_READY
      );
    }

    if (!document.extractedText?.trim()) {
      throw ApiError.unprocessable(
        "Document contains no extracted text",
        ERROR_CODES.DOCUMENT_EMPTY
      );
    }

    // ============================================
    // Generate Flashcards
    // ============================================

    const cardCount =
      dto.cardCount ?? user.preferences.flashcardCount;

    const prompt = buildFlashcardPrompt(
      document.extractedText,
      cardCount,
      user.preferences
    );

    const startedAt = Date.now();

    const aiResponse = await aiService.generate({
      prompt,
    });

    const generationTimeMs =
      Date.now() - startedAt;

    const parsed =
      parseAiJson<FlashcardAIResponse>(
        aiResponse.text
      );

    // ============================================
    // Save
    // ============================================

    const existing =
      await flashcardRepository.findByDocument(
        documentId
      );

    let flashcards;

    if (!existing) {
      flashcards =
        await flashcardRepository.create({
          document: new Types.ObjectId(
            documentId
          ),

          title: parsed.title,

          cards: parsed.cards,

          status: FLASHCARD_STATUS.READY,

          model: env.GEMINI_MODEL,

          generationTimeMs,
        });
    } else {
      flashcards =
        await flashcardRepository.updateByDocument(
          documentId,
          {
            title: parsed.title,

            cards: parsed.cards,

            status: FLASHCARD_STATUS.READY,

            model: env.GEMINI_MODEL,

            generationTimeMs,
          }
        );
    }

    await documentRepository.updateById(
      documentId,
      {
        ai: {
          ...document.ai,
          flashcardsGenerated: true,
        },
      }
    );

    return flashcards;
  }

  async getDocumentFlashcards(
    user: SafeUser,
    documentId: string
  ) {
    const document =
      await documentRepository.findById(
        new Types.ObjectId(documentId),
        new Types.ObjectId(user.id)
      );

    if (!document) {
      throw ApiError.notFound(
        "Document not found",
        ERROR_CODES.DOCUMENT_NOT_FOUND
      );
    }

    const flashcards =
      await flashcardRepository.findByDocument(
        documentId
      );

    if (!flashcards) {
      throw ApiError.notFound(
        "Flashcards not found",
        ERROR_CODES.FLASHCARDS_NOT_FOUND
      );
    }

    return flashcards;
  }
}

export const flashcardService =
  new FlashcardService();