import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Difficulty = "easy" | "medium" | "hard";
type Phase = "idle" | "playing" | "done";

interface Problem {
  text: string;
  answer: number;
}

const DURATION = 60;

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function generate(difficulty: Difficulty): Problem {
  const ops =
    difficulty === "easy"
      ? ["+", "-"]
      : difficulty === "medium"
        ? ["+", "-", "×"]
        : ["+", "-", "×", "÷"];

  const op = ops[Math.floor(Math.random() * ops.length)];

  const addRange: [number, number] =
    difficulty === "easy"
      ? [1, 20]
      : difficulty === "medium"
        ? [1, 50]
        : [10, 99];

  const mulRange: [number, number] =
    difficulty === "hard" ? [2, 15] : [2, 12];

  if (op === "+") {
    const a = rand(...addRange);
    const b = rand(...addRange);
    return { text: `${a} + ${b}`, answer: a + b };
  }

  if (op === "-") {
    const a = rand(...addRange);
    const b = rand(1, a);
    return { text: `${a} − ${b}`, answer: a - b };
  }

  if (op === "×") {
    const a = rand(...mulRange);
    const b = rand(...mulRange);
    return { text: `${a} × ${b}`, answer: a * b };
  }

  // division that always divides evenly
  const b = rand(2, 12);
  const quotient = rand(2, 12);
  return { text: `${b * quotient} ÷ ${b}`, answer: quotient };
}

export function SpeedMathGame() {
  const [difficulty, setDifficulty] =
    useState<Difficulty>("medium");
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() =>
    Number(localStorage.getItem("speedmath-best") ?? 0)
  );
  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "playing") {
      return;
    }

    if (timeLeft <= 0) {
      setPhase("done");
      return;
    }

    const id = window.setTimeout(
      () => setTimeLeft((t) => t - 1),
      1000
    );

    return () => window.clearTimeout(id);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === "done" && score > best) {
      setBest(score);
      localStorage.setItem("speedmath-best", String(score));
    }
  }, [phase, score, best]);

  function start() {
    setScore(0);
    setTimeLeft(DURATION);
    setProblem(generate(difficulty));
    setInput("");
    setPhase("playing");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleInput(value: string) {
    setInput(value);

    if (
      value.trim() !== "" &&
      problem &&
      Number(value) === problem.answer
    ) {
      setScore((s) => s + 1);
      setProblem(generate(difficulty));
      setInput("");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-card px-6 py-16 shadow-sm ring-1 ring-foreground/[0.07]">
        {phase === "idle" ? (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                Solve as many as you can
              </p>
              <p className="text-sm text-muted-foreground">
                You have {DURATION} seconds. Correct answers
                advance automatically.
              </p>
            </div>

            <Button size="lg" onClick={start}>
              <Timer />
              Start
            </Button>
          </div>
        ) : phase === "playing" ? (
          <div className="w-full space-y-6 text-center">
            <p className="font-heading text-5xl font-semibold tracking-tight tabular-nums">
              {problem?.text}
            </p>

            <Input
              ref={inputRef}
              value={input}
              onChange={(event) =>
                handleInput(event.target.value)
              }
              inputMode="numeric"
              autoComplete="off"
              placeholder="?"
              aria-label="Your answer"
              className="mx-auto h-14 max-w-40 text-center text-2xl font-semibold"
            />
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Time's up
              </p>
              <p className="font-heading text-4xl font-semibold tabular-nums">
                {score}
              </p>
              <p className="text-sm text-muted-foreground">
                correct
              </p>
            </div>

            <Button size="lg" onClick={start}>
              <Timer />
              Play again
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <div
            className={cn(
              "rounded-xl bg-card p-3 text-center ring-1",
              phase === "playing" && timeLeft <= 10
                ? "ring-destructive/40"
                : "ring-foreground/[0.07]"
            )}
          >
            <p className="text-xs text-muted-foreground">
              Time
            </p>
            <p
              className={cn(
                "text-xl font-semibold tabular-nums",
                phase === "playing" &&
                  timeLeft <= 10 &&
                  "text-destructive"
              )}
            >
              {timeLeft}
            </p>
          </div>

          <div className="rounded-xl bg-card p-3 text-center ring-1 ring-foreground/[0.07]">
            <p className="text-xs text-muted-foreground">
              Score
            </p>
            <p className="text-xl font-semibold tabular-nums">
              {score}
            </p>
          </div>

          <div className="rounded-xl bg-card p-3 text-center ring-1 ring-foreground/[0.07]">
            <p className="text-xs text-muted-foreground">
              Best
            </p>
            <p className="text-xl font-semibold tabular-nums">
              {best}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Difficulty
          </p>

          <div className="flex rounded-lg bg-muted p-1">
            {(["easy", "medium", "hard"] as const).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  disabled={phase === "playing"}
                  onClick={() => setDifficulty(value)}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors disabled:opacity-50",
                    difficulty === value
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {value}
                </button>
              )
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {difficulty === "easy"
              ? "Addition and subtraction."
              : difficulty === "medium"
                ? "Adds multiplication."
                : "Adds division and bigger numbers."}
          </p>
        </div>
      </div>
    </div>
  );
}
