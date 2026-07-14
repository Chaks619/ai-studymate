import { toast } from "sonner";

import { usePreferences } from "@/features/settings/hooks/usePreferences";
import { useGenerateFlashcardsMutation } from "@/services/api/flashcard.api";
import { useGenerateQuizMutation } from "@/services/api/quiz.api";
import { useGenerateSummaryMutation } from "@/services/api/summary.api";
import type { Document } from "@/types/api/document.types";

/**
 * Runs whatever the user switched on under Study preferences → Auto-generate,
 * once a freshly uploaded document is ready.
 *
 * Sequential on purpose: three generations fired at once is three concurrent
 * Gemini calls per upload, and the first failure shouldn't take the rest down
 * with it. Each step reports its own outcome, so a failed quiz still leaves
 * you with the summary.
 */
export function useAutoGenerate() {
  const { preferences } = usePreferences();

  const [generateSummary] = useGenerateSummaryMutation();
  const [generateFlashcards] = useGenerateFlashcardsMutation();
  const [generateQuiz] = useGenerateQuizMutation();

  return async function autoGenerate(document: Document): Promise<void> {
    if (document.processing?.status !== "READY") {
      return;
    }

    const { autoGenerate: enabled } = preferences;

    const tasks: { label: string; run: () => Promise<unknown> }[] = [];

    if (enabled.summary) {
      tasks.push({
        label: "Summary",
        run: () => generateSummary(document.id).unwrap(),
      });
    }

    if (enabled.flashcards) {
      tasks.push({
        label: "Flashcards",
        run: () =>
          generateFlashcards({
            documentId: document.id,
            body: { cardCount: preferences.flashcardCount },
          }).unwrap(),
      });
    }

    if (enabled.quiz) {
      tasks.push({
        label: "Quiz",
        run: () =>
          generateQuiz({
            documentId: document.id,
            body: {
              questionCount: preferences.quizQuestionCount,
              difficulty: preferences.quizDifficulty,
            },
          }).unwrap(),
      });
    }

    if (tasks.length === 0) {
      return;
    }

    toast.info("Preparing your study material…", {
      description: tasks.map((task) => task.label).join(", "),
    });

    for (const task of tasks) {
      try {
        await task.run();

        toast.success(`${task.label} ready`);
      } catch {
        toast.error(`Couldn't auto-generate the ${task.label.toLowerCase()}`);
      }
    }
  };
}
