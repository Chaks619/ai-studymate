import { Layers } from "lucide-react";
import { toast } from "sonner";

import {
  useGenerateFlashcardsMutation,
  useGetFlashcardsQuery,
} from "@/services/api/flashcard.api";
import {
  StudyPanel,
  StudyPanelEmpty,
  StudyPanelSkeleton,
} from "@/components/common/StudyPanel";
import { Skeleton } from "@/components/ui/skeleton";

import { GenerateFlashcardsDialog } from "./GenerateFlashcardDialog";
import { FlashcardViewer } from "./FlashcardViewer";

interface Props {
  documentId: string;
}

export function FlashcardSection({ documentId }: Props) {
  const { data: flashcards, isLoading, isError } = useGetFlashcardsQuery(documentId);

  const [generateFlashcards] = useGenerateFlashcardsMutation();

  async function handleGenerate(cardCount: number) {
    try {
      await generateFlashcards({
        documentId,
        body: { cardCount },
      }).unwrap();

      toast.success(`${cardCount} flashcards ready`);
    } catch {
      toast.error("Couldn't generate flashcards. Please try again.");

      throw new Error("generation failed");
    }
  }

  if (isLoading) {
    return (
      <StudyPanelSkeleton>
        <div className="space-y-5">
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-76 w-full rounded-2xl sm:h-68" />

          <div className="flex justify-between">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </StudyPanelSkeleton>
    );
  }

  const cards = flashcards?.cards ?? [];

  if (isError || !flashcards || cards.length === 0) {
    return (
      <StudyPanel
        icon={Layers}
        title="Flashcards"
        description="Active recall, one card at a time"
      >
        <StudyPanelEmpty
          icon={Layers}
          title="No flashcards yet"
          description="Turn this document into a deck of question-and-answer cards to test yourself on what actually matters."
          action={
            <GenerateFlashcardsDialog onGenerate={handleGenerate} />
          }
        />
      </StudyPanel>
    );
  }

  return (
    <FlashcardViewer
      flashcards={flashcards}
      actions={
        <GenerateFlashcardsDialog
          onGenerate={handleGenerate}
          triggerLabel="Regenerate"
          triggerVariant="outline"
        />
      }
    />
  );
}
