import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth.middleware.js";

import { conversationController } from "./conversation.controller.js";

/**
 * Mounted under /api/documents — conversations are always created and listed
 * in the context of the document they are about.
 */
export const documentConversationRoutes = Router();

documentConversationRoutes.use(authMiddleware);

documentConversationRoutes.post(
  "/:documentId/conversations",
  conversationController.create.bind(
    conversationController
  )
);

documentConversationRoutes.get(
  "/:documentId/conversations",
  conversationController.list.bind(
    conversationController
  )
);

/**
 * Mounted under /api/conversations — once a conversation exists it is
 * addressed by its own id, so the document is no longer part of the path.
 */
export const conversationRoutes = Router();

conversationRoutes.use(authMiddleware);

conversationRoutes.get(
  "/:conversationId",
  conversationController.get.bind(
    conversationController
  )
);

conversationRoutes.post(
  "/:conversationId/messages",
  conversationController.sendMessage.bind(
    conversationController
  )
);

conversationRoutes.post(
  "/:conversationId/regenerate",
  conversationController.regenerate.bind(
    conversationController
  )
);

conversationRoutes.delete(
  "/:conversationId",
  conversationController.remove.bind(
    conversationController
  )
);
