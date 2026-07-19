import { Chess } from "chess.js";

/**
 * A small chess AI: negamax-flavoured minimax with alpha-beta pruning, plain
 * material plus Tomasz Michniewski's simplified piece-square tables. Strong
 * enough to punish blunders, light enough to run on the main thread for a
 * casual game. All evaluation is from White's point of view (positive = White
 * is better).
 */

type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

const PIECE_VALUE: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

const MATE = 1_000_000;

// Tables are written rank-8-first (index 0 = a8), from White's perspective.
// Black pieces read the vertically-mirrored square.
const PST: Record<PieceType, number[]> = {
  p: [
    0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30,
    20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5,
    -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0,
    0,
  ],
  n: [
    -50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30,
    0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20,
    20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20,
    -40, -50, -40, -30, -30, -30, -30, -40, -50,
  ],
  b: [
    -20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0,
    5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10,
    0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20,
    -10, -10, -10, -10, -10, -10, -20,
  ],
  r: [
    0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0,
    -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0,
    0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0,
  ],
  q: [
    -20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5,
    5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5,
    5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10,
    -10, -20,
  ],
  k: [
    -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40,
    -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40,
    -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20,
    -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20,
  ],
};

function evaluate(game: Chess): number {
  if (game.isCheckmate()) {
    // Side to move is mated. Bad for whoever must move.
    return game.turn() === "w" ? -MATE : MATE;
  }

  if (game.isDraw() || game.isStalemate()) {
    return 0;
  }

  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r]?.[f];

      if (!piece) {
        continue;
      }

      const type = piece.type as PieceType;
      const base = PIECE_VALUE[type];

      if (piece.color === "w") {
        score += base + (PST[type][r * 8 + f] ?? 0);
      } else {
        score -= base + (PST[type][(7 - r) * 8 + f] ?? 0);
      }
    }
  }

  return score;
}

interface EngineMove {
  from: string;
  to: string;
  promotion?: string;
}

// Captures first — cheap move ordering that sharpens alpha-beta pruning.
function orderedMoves(game: Chess) {
  return game.moves({ verbose: true }).sort((a, b) => {
    const av = a.captured
      ? PIECE_VALUE[a.captured as PieceType]
      : 0;
    const bv = b.captured
      ? PIECE_VALUE[b.captured as PieceType]
      : 0;

    return bv - av;
  });
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluate(game);
  }

  const moves = orderedMoves(game);

  if (game.turn() === "w") {
    let best = -Infinity;

    for (const move of moves) {
      game.move(move);
      best = Math.max(
        best,
        minimax(game, depth - 1, alpha, beta)
      );
      game.undo();

      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }

    return best;
  }

  let best = Infinity;

  for (const move of moves) {
    game.move(move);
    best = Math.min(
      best,
      minimax(game, depth - 1, alpha, beta)
    );
    game.undo();

    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }

  return best;
}

/**
 * Best move for the side to move at the given search depth, or null if the
 * game is already over. Mutates then restores the passed game via move/undo,
 * so it leaves the position untouched.
 */
export function findBestMove(
  game: Chess,
  depth: number
): EngineMove | null {
  const moves = orderedMoves(game);

  if (moves.length === 0) {
    return null;
  }

  const maximizing = game.turn() === "w";
  let best = maximizing ? -Infinity : Infinity;
  let bestMove = moves[0]!;

  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of moves) {
    game.move(move);
    const score = minimax(game, depth - 1, alpha, beta);
    game.undo();

    if (maximizing) {
      if (score > best) {
        best = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, best);
    } else {
      if (score < best) {
        best = score;
        bestMove = move;
      }
      beta = Math.min(beta, best);
    }

    if (beta <= alpha) break;
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    promotion: bestMove.promotion,
  };
}
