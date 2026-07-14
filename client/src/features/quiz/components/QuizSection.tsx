import { ListChecks } from "lucide-react";
import { toast } from "sonner";

import {
  useGenerateQuizMutation,
  useGetQuizQuery,
} from "@/services/api/quiz.api";
import {
  StudyPanel,
  StudyPanelEmpty,
  StudyPanelSkeleton,
} from "@/components/common/StudyPanel";
import { Skeleton } from "@/components/ui/skeleton";

import { GenerateQuizDialog } from "./GenerateQuizDialog";
import { QuizPlayer } from "./QuizPlayer";

interface Props {
  documentId: string;
}

export function QuizSection({ documentId }: Props) {
  const { data: quiz, isLoading, isError } = useGetQuizQuery(documentId);

  const [generateQuiz] = useGenerateQuizMutation();

  async function handleGenerate(
    questionCount: number,
    difficulty: "easy" | "medium" | "hard" | "mixed"
  ) {
    try {
      await generateQuiz({
        documentId,
        body: { questionCount, difficulty },
      }).unwrap();

      toast.success(`${questionCount}-question quiz ready`);
    } catch {
      toast.error("Couldn't generate the quiz. Please try again.");

      throw new Error("generation failed");
    }
  }

  if (isLoading) {
    return (
      <StudyPanelSkeleton>
        <div className="space-y-6">
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-6 w-3/4 max-w-md" />

          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </StudyPanelSkeleton>
    );
  }

  const questions = quiz?.questions ?? [];

  if (isError || !quiz || questions.length === 0) {
    return (
      <StudyPanel
        icon={ListChecks}
        title="Quiz"
        description="Test yourself against this document"
      >
        <StudyPanelEmpty
          icon={ListChecks}
          title="No quiz yet"
          description="Generate a multiple-choice quiz to find out what's actually stuck — and what needs another look."
          action={<GenerateQuizDialog onGenerate={handleGenerate} />}
        />
      </StudyPanel>
    );
  }

  return (
    <QuizPlayer
      quiz={quiz}
      actions={
        <GenerateQuizDialog
          onGenerate={handleGenerate}
          triggerLabel="New quiz"
          triggerVariant="outline"
        />
      }
    />
  );
}
