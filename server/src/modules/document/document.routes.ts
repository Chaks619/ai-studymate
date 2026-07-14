import { Router } from "express";

import { documentController } from "./document.controller.js";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/:id",
  documentController.getById.bind(documentController)
);

export default router;