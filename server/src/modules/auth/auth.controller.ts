import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { registerSchema } from './validators/register.validator.js';
import { loginSchema } from './auth.validation.js';
import { refreshCookieOptions } from './auth.cookies.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);

      const user = await authService.register(data);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = loginSchema.parse(req.body);

      const result = await authService.login(data);

      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies['refreshToken'];

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: 'Refresh token missing',
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);

      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });

        return;
      }

      await authService.logout(req.user.id);

      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await authService.me(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
