import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Owner = "player" | "ai";
type Mode = "solo" | "ai";
type Difficulty = "easy" | "medium" | "hard";

interface Card {
  id: number;
  face: string;
  matched: Owner | null;
}

const FACES = [
  "📚",
  "🧠",
  "💡",
  "🔬",
  "🎓",
  "✏️",
  "🌍",
  "⏰",
  "🎯",
  "🧪",
  "📝",
  "🔭",
];

const SIZE_OPTIONS = [
  { tiles: 12, pairs: 6, cols: 4 },
  { tiles: 16, pairs: 8, cols: 4 },
  { tiles: 24, pairs: 12, cols: 6 },
];

const MEMORY_STRENGTH: Record<Difficulty, number> = {
  easy: 0.5,
  medium: 0.78,
  hard: 1,
};

function makeDeck(pairs: number): Card[] {
  const cards = FACES.slice(0, pairs).flatMap((face, pair) => [
    { id: pair * 2, face, matched: null },
    { id: pair * 2 + 1, face, matched: null },
  ]);

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

const pick = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

function decideAiMove(
  cards: Card[],
  memory: Map<number, string>
): [number, number] | null {
  const available = cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => !card.matched);

  if (available.length < 2) {
    return null;
  }

  const known = available.filter(({ index }) =>
    memory.has(index)
  );

  for (let i = 0; i < known.length; i++) {
    for (let j = i + 1; j < known.length; j++) {
      if (
        memory.get(known[i].index) ===
        memory.get(known[j].index)
      ) {
        return [known[i].index, known[j].index];
      }
    }
  }

  const unknown = available.filter(
    ({ index }) => !memory.has(index)
  );

  const first = pick(unknown.length ? unknown : available)
    .index;
  const firstFace = cards[first].face;

  const remembered = available.find(
    ({ index }) =>
      index !== first && memory.get(index) === firstFace
  );

  if (remembered) {
    return [first, remembered.index];
  }

  const rest = available.filter(({ index }) => index !== first);
  const restUnknown = rest.filter(
    ({ index }) => !memory.has(index)
  );

  return [first, pick(restUnknown.length ? restUnknown : rest).index];
}

const wait = (ms: number, bucket: number[]) =>
  new Promise<void>((resolve) => {
    bucket.push(window.setTimeout(resolve, ms));
  });

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MemoryMatchGame() {
  const [mode, setMode] = useState<Mode>("solo");
  const [sizeIndex, setSizeIndex] = useState(1);
  const [difficulty, setDifficulty] =
    useState<Difficulty>("medium");

  const size = SIZE_OPTIONS[sizeIndex];

  const [cards, setCards] = useState<Card[]>(() =>
    makeDeck(size.pairs)
  );
  const [flipped, setFlipped] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  // vs-AI state
  const [turn, setTurn] = useState<Owner>("player");
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const memory = useRef<Map<number, string>>(new Map());

  // solo state
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  const over = cards.every((card) => card.matched);
  const playersTurn = mode === "solo" || turn === "player";

  const remember = (index: number, face: string) => {
    if (Math.random() < MEMORY_STRENGTH[difficulty]) {
      memory.current.set(index, face);
    }
  };

  // Solo timer.
  useEffect(() => {
    if (mode !== "solo" || !started || over) {
      return;
    }

    const id = window.setInterval(
      () => setElapsed((e) => e + 1),
      1000
    );

    return () => window.clearInterval(id);
  }, [mode, started, over]);

  // Evaluate the player's two face-up cards.
  useEffect(() => {
    if (flipped.length !== 2) {
      return;
    }

    if (mode === "ai" && turn !== "player") {
      return;
    }

    setBusy(true);
    const [a, b] = flipped;
    const isMatch = cards[a].face === cards[b].face;

    const id = window.setTimeout(() => {
      if (isMatch) {
        setCards((prev) =>
          prev.map((card, index) =>
            index === a || index === b
              ? { ...card, matched: "player" }
              : card
          )
        );
        if (mode === "ai") {
          setScores((s) => ({ ...s, player: s.player + 1 }));
        }
      }

      setFlipped([]);
      setBusy(false);

      if (mode === "solo") {
        setMoves((m) => m + 1);
      } else if (!isMatch) {
        setTurn("ai");
      }
    }, 850);

    return () => window.clearTimeout(id);
  }, [flipped, turn, mode, cards]);

  // The AI plays its whole turn, then hands back.
  useEffect(() => {
    if (mode !== "ai" || turn !== "ai" || over) {
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    setBusy(true);

    (async () => {
      await wait(650, timers);
      const working = cards.map((card) => ({ ...card }));

      while (!cancelled) {
        const decision = decideAiMove(working, memory.current);
        if (!decision) break;

        const [a, b] = decision;

        setFlipped([a]);
        remember(a, working[a].face);
        await wait(750, timers);
        if (cancelled) return;

        setFlipped([a, b]);
        remember(b, working[b].face);
        await wait(950, timers);
        if (cancelled) return;

        if (working[a].face === working[b].face) {
          working[a].matched = "ai";
          working[b].matched = "ai";
          setCards(working.map((card) => ({ ...card })));
          setScores((s) => ({ ...s, ai: s.ai + 1 }));
          setFlipped([]);

          if (working.every((card) => card.matched)) break;

          await wait(500, timers);
          if (cancelled) return;
          continue;
        }

        setFlipped([]);
        setTurn("player");
        break;
      }

      if (!cancelled) {
        setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, over, mode]);

  function handleClick(index: number) {
    if (
      !playersTurn ||
      busy ||
      over ||
      cards[index].matched ||
      flipped.includes(index) ||
      flipped.length >= 2
    ) {
      return;
    }

    if (mode === "solo" && !started) {
      setStarted(true);
    }

    remember(index, cards[index].face);
    setFlipped((prev) => [...prev, index]);
  }

  function reset(
    overrides: {
      mode?: Mode;
      sizeIndex?: number;
      difficulty?: Difficulty;
    } = {}
  ) {
    const nextMode = overrides.mode ?? mode;
    const nextSizeIndex = overrides.sizeIndex ?? sizeIndex;
    const nextDifficulty =
      overrides.difficulty ?? difficulty;

    memory.current.clear();
    setMode(nextMode);
    setSizeIndex(nextSizeIndex);
    setDifficulty(nextDifficulty);
    setCards(makeDeck(SIZE_OPTIONS[nextSizeIndex].pairs));
    setFlipped([]);
    setBusy(false);
    setTurn("player");
    setScores({ player: 0, ai: 0 });
    setMoves(0);
    setElapsed(0);
    setStarted(false);
  }

  const status = (() => {
    if (over) {
      if (mode === "solo") {
        return {
          text: `Solved in ${moves} moves · ${formatTime(elapsed)}`,
          tone: "win" as const,
        };
      }

      if (scores.player > scores.ai) {
        return { text: "You win!", tone: "win" as const };
      }
      if (scores.player < scores.ai) {
        return { text: "AI wins", tone: "lose" as const };
      }
      return { text: "It's a tie", tone: "muted" as const };
    }

    if (mode === "solo") {
      return { text: "Match all the pairs", tone: "muted" as const };
    }

    return {
      text: turn === "player" ? "Your turn" : "AI is playing…",
      tone: "muted" as const,
    };
  })();

  const emojiSize =
    size.cols === 6
      ? "text-2xl sm:text-3xl"
      : "text-3xl sm:text-4xl";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="mx-auto w-full max-w-lg">
        <div
          className={cn(
            "grid gap-2.5 sm:gap-3",
            size.cols === 6 ? "grid-cols-6" : "grid-cols-4"
          )}
        >
          {cards.map((card, index) => {
            const faceUp =
              !!card.matched || flipped.includes(index);

            return (
              <button
                key={card.id}
                type="button"
                disabled={!playersTurn || busy || faceUp}
                onClick={() => handleClick(index)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl shadow-sm ring-1 transition-all",
                  emojiSize,
                  faceUp
                    ? "bg-card ring-foreground/[0.07]"
                    : "cursor-pointer bg-primary/90 ring-primary/20 hover:bg-primary",
                  card.matched === "player" &&
                    "ring-2 ring-primary",
                  card.matched === "ai" &&
                    "opacity-70 ring-2 ring-muted-foreground/40"
                )}
              >
                <span
                  className={cn(
                    "transition-opacity",
                    faceUp ? "opacity-100" : "opacity-0"
                  )}
                >
                  {card.face}
                </span>
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

        {mode === "ai" ? (
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl bg-card p-3 text-center ring-1",
                turn === "player" && !over
                  ? "ring-primary"
                  : "ring-foreground/[0.07]"
              )}
            >
              <p className="text-xs text-muted-foreground">
                You
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {scores.player}
              </p>
            </div>

            <div
              className={cn(
                "rounded-xl bg-card p-3 text-center ring-1",
                turn === "ai" && !over
                  ? "ring-primary"
                  : "ring-foreground/[0.07]"
              )}
            >
              <p className="text-xs text-muted-foreground">
                AI
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {scores.ai}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-card p-3 text-center ring-1 ring-foreground/[0.07]">
              <p className="text-xs text-muted-foreground">
                Moves
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {moves}
              </p>
            </div>

            <div className="rounded-xl bg-card p-3 text-center ring-1 ring-foreground/[0.07]">
              <p className="text-xs text-muted-foreground">
                Time
              </p>
              <p className="text-xl font-semibold tabular-nums">
                {formatTime(elapsed)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Mode
          </p>

          <div className="flex rounded-lg bg-muted p-1">
            {(["solo", "ai"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => reset({ mode: value })}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  mode === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {value === "solo" ? "Solo" : "vs AI"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Tiles
          </p>

          <div className="flex rounded-lg bg-muted p-1">
            {SIZE_OPTIONS.map((option, index) => (
              <button
                key={option.tiles}
                type="button"
                onClick={() => reset({ sizeIndex: index })}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-medium tabular-nums transition-colors",
                  sizeIndex === index
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.tiles}
              </button>
            ))}
          </div>
        </div>

        {mode === "ai" ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              AI memory
            </p>

            <div className="flex rounded-lg bg-muted p-1">
              {(["easy", "medium", "hard"] as const).map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      reset({ difficulty: value })
                    }
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
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
          </div>
        ) : null}

        <Button
          size="sm"
          className="w-full"
          onClick={() => reset()}
        >
          <RefreshCw />
          New game
        </Button>
      </div>
    </div>
  );
}
