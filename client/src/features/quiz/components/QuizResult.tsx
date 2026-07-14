import { motion } from "framer-motion";
import { Check, RotateCcw, Trophy, X } from "lucide-react";

import type { Quiz } from "@/services/api/quiz.api";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudyPanel } from "@/components/common/StudyPanel";

interface Props {
  quiz: Quiz;
  score: number;
  selectedAnswers: Record<number, string>;
  onRetake: () => void;
  actions?: React.ReactNode;
}

function verdictFor(percentage: number) {
  if (percentage >= 80) {
    return { title: "Excellent work", note: "You've got a strong grip on this material." };
  }

  if (percentage >= 50) {
    return { title: "Good effort", note: "Solid start — review the misses and go again." };
  }

  return { title: "Keep going", note: "Worth another pass through the summary and flashcards." };
}

export function QuizResult({
  quiz,
  score,
  selectedAnswers,
  onRetake,
  actions,
}: Props) {
  const questions = quiz.questions ?? [];
  const total = questions.length;

  const percentage = total ? Math.round((score / total) * 100) : 0;
  const incorrect = total - score;
  const verdict = verdictFor(percentage);

  return (
    <StudyPanel
      icon={Trophy}
      title="Quiz results"
      description={`Scored ${score} of ${total}`}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Score */}
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Trophy className="size-6" />
          </span>

          <h3 className="mt-4 font-heading text-lg font-semibold tracking-tight text-foreground">
            {verdict.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">{verdict.note}</p>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="tabular mt-6 font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl"
          >
            {percentage}
            <span className="text-2xl text-muted-foreground sm:text-3xl">%</span>
          </motion.p>

          <div className="mt-5 h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </div>

          {/* Correct / incorrect are marked with icons as well as colour. */}
          <div className="mt-5 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success">
              <Check className="size-3.5" />
              <span className="tabular">{score}</span> correct
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive">
              <X className="size-3.5" />
              <span className="tabular">{incorrect}</span> incorrect
            </span>
          </div>

          <Button size="lg" className="mt-6" onClick={onRetake}>
            <RotateCcw />
            Retake quiz
          </Button>
        </div>

        {/* Review */}
        <div className="space-y-3 border-t border-border/60 pt-6">
          <h4 className="font-heading text-sm font-semibold tracking-tight text-foreground">
            Review answers
          </h4>

          <ul className="space-y-2.5">
            {questions.map((question, index) => {
              const answer = selectedAnswers[index];
              const isCorrect = answer === question.correctAnswer;

              return (
                <li
                  key={index}
                  className={cn(
                    "rounded-xl border p-4",
                    isCorrect
                      ? "border-success/25 bg-success/4"
                      : "border-destructive/25 bg-destructive/4"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white",
                        isCorrect ? "bg-success" : "bg-destructive"
                      )}
                    >
                      {isCorrect ? (
                        <Check className="size-3" strokeWidth={3} />
                      ) : (
                        <X className="size-3" strokeWidth={3} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        <span className="tabular text-muted-foreground">
                          {index + 1}.
                        </span>{" "}
                        {question.question}
                      </p>

                      <div className="space-y-1 text-sm">
                        <p
                          className={cn(
                            isCorrect ? "text-success" : "text-destructive"
                          )}
                        >
                          <span className="text-muted-foreground">
                            Your answer:{" "}
                          </span>
                          {answer ?? "Not answered"}
                        </p>

                        {/* Only show the correct answer when they got it wrong. */}
                        {!isCorrect ? (
                          <p className="text-success">
                            <span className="text-muted-foreground">
                              Correct answer:{" "}
                            </span>
                            {question.correctAnswer}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </StudyPanel>
  );
}
