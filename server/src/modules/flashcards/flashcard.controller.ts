import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { DocumentParams } from "@/shared/types/express.types.js";

import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";
import { assertObjectId } from "@/shared/utils/object-id.js";

import { flashcardService } from "./flashcard.service.js";
import { generateFlashcardsSchema } from "./flashcard.validator.js";

export class FlashcardController {
  private getDocumentId(
    req: Request<DocumentParams>
  ) {
    const { documentId } = req.params;

    if (!documentId) {
      throw ApiError.badRequest(
        "Document ID is required",
        ERROR_CODES.MISSING_PARAMETER
      );
    }

    return assertObjectId(documentId, "document ID");
  }

  private getAuthenticatedUser(
    req: Request
  ) {
    if (!req.user) {
      throw ApiError.unauthorized("Unauthorized");
    }

    return req.user;
  }

  async generate(
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const documentId =
        this.getDocumentId(req);

      const user =
        this.getAuthenticatedUser(req);

      const dto = generateFlashcardsSchema.parse(
        req.body ?? {}
      );

      const flashcards =
        await flashcardService.generateDocumentFlashcards(
          user,
          documentId,
          dto
        );

      res.status(200).json({
        success: true,
        message:
          "Flashcards generated successfully",
        data: flashcards,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const documentId =
        this.getDocumentId(req);

      const user =
        this.getAuthenticatedUser(req);

      const flashcards =
        await flashcardService.getDocumentFlashcards(
          user,
          documentId
        );

      res.status(200).json({
        success: true,
        message:
          "Flashcards fetched successfully",
        data: flashcards,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const flashcardController =
  new FlashcardController();