import { Types } from "mongoose";

import { documentRepository } from "../document/document.repository.js";
import { DOCUMENT_STATUS } from "../document/document.constants.js";

import type { SafeUser } from "../user/user.mapper.js";

import { aiService } from "../ai/ai.service.js";

import { flashcardRepository } from "./flashcard.repository.js";
import { FLASHCARD_STATUS } from "./flashcard.constants.js";

import { parseAiJson } from "@/shared/utils/parse-ai-json.js";

import { env } from "@/config/env.js";

import type { FlashcardAIResponse } from "./flashcard.types.js";
import { buildFlashcardPrompt } from "./flashcard.prompt.js";

export class FlashcardService {
  async generateDocumentFlashcards(
    user: SafeUser,
    documentId: string
  ) {
    // ============================================
    // Verify document ownership
    // ============================================

    const document = await documentRepository.findById(
      new Types.ObjectId(documentId),
      new Types.ObjectId(user.id)
    );

    if (!document) {
      throw new Error("Document not found");
    }

    if (
      document.processing?.status !==
      DOCUMENT_STATUS.READY
    ) {
      throw new Error("Document is still processing");
    }

    if (!document.extractedText?.trim()) {
      throw new Error(
        "Document contains no extracted text"
      );
    }

    // ============================================
    // Generate Flashcards
    // ============================================

    const prompt = buildFlashcardPrompt(
      document.extractedText
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
      throw new Error("Document not found");
    }

    const flashcards =
      await flashcardRepository.findByDocument(
        documentId
      );

    if (!flashcards) {
      throw new Error(
        "Flashcards not found"
      );
    }

    return flashcards;
  }
}

export const flashcardService =
  new FlashcardService();