import type { NextFunction, Request, Response } from "express";

import type { WorkspaceParams } from "@/shared/types/express.types.js";

import { summaryService } from "./summary.service.js";

export class SummaryController {
  private getWorkspaceId(req: Request<WorkspaceParams>): string {
    const workspaceId = req.params.workspaceId;

    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }

    return workspaceId;
  }

  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw new Error("Unauthorized Access");
    }

    return req.user;
  }

  async generate(
    req: Request<WorkspaceParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const workspaceId = this.getWorkspaceId(req);
      const user = this.getAuthenticatedUser(req);

      const summary = await summaryService.generateWorkspaceSummary(
        user,
        workspaceId
      );

      res.status(200).json({
        success: true,
        message: "Summary generated successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(
    req: Request<WorkspaceParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const workspaceId = this.getWorkspaceId(req);
      const user = this.getAuthenticatedUser(req);

      const summary = await summaryService.getWorkspaceSummary(
        user,
        workspaceId
      );

      res.status(200).json({
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