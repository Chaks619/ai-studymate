import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";
import { summaryController } from "./summary.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/:documentId/summary",summaryController.get.bind(summaryController));

router.post("/:documentId/summary",summaryController.generate.bind(summaryController));

export default router;