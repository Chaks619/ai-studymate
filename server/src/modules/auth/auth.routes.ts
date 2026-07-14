import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authMiddleware } from '@/shared/middlewares/auth.middleware.js';

console.log('✅ Auth Routes Loaded');

const router = Router();

router.post('/register', authController.register.bind(authController));

router.post('/login', authController.login.bind(authController));

router.post('/refresh', authController.refresh.bind(authController));

router.post('/logout', authMiddleware, authController.logout.bind(authController));

router.get('/me', authMiddleware, authController.me.bind(authController));

export default router;
