import { Types } from "mongoose";

import { documentRepository } from "../document/document.repository.js";

import { aiService } from "../ai/ai.service.js";
import { buildSummaryPrompt } from "../ai/prompts/summary.prompt.js";

import { summaryRepository } from "./summary.repository.js";
import { SUMMARY_STATUS } from "./summary.constants.js";

import { env } from "../../config/env.js";

import type { SafeUser } from "../user/user.mapper.js";

import { DOCUMENT_STATUS } from "../document/document.constants.js";
import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";

export class SummaryService {
  async generateDocumentSummary(
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
      throw ApiError.notFound(
        "Document not found",
        ERROR_CODES.DOCUMENT_NOT_FOUND
      );
    }

    // ============================================
    // Verify processing completed
    // ============================================

    if (document.processing?.status !== DOCUMENT_STATUS.READY) {
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
    // Build AI Prompt
    // ============================================

    const prompt = buildSummaryPrompt(
      document.extractedText,
      user.preferences
    );

    // ============================================
    // Generate Summary
    // ============================================

    const startedAt = Date.now();

    const aiResponse = await aiService.generate({
      prompt,
    });

    const generationTimeMs =
      Date.now() - startedAt;

    // ============================================
    // Save Summary
    // ============================================

    const existingSummary =
      await summaryRepository.findByDocument(
        documentId
      );

    let summary;

    if (!existingSummary) {
      summary = await summaryRepository.create({
        document: new Types.ObjectId(documentId),

        content: aiResponse.text,

        status: SUMMARY_STATUS.READY,

        model: env.GEMINI_MODEL,

        generationTimeMs,
      });
    } else {
      summary =
        await summaryRepository.updateByDocument(
          documentId,
          {
            content: aiResponse.text,

            status: SUMMARY_STATUS.READY,

            model: env.GEMINI_MODEL,

            generationTimeMs,
          }
        );
    }

    // ============================================
    // Update Document AI Flags
    // ============================================

    await documentRepository.updateById(
      documentId,
      {
        ai: {
          ...document.ai,
          summaryGenerated: true,
        },
      }
    );

    return summary;
  }

  async getDocumentSummary(
    user: SafeUser,
    documentId: string
  ) {
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

    const summary =
      await summaryRepository.findByDocument(
        documentId
      );

    if (!summary) {
      throw ApiError.notFound(
        "Summary not found",
        ERROR_CODES.SUMMARY_NOT_FOUND
      );
    }

    return summary;
  }
}

export const summaryService =
  new SummaryService();