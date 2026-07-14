import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";

import { flashcardController } from "./flashcard.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/:documentId/flashcards",
  flashcardController.generate.bind(
    flashcardController
  )
);

router.get(
  "/:documentId/flashcards",
  flashcardController.get.bind(
    flashcardController
  )
);

export default router;