import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../lib/jwt.js";
import { userRepository } from "@/modules/user/user.repository.js";
import { toSafeUser } from "@/modules/user/user.mapper.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        success: false,
        message: "Authorization header is missing",
      });
      return;
    }

    if (!authorization.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
      return;
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
      return;
    }

    const payload = verifyAccessToken(token);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = toSafeUser(user);

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};