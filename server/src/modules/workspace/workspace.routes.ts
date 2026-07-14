import { Router } from 'express';

import { workspaceController } from './workspace.controller.js';
import { documentController } from '../document/document.controller.js';
import { authMiddleware } from '@/shared/middlewares/auth.middleware.js';
import { upload } from '@/shared/middlewares/upload.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', workspaceController.create.bind(workspaceController));

router.get('/', workspaceController.getMyWorkspaces.bind(workspaceController));

router.get('/:id', workspaceController.getById.bind(workspaceController));

router.patch('/:id', workspaceController.update.bind(workspaceController));

router.delete('/:id', workspaceController.archive.bind(workspaceController));

router.post('/:workspaceId/documents', upload.single('file'), documentController.upload.bind(documentController));

router.get("/:workspaceId/documents", documentController.getWorkspaceDocuments.bind(documentController));

// router.get('/:workspaceId/summary', (req, res, next) => summaryController.get(req, res, next));

// router.post('/:workspaceId/summary', (req, res, next) => summaryController.generate(req, res, next));

export default router;
