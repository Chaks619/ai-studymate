import { useEffect, useState } from "react";
import { Circle, RefreshCw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Cell = "X" | "O" | null;
type Difficulty = "easy" | "hard";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY: Cell[] = Array(9).fill(null);

function winningLine(board: Cell[]): number[] | null {
  for (const line of LINES) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }

  return null;
}

// AI is "O" (maximizing). Player is "X".
function minimax(board: Cell[], aiToMove: boolean): number {
  const line = winningLine(board);

  if (line) {
    return board[line[0]] === "O" ? 1 : -1;
  }

  if (board.every(Boolean)) {
    return 0;
  }

  const scores: number[] = [];

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = aiToMove ? "O" : "X";
      scores.push(minimax(board, !aiToMove));
      board[i] = null;
    }
  }

  return aiToMove ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(board: Cell[]): number {
  let best = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;

      if (score > best) {
        best = score;
        move = i;
      }
    }
  }

  return move;
}

function randomMove(board: Cell[]): number {
  const empty = board
    .map((cell, index) => (cell ? -1 : index))
    .filter((index) => index >= 0);

  return empty[Math.floor(Math.random() * empty.length)] ?? -1;
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(EMPTY);
  const [difficulty, setDifficulty] =
    useState<Difficulty>("hard");

  const line = winningLine(board);
  const winner = line ? board[line[0]] : null;
  const full = board.every(Boolean);
  const over = !!winner || full;

  const xCount = board.filter((c) => c === "X").length;
  const oCount = board.filter((c) => c === "O").length;
  const playerTurn = !over && xCount === oCount;

  // AI takes its turn whenever the counts say it's O to move.
  useEffect(() => {
    if (over || xCount === oCount) {
      return;
    }

    const id = window.setTimeout(() => {
      setBoard((current) => {
        const next = [...current];
        const move =
          difficulty === "hard"
            ? bestMove(next)
            : randomMove(next);

        if (move >= 0) {
          next[move] = "O";
        }

        return next;
      });
    }, 450);

    return () => window.clearTimeout(id);
  }, [board, over, xCount, oCount, difficulty]);

  function play(index: number) {
    if (!playerTurn || board[index]) {
      return;
    }

    setBoard((current) => {
      const next = [...current];
      next[index] = "X";
      return next;
    });
  }

  function reset() {
    setBoard(EMPTY);
  }

  const status = winner
    ? winner === "X"
      ? { text: "You win!", tone: "win" as const }
      : { text: "AI wins", tone: "lose" as const }
    : full
      ? { text: "Draw", tone: "muted" as const }
      : playerTurn
        ? { text: "Your move", tone: "muted" as const }
        : { text: "AI is thinking…", tone: "muted" as const };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="mx-auto w-full max-w-sm">
        <div className="grid aspect-square grid-cols-3 gap-2">
          {board.map((cell, index) => {
            const inWin = line?.includes(index);

            return (
              <button
                key={index}
                type="button"
                disabled={!playerTurn || !!cell}
                onClick={() => play(index)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-2xl bg-card shadow-sm ring-1 transition-colors",
                  inWin
                    ? "ring-primary bg-primary/5"
                    : "ring-foreground/[0.07]",
                  playerTurn && !cell
                    ? "cursor-pointer hover:bg-muted"
                    : "cursor-default"
                )}
              >
                {cell === "X" ? (
                  <X
                    className="size-1/2 text-primary"
                    strokeWidth={2.5}
                  />
                ) : cell === "O" ? (
                  <Circle
                    className="size-[45%] text-foreground/70"
                    strokeWidth={2.5}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium ring-1",
            status.tone === "win" &&
              "bg-success/10 text-success ring-success/20",
            status.tone === "lose" &&
              "bg-destructive/10 text-destructive ring-destructive/20",
            status.tone === "muted" &&
              "bg-card text-foreground ring-foreground/[0.07]"
          )}
        >
          {status.text}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Difficulty
          </p>

          <div className="flex rounded-lg bg-muted p-1">
            {(["easy", "hard"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setDifficulty(value);
                  reset();
                }}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                  difficulty === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            You are X and move first. Hard is unbeatable.
          </p>
        </div>

        <Button size="sm" className="w-full" onClick={reset}>
          <RefreshCw />
          New game
        </Button>
      </div>
    </div>
  );
}
