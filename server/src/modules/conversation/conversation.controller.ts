import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  ConversationParams,
  DocumentParams,
} from "@/shared/types/express.types.js";

import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";
import { assertObjectId } from "@/shared/utils/object-id.js";

import { conversationService } from "./conversation.service.js";
import {
  createConversationSchema,
  sendMessageSchema,
} from "./conversation.validator.js";

export class ConversationController {
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

  private getConversationId(
    req: Request<ConversationParams>
  ) {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw ApiError.badRequest(
        "Conversation ID is required",
        ERROR_CODES.MISSING_PARAMETER
      );
    }

    return assertObjectId(
      conversationId,
      "conversation ID"
    );
  }

  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw ApiError.unauthorized("Unauthorized");
    }

    return req.user;
  }

  async create(
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const documentId =
        this.getDocumentId(req);

      const user =
        this.getAuthenticatedUser(req);

      const dto = createConversationSchema.parse(
        req.body ?? {}
      );

      const result =
        await conversationService.createConversation(
          user,
          documentId,
          dto
        );

      res.status(201).json({
        success: true,
        message:
          "Conversation created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const documentId =
        this.getDocumentId(req);

      const user =
        this.getAuthenticatedUser(req);

      const conversations =
        await conversationService.getDocumentConversations(
          user,
          documentId
        );

      res.status(200).json({
        success: true,
        message:
          "Conversations fetched successfully",
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(
    req: Request<ConversationParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const conversationId =
        this.getConversationId(req);

      const user =
        this.getAuthenticatedUser(req);

      const result =
        await conversationService.getConversation(
          user,
          conversationId
        );

      res.status(200).json({
        success: true,
        message:
          "Conversation fetched successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(
    req: Request<ConversationParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const conversationId =
        this.getConversationId(req);

      const user =
        this.getAuthenticatedUser(req);

      const dto = sendMessageSchema.parse(
        req.body ?? {}
      );

      const result =
        await conversationService.sendMessage(
          user,
          conversationId,
          dto
        );

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async regenerate(
    req: Request<ConversationParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const conversationId =
        this.getConversationId(req);

      const user =
        this.getAuthenticatedUser(req);

      const result =
        await conversationService.regenerateLastMessage(
          user,
          conversationId
        );

      res.status(200).json({
        success: true,
        message: "Answer regenerated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(
    req: Request<ConversationParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const conversationId =
        this.getConversationId(req);

      const user =
        this.getAuthenticatedUser(req);

      await conversationService.deleteConversation(
        user,
        conversationId
      );

      res.status(200).json({
        success: true,
        message:
          "Conversation deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const conversationController =
  new ConversationController();
