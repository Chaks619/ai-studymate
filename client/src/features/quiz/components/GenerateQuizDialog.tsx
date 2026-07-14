import { useState } from "react";
import { ListChecks, RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/usePreferences";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Difficulty = "easy" | "medium" | "hard" | "mixed";

interface Props {
  onGenerate: (
    questionCount: number,
    difficulty: Difficulty
  ) => Promise<unknown>;
  triggerLabel?: string;
  triggerVariant?: "default" | "outline";
}

const QUESTION_OPTIONS = [5, 10, 15, 20, 25];

const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: "easy", label: "Easy", hint: "Recall the basics" },
  { value: "medium", label: "Medium", hint: "Apply the concepts" },
  { value: "hard", label: "Hard", hint: "Reason it through" },
  { value: "mixed", label: "Mixed", hint: "A bit of everything" },
];

export function GenerateQuizDialog({
  onGenerate,
  triggerLabel = "Generate quiz",
  triggerVariant = "default",
}: Props) {
  const { preferences } = usePreferences();

  const [questionCount, setQuestionCount] = useState(
    preferences.quizQuestionCount
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    preferences.quizDifficulty
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    // Re-seed from the saved defaults each time the dialog opens, so a
    // one-off override here doesn't quietly become the new default.
    if (next) {
      setQuestionCount(preferences.quizQuestionCount);
      setDifficulty(preferences.quizDifficulty);
    }

    setOpen(next);
  }

  async function handleGenerate() {
    try {
      setLoading(true);

      await onGenerate(questionCount, difficulty);

      // Only dismiss on success — on failure the dialog stays open so the
      // user can retry without re-picking their options.
      setOpen(false);
    } catch {
      /* the caller surfaces the error */
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant={triggerVariant}
            size={triggerVariant === "outline" ? "sm" : "lg"}
          >
            {triggerVariant === "outline" ? <RefreshCw /> : <ListChecks />}
            {triggerLabel}
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate quiz</DialogTitle>

          <DialogDescription>
            Choose the length and difficulty of your quiz.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Number of questions
            </p>

            <div className="grid grid-cols-5 gap-2">
              {QUESTION_OPTIONS.map((count) => {
                const selected = questionCount === count;

                return (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setQuestionCount(count)}
                    className={cn(
                      "tabular flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Difficulty</p>

            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTIES.map((level) => {
                const selected = difficulty === level.value;

                return (
                  <button
                    key={level.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setDifficulty(level.value)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left transition-all",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "block text-sm font-medium",
                        selected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {level.label}
                    </span>

                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {level.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button size="lg" disabled={loading} onClick={handleGenerate}>
            {loading ? (
              <>
                <RefreshCw className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles />
                Generate {questionCount} questions
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
