import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
  RotateCw,
} from "lucide-react";

import type { Flashcard } from "@/services/api/flashcard.api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StudyPanel } from "@/components/common/StudyPanel";
import { pluralize } from "@/lib/format";

interface Props {
  flashcards: Flashcard;
  actions?: React.ReactNode;
}

type Difficulty = "easy" | "medium" | "hard";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive",
};

function DifficultyBadge({ difficulty }: { difficulty?: Difficulty }) {
  if (!difficulty) return null;

  return (
    <Badge
      variant="ghost"
      className={cn("capitalize", difficultyStyles[difficulty])}
    >
      {difficulty}
    </Badge>
  );
}

/** A single face of the card. Both faces are stacked and rotated in 3D. */
function CardFace({
  label,
  text,
  className,
  children,
}: {
  label: string;
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-10 text-center backface-hidden sm:px-10",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </span>

        {children}
      </div>

      <p className="max-w-xl text-lg leading-relaxed text-balance text-foreground sm:text-xl">
        {text}
      </p>
    </div>
  );
}

export function FlashcardViewer({ flashcards, actions }: Props) {
  const cards = flashcards.cards ?? [];
  const total = cards.length;

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next > total - 1) return;

      // Reset to the question side first so the next card never opens
      // mid-flip showing its answer.
      setFlipped(false);
      setIndex(next);
    },
    [total]
  );

  const flip = useCallback(() => setFlipped((value) => !value), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Don't hijack keys while the user is typing somewhere.
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        flip();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, goTo, flip]);

  if (!card) return null;

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const progress = ((index + 1) / total) * 100;

  return (
    <StudyPanel
      icon={Layers}
      title="Flashcards"
      description={pluralize(total, "card")}
      actions={actions}
    >
      <div className="space-y-5">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">
              Card <span className="tabular text-foreground">{index + 1}</span>{" "}
              of <span className="tabular">{total}</span>
            </span>

            <DifficultyBadge difficulty={card.difficulty} />
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

        {/* Card */}
        <div className="perspective-[1400px]">
          <motion.button
            type="button"
            onClick={flip}
            aria-label={flipped ? "Show question" : "Show answer"}
            className="relative block h-76 w-full cursor-pointer rounded-2xl text-left transform-3d focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:h-68"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CardFace label="Question" text={card.question} />

            <CardFace
              label="Answer"
              text={card.answer}
              className="rotate-y-180 bg-primary/4 ring-1 ring-primary/20"
            />
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            disabled={isFirst}
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft />
            <span className="max-sm:sr-only">Previous</span>
          </Button>

          <Button variant="secondary" size="lg" onClick={flip}>
            <RotateCw />
            {flipped ? "Show question" : "Show answer"}
          </Button>

          {isLast ? (
            <Button variant="outline" size="lg" onClick={() => goTo(0)}>
              <RotateCcw />
              <span className="max-sm:sr-only">Restart</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={() => goTo(index + 1)}
            >
              <span className="max-sm:sr-only">Next</span>
              <ChevronRight />
            </Button>
          )}
        </div>

        {/* Keyboard hints — desktop only, where they're actually usable. */}
        <p className="hidden items-center justify-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <span>to navigate</span>
          <span aria-hidden className="px-1 text-border">•</span>
          <Kbd>Space</Kbd>
          <span>to flip</span>
        </p>
      </div>
    </StudyPanel>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-sans text-[0.6875rem] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}
