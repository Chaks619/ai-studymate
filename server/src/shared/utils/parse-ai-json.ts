import { ApiError, ERROR_CODES } from "../errors/index.js";

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
  } catch {
    console.error("Failed to parse AI response:", response);

    // 502, not 500: the request was fine and our handling was fine — the
    // upstream model returned something we cannot use.
    throw ApiError.badGateway(
      "AI returned an invalid response",
      ERROR_CODES.AI_INVALID_RESPONSE
    );
  }
}
