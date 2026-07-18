import { Types } from "mongoose";

import { documentRepository } from "../document/document.repository.js";
import { DOCUMENT_STATUS } from "../document/document.constants.js";
import type { DocumentDocument } from "../document/document.model.js";

import { messageRepository } from "../message/message.repository.js";
import { MESSAGE_ROLE } from "../message/message.constants.js";
import {
  toSafeMessage,
  type SafeMessage,
} from "../message/message.mapper.js";

import { aiService } from "../ai/ai.service.js";
import { buildConversationPrompt } from "../ai/prompts/conversation.prompt.js";
import { buildConversationTitlePrompt } from "../ai/prompts/conversation-title.prompt.js";

import type { SafeUser } from "../user/user.mapper.js";

import { env } from "@/config/env.js";
import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";

import { conversationRepository } from "./conversation.repository.js";
import { toSafeConversation } from "./conversation.mapper.js";
import type { ConversationDocument } from "./conversation.model.js";

import {
  CONVERSATION_HISTORY_LIMIT,
  CONVERSATION_PREVIEW_LENGTH,
  CONVERSATION_TITLE,
} from "./conversation.constants.js";

import type { CreateConversationDto } from "./dto/create-conversation.dto.js";
import type { SendMessageDto } from "./dto/send-message.dto.js";

export class ConversationService {
  // ============================================
  // Helpers
  // ============================================

  private async getDocument(
    user: SafeUser,
    documentId: Types.ObjectId
  ) {
    const document = await documentRepository.findById(
      documentId,
      new Types.ObjectId(user.id)
    );

    if (!document) {
      throw ApiError.notFound(
        "Document not found",
        ERROR_CODES.DOCUMENT_NOT_FOUND
      );
    }

    return document;
  }

  /**
   * Named loadConversation rather than getConversation because the public
   * getConversation() below is part of the service's API surface.
   */
  private async loadConversation(
    conversationId: Types.ObjectId
  ) {
    const conversation =
      await conversationRepository.findById(
        conversationId
      );

    if (!conversation) {
      throw ApiError.notFound(
        "Conversation not found",
        ERROR_CODES.CONVERSATION_NOT_FOUND
      );
    }

    return conversation;
  }

  private verifyOwnership(
    conversation: ConversationDocument,
    user: SafeUser
  ) {
    // 404 rather than 403: a stranger's conversation id should be
    // indistinguishable from one that does not exist.
    if (conversation.owner.toString() !== user.id) {
      throw ApiError.notFound(
        "Conversation not found",
        ERROR_CODES.CONVERSATION_NOT_FOUND
      );
    }
  }

  private getDocumentText(
    document: Pick<
      DocumentDocument,
      "processing" | "extractedText"
    >
  ) {
    if (
      document.processing?.status !==
      DOCUMENT_STATUS.READY
    ) {
      throw ApiError.conflict(
        "Document is still processing",
        ERROR_CODES.DOCUMENT_NOT_READY
      );
    }

    if (!document.extractedText?.trim()) {
      throw ApiError.unprocessable(
        "Document contains no extracted text",
        ERROR_CODES.DOCUMENT_EMPTY
      );
    }

    return document.extractedText;
  }

  private buildPreview(content: string) {
    return content
      .trim()
      .slice(0, CONVERSATION_PREVIEW_LENGTH);
  }

  /**
   * Gemini is asked for a bare title but tends to wrap it in quotes or add a
   * trailing sentence, so only the first line survives.
   */
  private normalizeTitle(raw: string) {
    const title = raw
      .split("\n")[0]
      ?.trim()
      .replace(/^["']+|["']+$/g, "")
      .trim();

    if (!title) {
      return CONVERSATION_TITLE.DEFAULT;
    }

    return title.slice(
      0,
      CONVERSATION_TITLE.MAX_LENGTH
    );
  }

  // ============================================
  // Create Conversation
  // ============================================

  async createConversation(
    user: SafeUser,
    documentId: string,
    dto: CreateConversationDto
  ) {
    const document = await this.getDocument(
      user,
      new Types.ObjectId(documentId)
    );

    this.getDocumentText(document);

    const conversation =
      await conversationRepository.create({
        owner: new Types.ObjectId(user.id),

        document: document._id,

        title: CONVERSATION_TITLE.DEFAULT,
      });

    const { userMessage, assistantMessage } =
      await this.exchange(
        conversation,
        document,
        dto.message
      );

    const updated = await this.loadConversation(
      conversation._id
    );

    return {
      conversation: toSafeConversation(updated),

      messages: assistantMessage
        ? [userMessage, assistantMessage]
        : [userMessage],
    };
  }

  // ============================================
  // Read
  // ============================================

  async getDocumentConversations(
    user: SafeUser,
    documentId: string
  ) {
    const document = await this.getDocument(
      user,
      new Types.ObjectId(documentId)
    );

    const conversations =
      await conversationRepository.findByDocument(
        document._id,
        new Types.ObjectId(user.id)
      );

    return conversations.map(toSafeConversation);
  }

  async getConversation(
    user: SafeUser,
    conversationId: string
  ) {
    const conversation = await this.loadConversation(
      new Types.ObjectId(conversationId)
    );

    this.verifyOwnership(conversation, user);

    const messages =
      await messageRepository.findByConversation(
        conversation._id
      );

    return {
      conversation: toSafeConversation(conversation),

      messages: messages.map(toSafeMessage),
    };
  }

  // ============================================
  // Send Message
  // ============================================

  async sendMessage(
    user: SafeUser,
    conversationId: string,
    dto: SendMessageDto
  ) {
    // Unlike createConversation, this endpoint has nothing left to do once the
    // AI is switched off — the reply is the entire point of the request.
    if (!env.ENABLE_AI) {
      throw ApiError.unavailable(
        "AI features are currently disabled",
        ERROR_CODES.AI_DISABLED
      );
    }

    const conversation = await this.loadConversation(
      new Types.ObjectId(conversationId)
    );

    this.verifyOwnership(conversation, user);

    const document = await this.getDocument(
      user,
      conversation.document
    );

    const { assistantMessage } = await this.exchange(
      conversation,
      document,
      dto.message
    );

    const updated = await this.loadConversation(
      conversation._id
    );

    return {
      conversation: toSafeConversation(updated),

      message: assistantMessage,
    };
  }

  // ============================================
  // Regenerate last answer
  // ============================================

  async regenerateLastMessage(
    user: SafeUser,
    conversationId: string
  ) {
    if (!env.ENABLE_AI) {
      throw ApiError.unavailable(
        "AI features are currently disabled",
        ERROR_CODES.AI_DISABLED
      );
    }

    const conversation = await this.loadConversation(
      new Types.ObjectId(conversationId)
    );

    this.verifyOwnership(conversation, user);

    const document = await this.getDocument(
      user,
      conversation.document
    );

    const documentText =
      this.getDocumentText(document);

    const messages =
      await messageRepository.findByConversation(
        conversation._id
      );

    const lastAnswer = messages[messages.length - 1];
    const question = messages[messages.length - 2];

    // Regenerate replaces the most recent answer, so the thread must end in
    // assistant-after-user.
    if (
      !lastAnswer ||
      lastAnswer.role !== MESSAGE_ROLE.ASSISTANT ||
      !question ||
      question.role !== MESSAGE_ROLE.USER
    ) {
      throw ApiError.conflict(
        "There is no answer to regenerate",
        ERROR_CODES.CONVERSATION_NOTHING_TO_REGENERATE
      );
    }

    const history = messages
      .slice(0, messages.length - 2)
      .slice(-CONVERSATION_HISTORY_LIMIT)
      .map(toSafeMessage);

    const prompt = buildConversationPrompt(
      documentText,
      history,
      question.content
    );

    // Generate before deleting: a failed call must not lose the old answer.
    const aiResponse = await aiService.generate({
      prompt,
    });

    await messageRepository.deleteById(lastAnswer._id);

    const assistantMessage =
      await messageRepository.create({
        conversation: conversation._id,

        role: MESSAGE_ROLE.ASSISTANT,

        content: aiResponse.text,
      });

    // messageCount is unchanged — one answer removed, one added.
    await conversationRepository.update(
      conversation._id,
      {
        lastMessage: this.buildPreview(
          aiResponse.text
        ),
      }
    );

    const updated = await this.loadConversation(
      conversation._id
    );

    return {
      conversation: toSafeConversation(updated),

      message: toSafeMessage(assistantMessage),
    };
  }

  // ============================================
  // Delete
  // ============================================

  async deleteConversation(
    user: SafeUser,
    conversationId: string
  ) {
    const conversation = await this.loadConversation(
      new Types.ObjectId(conversationId)
    );

    this.verifyOwnership(conversation, user);

    await messageRepository.deleteByConversation(
      conversation._id
    );

    await conversationRepository.delete(
      conversation._id
    );
  }

  // ============================================
  // One user turn -> one assistant turn
  // ============================================

  /**
   * Shared by createConversation() and sendMessage() — the only difference
   * between the two is that one creates the conversation row first.
   */
  private async exchange(
    conversation: ConversationDocument,
    document: Pick<
      DocumentDocument,
      "processing" | "extractedText"
    >,
    message: string
  ) {
    const documentText =
      this.getDocumentText(document);

    // Persisted before the Gemini call so a failed generation never loses
    // what the user typed.
    const userMessage =
      await messageRepository.create({
        conversation: conversation._id,

        role: MESSAGE_ROLE.USER,

        content: message,
      });

    // ENABLE_AI=false leaves a real, inspectable conversation behind — just
    // without a reply — so the CRUD endpoints can be exercised on their own.
    if (!env.ENABLE_AI) {
      await conversationRepository.update(
        conversation._id,
        {
          lastMessage: this.buildPreview(message),

          messageCount: conversation.messageCount + 1,
        }
      );

      return {
        userMessage: toSafeMessage(userMessage),

        assistantMessage: null,
      };
    }

    const history = await this.getHistory(
      conversation._id,
      userMessage._id
    );

    const prompt = buildConversationPrompt(
      documentText,
      history,
      message
    );

    const aiResponse = await aiService.generate({
      prompt,
    });

    const assistantMessage =
      await messageRepository.create({
        conversation: conversation._id,

        role: MESSAGE_ROLE.ASSISTANT,

        content: aiResponse.text,
      });

    const title = await this.resolveTitle(
      conversation,
      message
    );

    await conversationRepository.update(
      conversation._id,
      {
        lastMessage: this.buildPreview(
          aiResponse.text
        ),

        messageCount: conversation.messageCount + 2,

        ...title,
      }
    );

    return {
      userMessage: toSafeMessage(userMessage),

      assistantMessage: toSafeMessage(
        assistantMessage
      ),
    };
  }

  /**
   * findRecentMessages sorts newest-first to get the *last* N rows; the prompt
   * needs them back in reading order.
   */
  private async getHistory(
    conversation: Types.ObjectId,
    excludeMessageId: Types.ObjectId
  ): Promise<SafeMessage[]> {
    const recent =
      await messageRepository.findRecentMessages(
        conversation,
        CONVERSATION_HISTORY_LIMIT + 1
      );

    return recent
      .reverse()
      .filter(
        (message) =>
          !excludeMessageId.equals(message._id)
      )
      .map((message) => ({
        id: message._id.toString(),

        conversation: message.conversation.toString(),

        role: message.role,

        content: message.content,

        createdAt: message.createdAt,

        updatedAt: message.updatedAt,
      }));
  }

  /**
   * Second AI call, once per conversation. Costs a round trip, so it is gated
   * on the flag rather than the title still reading "New Chat" — a user is
   * allowed to rename a chat back to that.
   */
  private async resolveTitle(
    conversation: ConversationDocument,
    firstUserMessage: string
  ) {
    if (conversation.titleGenerated) {
      return {};
    }

    const aiResponse = await aiService.generate({
      prompt: buildConversationTitlePrompt(
        firstUserMessage
      ),
    });

    return {
      title: this.normalizeTitle(aiResponse.text),

      titleGenerated: true,
    };
  }
}

export const conversationService =
  new ConversationService();
