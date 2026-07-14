export function parseAiJson<T>(response: string): T {
  try {
    const cleaned = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON object found");
    }

    const json = cleaned.slice(start, end + 1);

    return JSON.parse(json) as T;
  } catch (error) {
    console.error("Failed to parse AI response:", response);

    throw new Error("AI returned an invalid JSON response");
  }
}