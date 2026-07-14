import { Types } from 'mongoose';

import { workspaceRepository } from '../workspace/workspace.repository.js';
import { documentRepository } from '../document/document.repository.js';

import { aiService } from '../ai/ai.service.js';
import { buildSummaryPrompt } from '../ai/prompts/summary.prompt.js';

import { summaryRepository } from './summary.repository.js';
import { SUMMARY_STATUS } from './summary.constants.js';

import { env } from '../../config/env.js';
import type { SafeUser } from '../user/user.mapper.js';
import { DOCUMENT_STATUS } from '../document/document.constants.js';

export class SummaryService {
  async generateWorkspaceSummary(user: SafeUser, workspaceId: string) {
    // ============================================
    // Verify workspace ownership
    // ============================================

    const workspace = await workspaceRepository.findByIdAndOwner(workspaceId, user.id);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // ============================================
    // Load workspace documents
    // ============================================

    const documents = await documentRepository.findByWorkspace(workspaceId);

    const readyDocuments = documents.filter(
      (doc) =>
        doc.processing?.status === DOCUMENT_STATUS.READY && doc.extractedText.trim().length > 0
    );

    if (readyDocuments.length === 0) {
      throw new Error('No processed documents found');
    }

    // ============================================
    // Merge extracted text
    // ============================================

    const combinedText = readyDocuments.map((doc) => doc.extractedText).join('\n\n');

    // ============================================
    // Build AI Prompt
    // ============================================

    const prompt = buildSummaryPrompt(combinedText);

    // ============================================
    // Generate Summary
    // ============================================

    const startedAt = Date.now();

    const aiResponse = await aiService.generate({
      prompt,
    });

    const generationTimeMs = Date.now() - startedAt;

    // ============================================
    // Save Summary
    // ============================================

    const existingSummary = await summaryRepository.findByWorkspace(workspaceId);

    if (!existingSummary) {
      return await summaryRepository.create({
        workspace: new Types.ObjectId(workspaceId),
        content: aiResponse.text,
        status: SUMMARY_STATUS.READY,
        model: env.GEMINI_MODEL,
        generationTimeMs,
      });
    }

    return await summaryRepository.updateByWorkspace(workspaceId, {
      content: aiResponse.text,
      status: SUMMARY_STATUS.READY,
      model: env.GEMINI_MODEL,
      generationTimeMs,
    });
  }

  async getWorkspaceSummary(user: SafeUser, workspaceId: string) {
    const workspace = await workspaceRepository.findByIdAndOwner(workspaceId, user.id);

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const summary = await summaryRepository.findByWorkspace(workspaceId);

    if (!summary) {
      throw new Error('Summary not found');
    }

    return summary;
  }
}

export const summaryService = new SummaryService();
