import type { Request, Response, NextFunction } from 'express';
import { workspaceService } from './workspace.service.js';
import type { IdParams } from '@/shared/types/express.types.js';
import { logger } from '@/config/logger.js';

export class WorkspaceController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      logger.info("req.body:", req.body);

      const workspace = await workspaceService.createWorkspace(req.user, req.body);

      res.status(201).json({
        success: true,
        message: 'Workspace created successfully',
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const workspaces = await workspaceService.getMyWorkspaces(req.user);

      res.status(200).json({
        success: true,
        data: workspaces,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspace = await workspaceService.getWorkspace(req.params.id);

      res.status(200).json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspace = await workspaceService.updateWorkspace(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Workspace updated successfully',
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  async archive(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
    try {
      const workspace = await workspaceService.archiveWorkspace(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Workspace archived successfully',
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const workspaceController = new WorkspaceController();
