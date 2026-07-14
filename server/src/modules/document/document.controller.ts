import type { Request, Response, NextFunction } from 'express';
import { documentService } from './document.service.js';
import type { IdParams, WorkspaceParams } from '../../shared/types/express.types.js';

export class DocumentController {
  async upload(req: Request<WorkspaceParams>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });

        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });

        return;
      }

      const document = await documentService.uploadDocument(
        req.user,
        req.params.workspaceId,
        req.file
      );

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async getWorkspaceDocuments(req: Request<WorkspaceParams>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const documents = await documentService.getWorkspaceDocuments(
        req.user,
        req.params.workspaceId
      );

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request<IdParams>, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const document = await documentService.getById(req.user, req.params.id);

      res.json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();
