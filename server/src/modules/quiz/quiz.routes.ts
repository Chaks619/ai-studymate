import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";
import { quizController } from "./quiz.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/:documentId/quiz",
  quizController.generate.bind(
    quizController
  )
);

router.get(
  "/:documentId/quiz",
  quizController.get.bind(
    quizController
  )
);

export default router;