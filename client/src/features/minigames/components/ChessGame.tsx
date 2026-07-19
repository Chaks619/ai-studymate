import { useEffect, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { RefreshCw, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { findBestMove } from "../chess/engine";
import { ChessBoard } from "./ChessBoard";

type Color = "w" | "b";
type Difficulty = "easy" | "medium" | "hard";

interface EngineMove {
  from: string;
  to: string;
  promotion?: string;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

function chooseAiMove(
  game: Chess,
  difficulty: Difficulty
): EngineMove | null {
  // Easy occasionally throws a random move so beginners can win.
  if (difficulty === "easy" && Math.random() < 0.35) {
    const moves = game.moves({ verbose: true });
    const move =
      moves[Math.floor(Math.random() * moves.length)];

    return move
      ? {
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        }
      : null;
  }

  const depth = difficulty === "hard" ? 3 : 2;

  return findBestMove(game, depth);
}

function kingSquare(game: Chess, color: Color): string | null {
  for (const row of game.board()) {
    for (const cell of row) {
      if (cell && cell.type === "k" && cell.color === color) {
        return cell.square;
      }
    }
  }

  return null;
}

const GLYPH: Record<string, string> = {
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const START: Record<string, number> = {
  q: 1,
  r: 2,
  b: 2,
  n: 2,
  p: 8,
};

const VALUE: Record<string, number> = {
  q: 9,
  r: 5,
  b: 3,
  n: 3,
  p: 1,
};

// Pieces of `color` that have been captured — the difference between a full
// army and what's left on the board.
function capturedPieces(game: Chess, color: Color): string[] {
  const onBoard: Record<string, number> = {
    q: 0,
    r: 0,
    b: 0,
    n: 0,
    p: 0,
  };

  for (const row of game.board()) {
    for (const cell of row) {
      if (cell && cell.color === color && cell.type !== "k") {
        onBoard[cell.type] += 1;
      }
    }
  }

  const captured: string[] = [];

  for (const type of ["q", "r", "b", "n", "p"]) {
    for (let i = 0; i < START[type] - onBoard[type]; i++) {
      captured.push(type);
    }
  }

  return captured;
}

function materialValue(pieces: string[]): number {
  return pieces.reduce((sum, type) => sum + VALUE[type], 0);
}

function CapturedTray({
  pieces,
  color,
  advantage,
}: {
  pieces: string[];
  color: Color;
  advantage: number;
}) {
  return (
    <div className="flex h-6 items-center gap-2 px-1">
      <div className="flex items-center">
        {pieces.map((type, index) => (
          <span
            key={index}
            className="text-lg leading-none"
            style={
              color === "w"
                ? {
                    color: "#f8f8f8",
                    WebkitTextStroke:
                      "0.75px rgba(28,28,28,0.6)",
                  }
                : { color: "#151515" }
            }
          >
            {GLYPH[type]}
          </span>
        ))}
      </div>

      {advantage > 0 ? (
        <span className="text-xs font-semibold text-muted-foreground">
          +{advantage}
        </span>
      ) : null}
    </div>
  );
}

export function ChessGame() {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());

  const [playerColor, setPlayerColor] =
    useState<Color>("w");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("medium");

  const [selected, setSelected] = useState<Square | null>(
    null
  );
  const [legalTargets, setLegalTargets] = useState<
    Set<string>
  >(new Set());
  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [thinking, setThinking] = useState(false);

  const game = gameRef.current;
  const isOver = game.isGameOver();
  const playersTurn =
    game.turn() === playerColor && !isOver;

  const clearSelection = () => {
    setSelected(null);
    setLegalTargets(new Set());
  };

  // The AI moves whenever it's its turn. Driven off `fen` so it fires both
  // after each player move and immediately when the player picks Black.
  useEffect(() => {
    const g = gameRef.current;

    if (g.isGameOver() || g.turn() === playerColor) {
      return;
    }

    setThinking(true);

    const id = window.setTimeout(() => {
      const move = chooseAiMove(g, difficulty);

      if (move) {
        g.move(move);
        setLastMove({ from: move.from, to: move.to });
        setFen(g.fen());
      }

      setThinking(false);
    }, 350);

    return () => window.clearTimeout(id);
  }, [fen, playerColor, difficulty]);

  function handleSquareClick(square: Square) {
    const g = gameRef.current;

    if (thinking || g.isGameOver() || g.turn() !== playerColor) {
      return;
    }

    const piece = g.get(square);

    if (selected) {
      if (square === selected) {
        clearSelection();
        return;
      }

      if (legalTargets.has(square)) {
        const moving = g.get(selected);
        const promotes =
          moving?.type === "p" &&
          (square[1] === "8" || square[1] === "1");

        g.move({
          from: selected,
          to: square,
          promotion: promotes ? "q" : undefined,
        });

        setLastMove({ from: selected, to: square });
        clearSelection();
        setFen(g.fen());
        return;
      }

      if (piece && piece.color === playerColor) {
        selectSquare(square);
        return;
      }

      clearSelection();
      return;
    }

    if (piece && piece.color === playerColor) {
      selectSquare(square);
    }
  }

  function selectSquare(square: Square) {
    const targets = new Set(
      gameRef.current
        .moves({ square, verbose: true })
        .map((move) => move.to)
    );

    setSelected(square);
    setLegalTargets(targets);
  }

  function newGame(color: Color) {
    gameRef.current = new Chess();
    setPlayerColor(color);
    clearSelection();
    setLastMove(null);
    setThinking(false);
    setFen(gameRef.current.fen());
  }

  function undo() {
    const g = gameRef.current;

    if (thinking || g.history().length === 0) {
      return;
    }

    g.undo();

    // Step back past the AI's reply too, so it lands on the player's turn.
    if (
      g.history().length > 0 &&
      g.turn() !== playerColor
    ) {
      g.undo();
    }

    const history = g.history({ verbose: true });
    const previous = history[history.length - 1];

    clearSelection();
    setLastMove(
      previous
        ? { from: previous.from, to: previous.to }
        : null
    );
    setFen(g.fen());
  }

  const status = (() => {
    if (game.isCheckmate()) {
      const youWin = game.turn() !== playerColor;
      return {
        text: youWin
          ? "Checkmate — you win!"
          : "Checkmate — AI wins",
        tone: youWin ? "win" : "lose",
      } as const;
    }

    if (game.isStalemate()) {
      return { text: "Draw — stalemate", tone: "draw" } as const;
    }

    if (game.isDraw()) {
      return { text: "Draw", tone: "draw" } as const;
    }

    if (thinking) {
      return { text: "AI is thinking…", tone: "muted" } as const;
    }

    if (playersTurn) {
      return {
        text: game.inCheck() ? "Your move — check!" : "Your move",
        tone: game.inCheck() ? "warn" : "muted",
      } as const;
    }

    return { text: "AI's move", tone: "muted" } as const;
  })();

  const checkSquare =
    game.inCheck() && !isOver
      ? kingSquare(game, game.turn())
      : null;

  const aiColor: Color = playerColor === "w" ? "b" : "w";
  const capturedByPlayer = capturedPieces(game, aiColor);
  const capturedByAi = capturedPieces(game, playerColor);
  const playerAdvantage =
    materialValue(capturedByPlayer) -
    materialValue(capturedByAi);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="mx-auto w-full max-w-2xl space-y-2">
        {/* Opponent's tray: the pieces the AI has captured. */}
        <CapturedTray
          pieces={capturedByAi}
          color={playerColor}
          advantage={-playerAdvantage}
        />

        <ChessBoard
          board={game.board()}
          orientation={playerColor}
          selected={selected}
          legalTargets={legalTargets}
          lastMove={lastMove}
          checkSquare={checkSquare}
          disabled={!playersTurn}
          onSquareClick={handleSquareClick}
        />

        <CapturedTray
          pieces={capturedByPlayer}
          color={aiColor}
          advantage={playerAdvantage}
        />
      </div>

      <div className="space-y-6">
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium ring-1",
            status.tone === "win" &&
              "bg-success/10 text-success ring-success/20",
            status.tone === "lose" &&
              "bg-destructive/10 text-destructive ring-destructive/20",
            status.tone === "warn" &&
              "bg-warning/10 text-warning ring-warning/20",
            (status.tone === "muted" ||
              status.tone === "draw") &&
              "bg-card text-foreground ring-foreground/[0.07]"
          )}
        >
          <div className="flex items-center gap-2">
            {thinking ? (
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-current"
                    style={{
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </span>
            ) : null}
            {status.text}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Difficulty
          </p>

          <div className="flex rounded-lg bg-muted p-1">
            {DIFFICULTIES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  difficulty === option.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            New difficulty applies from your next game.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Play as
          </p>

          <div className="flex gap-2">
            <Button
              variant={
                playerColor === "w" ? "default" : "outline"
              }
              size="sm"
              className="flex-1"
              onClick={() => newGame("w")}
            >
              White
            </Button>
            <Button
              variant={
                playerColor === "b" ? "default" : "outline"
              }
              size="sm"
              className="flex-1"
              onClick={() => newGame("b")}
            >
              Black
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={undo}
            disabled={
              thinking || game.history().length === 0
            }
          >
            <RotateCcw />
            Undo
          </Button>

          <Button
            size="sm"
            className="flex-1"
            onClick={() => newGame(playerColor)}
          >
            <RefreshCw />
            New game
          </Button>
        </div>
      </div>
    </div>
  );
}
