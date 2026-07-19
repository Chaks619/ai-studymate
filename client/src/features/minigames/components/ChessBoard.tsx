import type { Chess, Square } from "chess.js";

import { cn } from "@/lib/utils";

type BoardMatrix = ReturnType<Chess["board"]>;

interface Props {
  board: BoardMatrix;
  orientation: "w" | "b";
  selected: Square | null;
  legalTargets: Set<string>;
  lastMove: { from: string; to: string } | null;
  checkSquare: string | null;
  disabled: boolean;
  onSquareClick: (square: Square) => void;
}

// Solid glyphs for both colours; the fill and outline come from CSS so a piece
// stays legible on either square shade.
const GLYPH: Record<string, string> = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const FILES = "abcdefgh";

export function ChessBoard({
  board,
  orientation,
  selected,
  legalTargets,
  lastMove,
  checkSquare,
  disabled,
  onSquareClick,
}: Props) {
  const order =
    orientation === "w"
      ? [0, 1, 2, 3, 4, 5, 6, 7]
      : [7, 6, 5, 4, 3, 2, 1, 0];

  return (
    <div className="grid aspect-square w-full grid-cols-8 overflow-hidden rounded-xl shadow-md ring-1 ring-foreground/10 select-none">
      {order.map((r, ri) =>
        order.map((f, fi) => {
          const piece = board[r]?.[f] ?? null;
          const square = `${FILES[f]}${8 - r}` as Square;

          const isLight = (r + f) % 2 === 0;
          const coordColor = isLight
            ? "rgba(70,90,110,0.75)"
            : "rgba(233,237,242,0.85)";
          const showRank = fi === 0;
          const showFile = ri === 7;
          const isSelected = selected === square;
          const isTarget = legalTargets.has(square);
          const isCapture = isTarget && !!piece;
          const isLast =
            !!lastMove &&
            (lastMove.from === square ||
              lastMove.to === square);
          const isCheck = checkSquare === square;

          return (
            <button
              key={square}
              type="button"
              disabled={disabled}
              onClick={() => onSquareClick(square)}
              aria-label={square}
              className={cn(
                "relative flex aspect-square items-center justify-center",
                disabled ? "cursor-default" : "cursor-pointer"
              )}
              style={{
                backgroundColor: isLight
                  ? "#e9edf2"
                  : "#7f97ac",
              }}
            >
              {isLast ? (
                <span className="absolute inset-0 bg-primary/25" />
              ) : null}

              {isCheck ? (
                <span className="absolute inset-0 bg-red-500/45" />
              ) : null}

              {isSelected ? (
                <span className="absolute inset-0 ring-2 ring-primary ring-inset" />
              ) : null}

              {isCapture ? (
                <span className="absolute inset-1 rounded-full ring-[3px] ring-primary/60 ring-inset" />
              ) : null}

              {piece ? (
                <span
                  className="relative z-10 text-[7.5vw] leading-none sm:text-4xl md:text-[2.75rem]"
                  style={
                    piece.color === "w"
                      ? {
                          color: "#f8f8f8",
                          WebkitTextStroke:
                            "1.25px rgba(28,28,28,0.6)",
                        }
                      : {
                          color: "#151515",
                          WebkitTextStroke:
                            "1px rgba(255,255,255,0.14)",
                        }
                  }
                >
                  {GLYPH[piece.type]}
                </span>
              ) : null}

              {isTarget && !isCapture ? (
                <span className="absolute z-10 size-1/4 rounded-full bg-primary/50" />
              ) : null}

              {showRank ? (
                <span
                  className="pointer-events-none absolute top-0.5 left-1 text-[0.6rem] font-semibold"
                  style={{ color: coordColor }}
                >
                  {8 - r}
                </span>
              ) : null}

              {showFile ? (
                <span
                  className="pointer-events-none absolute right-1 bottom-0.5 text-[0.6rem] font-semibold"
                  style={{ color: coordColor }}
                >
                  {FILES[f]}
                </span>
              ) : null}
            </button>
          );
        })
      )}
    </div>
  );
}
