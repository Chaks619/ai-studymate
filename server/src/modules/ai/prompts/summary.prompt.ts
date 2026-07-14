export const buildSummaryPrompt = (text: string) => `
You are an expert study assistant.

Create a comprehensive study summary from the following study material.

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
