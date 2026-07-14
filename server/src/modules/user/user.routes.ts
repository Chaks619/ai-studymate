import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";
import { uploadImage } from "@/shared/middlewares/upload.middleware.js";

import { userController } from "./user.controller.js";

const router = Router();

router.use(authMiddleware);

router.patch(
  "/me/preferences",
  userController.updatePreferences.bind(userController)
);

router.patch("/me", userController.updateProfile.bind(userController));

router.patch(
  "/me/avatar",
  uploadImage.single("avatar"),
  userController.updateAvatar.bind(userController)
);

router.post(
  "/me/password",
  userController.changePassword.bind(userController)
);

router.delete("/me", userController.deleteAccount.bind(userController));

export default router;
