import type { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service.js';
import { env } from '@/config/env.js';

export class AIController {
  async health(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const startedAt = Date.now();

      const result = await aiService.generate({
        prompt: 'Reply with exactly one word: pong',
      });

      res.status(200).json({
        success: true,
        message: 'GenAI service is reachable',
        data: {
          model: env.GEMINI_MODEL,
          latencyMs: Date.now() - startedAt,
          reply: result.text,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const prompt = req.body?.prompt;

      if (typeof prompt !== 'string' || prompt.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'A non-empty "prompt" string is required',
        });
        return;
      }

      const startedAt = Date.now();
      const result = await aiService.generate({ prompt });

      res.status(200).json({
        success: true,
        data: {
          model: env.GEMINI_MODEL,
          latencyMs: Date.now() - startedAt,
          text: result.text,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIController();
