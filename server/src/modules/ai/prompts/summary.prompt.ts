import { SUMMARY_LENGTH } from "@/modules/user/user.constants.js";
import type { UserPreferences } from "@/modules/user/user.mapper.js";

import {
  buildStudyDirectives,
  SUMMARY_LENGTH_DIRECTIVE,
} from "./preferences.prompt.js";

export const buildSummaryPrompt = (
  text: string,
  preferences: UserPreferences
) => {
  const lengthDirective =
    SUMMARY_LENGTH_DIRECTIVE[preferences.summaryLength] ??
    SUMMARY_LENGTH_DIRECTIVE[SUMMARY_LENGTH.MEDIUM];

  return `
You are an expert study assistant.

Create a study summary from the following study material.

${buildStudyDirectives(preferences)}

Length:

- ${lengthDirective}

Requirements:

- Use Markdown.
- Use headings and subheadings.
- Use bullet points.
- Explain difficult concepts simply.
- Preserve important definitions.
- Preserve important formulas.
- Include examples whenever useful.
- End with a short revision checklist.

Study Material:

${text}
`;
};
