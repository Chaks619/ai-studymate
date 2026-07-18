import type { Request, Response, NextFunction } from 'express';
import { workspaceService } from './workspace.service.js';
import type { IdParams } from '@/shared/types/express.types.js';
import { logger } from '@/config/logger.js';
import { assertObjectId } from '@/shared/utils/object-id.js';
import { ApiError } from '@/shared/errors/index.js';

export class WorkspaceController {
  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw ApiError.unauthorized('Unauthorized');
    }

    return req.user;
  }

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
      const user = this.getAuthenticatedUser(req);

      const workspace = await workspaceService.getWorkspace(
        user,
        assertObjectId(req.params.id, 'workspace ID')
      );

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
      const user = this.getAuthenticatedUser(req);

      const workspace = await workspaceService.updateWorkspace(
        user,
        assertObjectId(req.params.id, 'workspace ID'),
        req.body
      );

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
      const user = this.getAuthenticatedUser(req);

      const workspace = await workspaceService.archiveWorkspace(
        user,
        assertObjectId(req.params.id, 'workspace ID')
      );

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
