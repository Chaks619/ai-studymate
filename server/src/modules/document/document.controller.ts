import type { Request, Response, NextFunction } from 'express';
import { documentService } from './document.service.js';
import type { IdParams, WorkspaceParams } from '../../shared/types/express.types.js';
import { assertObjectId } from '../../shared/utils/object-id.js';

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
        assertObjectId(req.params.workspaceId, 'workspace ID'),
        req.file
      );

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document,
      });
    } catch (error) {
      return next(error);
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
        assertObjectId(req.params.workspaceId, 'workspace ID')
      );

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      return next(error);
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

      const document = await documentService.getById(
        req.user,
        assertObjectId(req.params.id, 'document ID')
      );

      res.json({
        success: true,
        data: document,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const documentController = new DocumentController();
