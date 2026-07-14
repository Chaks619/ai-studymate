import { aiClient } from './ai.client.js';
import { AI_MAX_OUTPUT_TOKENS, AI_TEMPERATURE } from './ai.constants.js';
import { env } from '../../config/env.js';

import type { GenerateContentInput, GenerateContentResult } from './ai.types.js';

export class AIService {
  async generate(input: GenerateContentInput): Promise<GenerateContentResult> {
    const response = await aiClient.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: input.prompt,
      config: {
        temperature: AI_TEMPERATURE,
        maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
      },
    });

    return {
      text: response.text ?? '',
    };
  }
}

export const aiService = new AIService();
