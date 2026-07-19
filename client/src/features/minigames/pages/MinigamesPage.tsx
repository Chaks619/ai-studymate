import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/layouts/DashboardLayout";

interface Game {
  slug: string;
  name: string;
  description: string;
  glyph: string;
  available: boolean;
}

const GAMES: Game[] = [
  {
    slug: "chess",
    name: "Chess",
    description:
      "Play a full game against the computer. Three difficulty levels.",
    glyph: "♞",
    available: true,
  },
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "A quick round against an unbeatable AI.",
    glyph: "⨯",
    available: true,
  },
  {
    slug: "memory",
    name: "Memory Match",
    description:
      "Match every pair — solo against the clock or turn-by-turn vs the AI.",
    glyph: "🧠",
    available: true,
  },
  {
    slug: "2048",
    name: "2048",
    description:
      "Slide and merge tiles to reach 2048. One more move…",
    glyph: "🔢",
    available: true,
  },
  {
    slug: "speed-math",
    name: "Speed Math",
    description:
      "Solve as many problems as you can before the timer runs out.",
    glyph: "➗",
    available: true,
  },
];

export function MinigamesPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            <Gamepad2 className="size-6 text-primary" />
            Minigames
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Take a study break — play a quick game against the
            AI.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {GAMES.map((game, index) => (
            <button
              key={game.slug}
              type="button"
              disabled={!game.available}
              onClick={() =>
                navigate(`/minigames/${game.slug}`)
              }
              style={{ animationDelay: `${index * 55}ms` }}
              className={cn(
                "animate-enter group relative overflow-hidden rounded-2xl bg-card p-5 text-left shadow-sm ring-1 ring-foreground/[0.07] transition-all duration-200",
                game.available
                  ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:ring-foreground/12"
                  : "cursor-not-allowed opacity-60"
              )}
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-2xl leading-none text-primary">
                  {game.glyph}
                </span>

                {!game.available ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                    Coming soon
                  </span>
                ) : null}
              </div>

              <h3 className="mt-4 font-heading font-semibold tracking-tight text-foreground">
                {game.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {game.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
