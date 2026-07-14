import { Router } from 'express';

import { aiController } from './ai.controller.js';

const router = Router();

router.get('/health', aiController.health.bind(aiController));
router.post('/generate', aiController.generate.bind(aiController));

export default router;
