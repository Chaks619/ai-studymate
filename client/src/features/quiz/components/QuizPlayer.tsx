import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react";

import type { Quiz } from "@/services/api/quiz.api";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudyPanel } from "@/components/common/StudyPanel";

import { QuizResult } from "./QuizResult";

interface Props {
  quiz: Quiz;
  actions?: React.ReactNode;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizPlayer({ quiz, actions }: Props) {
  const questions = quiz.questions ?? [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );
  const [mode, setMode] = useState<"playing" | "result">("playing");

  // Which way the question slides — forward or back.
  const [direction, setDirection] = useState(1);

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          selectedAnswers[index] === question.correctAnswer ? total + 1 : total,
        0
      ),
    [questions, selectedAnswers]
  );

  if (mode === "result") {
    return (
      <QuizResult
        quiz={quiz}
        score={score}
        selectedAnswers={selectedAnswers}
        actions={actions}
        onRetake={() => {
          setCurrentQuestion(0);
          setSelectedAnswers({});
          setDirection(1);
          setMode("playing");
        }}
      />
    );
  }

  const question = questions[currentQuestion];

  if (!question) return null;

  const total = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isLast = currentQuestion === total - 1;
  const selected = selectedAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / total) * 100;

  function goTo(next: number) {
    if (next < 0 || next > total - 1) return;

    setDirection(next > currentQuestion ? 1 : -1);
    setCurrentQuestion(next);
  }

  return (
    <StudyPanel
      icon={ListChecks}
      title="Quiz"
      description={`${answeredCount} of ${total} answered`}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">
              Question{" "}
              <span className="tabular text-foreground">
                {currentQuestion + 1}
              </span>{" "}
              of <span className="tabular">{total}</span>
            </span>

            <span className="tabular text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-5"
          >
            <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight text-balance text-foreground sm:text-xl">
              {question.question}
            </h3>

            <div
              role="radiogroup"
              aria-label={`Question ${currentQuestion + 1}`}
              className="space-y-2.5"
            >
              {question.options.map((option, optionIndex) => {
                const isSelected = selected === option;

                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      setSelectedAnswers({
                        ...selectedAnswers,
                        [currentQuestion]: option,
                      })
                    }
                    className={cn(
                      "group flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left text-sm transition-all sm:p-4",
                      "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                      isSelected
                        ? "border-primary bg-primary/[0.06] ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-muted/60"
                    )}
                  >
                    {/* Letter chip doubles as the radio indicator. */}
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {OPTION_LETTERS[optionIndex] ?? optionIndex + 1}
                    </span>

                    <span
                      className={cn(
                        "leading-relaxed",
                        isSelected
                          ? "font-medium text-foreground"
                          : "text-foreground/80"
                      )}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-5">
          <Button
            variant="outline"
            size="lg"
            disabled={currentQuestion === 0}
            onClick={() => goTo(currentQuestion - 1)}
          >
            <ChevronLeft />
            Previous
          </Button>

          {isLast ? (
            <Button
              size="lg"
              disabled={answeredCount !== total}
              onClick={() => setMode("result")}
            >
              {answeredCount !== total
                ? `${total - answeredCount} left`
                : "Submit quiz"}
            </Button>
          ) : (
            <Button
              size="lg"
              disabled={!selected}
              onClick={() => goTo(currentQuestion + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </StudyPanel>
  );
}
