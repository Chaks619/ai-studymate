import type { NextFunction, Request, Response } from "express";

import type { DocumentParams } from "@/shared/types/express.types.js";

import { summaryService } from "./summary.service.js";

export class SummaryController {
  private getDocumentId(req: Request<DocumentParams>): string {
    const documentId = req.params.documentId;

    if (!documentId) {
      throw new Error("Document ID is required");
    }

    return documentId;
  }

  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw new Error("Unauthorized Access");
    }

    return req.user;
  }

  async generate(
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const documentId = this.getDocumentId(req);
      const user = this.getAuthenticatedUser(req);

      const summary = await summaryService.generateDocumentSummary(
        user,
        documentId
      );

      return res.status(200).json({
        success: true,
        message: "Summary generated successfully",
        data: summary,
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
      const documentId = this.getDocumentId(req);
      const user = this.getAuthenticatedUser(req);

      const summary = await summaryService.getDocumentSummary(
        user,
        documentId
      );

      return res.status(200).json({
        success: true,
        message: "Summary fetched successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const summaryController = new SummaryController();