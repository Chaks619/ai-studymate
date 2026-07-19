import { useEffect, useReducer, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Board = number[][];
type Dir = "L" | "R" | "U" | "D";

const SIZE = 4;

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () =>
    Array<number>(SIZE).fill(0)
  );
}

function spawn(board: Board): Board {
  const empties: [number, number][] = [];

  board.forEach((row, r) =>
    row.forEach((value, c) => {
      if (!value) empties.push([r, c]);
    })
  );

  if (!empties.length) {
    return board;
  }

  const [r, c] =
    empties[Math.floor(Math.random() * empties.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;

  return next;
}

function slideLine(line: number[]): {
  line: number[];
  gained: number;
} {
  const filtered = line.filter((v) => v !== 0);
  let gained = 0;

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      gained += filtered[i];
      filtered[i + 1] = 0;
      i++;
    }
  }

  const merged = filtered.filter((v) => v !== 0);
  while (merged.length < SIZE) merged.push(0);

  return { line: merged, gained };
}

function transpose(board: Board): Board {
  return board[0].map((_, c) => board.map((row) => row[c]));
}

function applyMove(
  board: Board,
  dir: Dir
): { board: Board; gained: number; changed: boolean } {
  const reverse = dir === "R" || dir === "D";
  const vertical = dir === "U" || dir === "D";

  let work = board.map((row) => [...row]);
  if (vertical) work = transpose(work);

  let gained = 0;

  work = work.map((line) => {
    const source = reverse ? [...line].reverse() : line;
    const { line: slid, gained: g } = slideLine(source);
    gained += g;
    return reverse ? slid.reverse() : slid;
  });

  if (vertical) work = transpose(work);

  const changed =
    JSON.stringify(work) !== JSON.stringify(board);

  return { board: work, gained, changed };
}

function canMove(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) return true;
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1])
        return true;
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c])
        return true;
    }
  }

  return false;
}

interface State {
  board: Board;
  score: number;
  won: boolean;
  over: boolean;
}

function init(): State {
  return {
    board: spawn(spawn(emptyBoard())),
    score: 0,
    won: false,
    over: false,
  };
}

type Action = { type: "move"; dir: Dir } | { type: "reset" };

function reducer(state: State, action: Action): State {
  if (action.type === "reset") {
    return init();
  }

  if (state.over) {
    return state;
  }

  const { board, gained, changed } = applyMove(
    state.board,
    action.dir
  );

  if (!changed) {
    return state;
  }

  const withNew = spawn(board);

  return {
    board: withNew,
    score: state.score + gained,
    won: state.won || withNew.some((row) => row.includes(2048)),
    over: !canMove(withNew),
  };
}

const TILE: Record<number, { bg: string; color: string }> = {
  2: { bg: "#eee4da", color: "#776e65" },
  4: { bg: "#ede0c8", color: "#776e65" },
  8: { bg: "#f2b179", color: "#f9f6f2" },
  16: { bg: "#f59563", color: "#f9f6f2" },
  32: { bg: "#f67c5f", color: "#f9f6f2" },
  64: { bg: "#f65e3b", color: "#f9f6f2" },
  128: { bg: "#edcf72", color: "#f9f6f2" },
  256: { bg: "#edcc61", color: "#f9f6f2" },
  512: { bg: "#edc850", color: "#f9f6f2" },
  1024: { bg: "#edc53f", color: "#f9f6f2" },
  2048: { bg: "#edc22e", color: "#f9f6f2" },
};

const KEY_MAP: Record<string, Dir> = {
  ArrowLeft: "L",
  ArrowRight: "R",
  ArrowUp: "U",
  ArrowDown: "D",
  a: "L",
  d: "R",
  w: "U",
  s: "D",
};

export function Game2048() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    init
  );

  const [best, setBest] = useState(() =>
    Number(localStorage.getItem("2048-best") ?? 0)
  );

  useEffect(() => {
    if (state.score > best) {
      setBest(state.score);
      localStorage.setItem("2048-best", String(state.score));
    }
  }, [state.score, best]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const dir = KEY_MAP[event.key];
      if (!dir) return;
      event.preventDefault();
      dispatch({ type: "move", dir });
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const DPadButton = ({
    dir,
    icon: Icon,
  }: {
    dir: Dir;
    icon: LucideIcon;
  }) => (
    <Button
      variant="outline"
      size="icon"
      onClick={() => dispatch({ type: "move", dir })}
    >
      <Icon />
    </Button>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="mx-auto w-full max-w-md">
        <div className="relative rounded-2xl bg-[#bbada0] p-3">
          <div className="grid grid-cols-4 gap-3">
            {state.board.flat().map((value, index) => {
              const digits = String(value).length;
              const tile = TILE[value] ?? {
                bg: "#3c3a32",
                color: "#f9f6f2",
              };

              return (
                <div
                  key={index}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg font-bold tabular-nums transition-colors",
                    digits >= 4
                      ? "text-lg sm:text-2xl"
                      : digits === 3
                        ? "text-xl sm:text-2xl"
                        : "text-2xl sm:text-3xl"
                  )}
                  style={
                    value
                      ? {
                          backgroundColor: tile.bg,
                          color: tile.color,
                        }
                      : {
                          backgroundColor:
                            "rgba(238,228,218,0.35)",
                        }
                  }
                >
                  {value || ""}
                </div>
              );
            })}
          </div>

          {state.over ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/70 backdrop-blur-[1px]">
              <p className="text-xl font-semibold">
                Game over
              </p>
              <Button
                size="sm"
                onClick={() => dispatch({ type: "reset" })}
              >
                <RefreshCw />
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-card p-3 text-center ring-1 ring-foreground/[0.07]">
            <p className="text-xs text-muted-foreground">
              Score
            </p>
            <p className="text-xl font-semibold tabular-nums">
              {state.score}
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

        {state.won && !state.over ? (
          <div className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success ring-1 ring-success/20">
            You reached 2048 — keep going!
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Move
          </p>

          <div className="mx-auto grid w-36 grid-cols-3 gap-2">
            <span />
            <DPadButton dir="U" icon={ArrowUp} />
            <span />
            <DPadButton dir="L" icon={ArrowLeft} />
            <DPadButton dir="D" icon={ArrowDown} />
            <DPadButton dir="R" icon={ArrowRight} />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            or use arrow keys / WASD
          </p>
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={() => dispatch({ type: "reset" })}
        >
          <RefreshCw />
          New game
        </Button>
      </div>
    </div>
  );
}
