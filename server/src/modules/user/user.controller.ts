import type { NextFunction, Request, Response } from "express";

import { userService } from "./user.service.js";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updatePreferencesSchema,
  updateProfileSchema,
} from "./user.validation.js";

export class UserController {
  private getAuthenticatedUser(req: Request) {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    return req.user;
  }

  async updatePreferences(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = this.getAuthenticatedUser(req);

      const patch = updatePreferencesSchema.parse(req.body);

      const updated = await userService.updatePreferences(user, patch);

      res.status(200).json({
        success: true,
        message: "Preferences updated",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = this.getAuthenticatedUser(req);

      const data = updateProfileSchema.parse(req.body);

      const updated = await userService.updateProfile(user.id, data);

      res.status(200).json({
        success: true,
        message: "Profile updated",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = this.getAuthenticatedUser(req);

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "An image file is required",
        });

        return;
      }

      const updated = await userService.updateAvatar(user, req.file);

      res.status(200).json({
        success: true,
        message: "Profile picture updated",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = this.getAuthenticatedUser(req);

      const data = changePasswordSchema.parse(req.body);

      await userService.changePassword(user.id, data);

      // The refresh token was revoked, so this session's cookie is dead too.
      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: "Password changed. Please sign in again.",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = this.getAuthenticatedUser(req);

      const data = deleteAccountSchema.parse(req.body);

      await userService.deleteAccount(user.id, data.password);

      res.clearCookie("refreshToken");

      res.status(200).json({
        success: true,
        message: "Account deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
